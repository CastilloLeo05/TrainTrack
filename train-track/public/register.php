<?php //register

require 'config.php';
require 'functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $data['action'] ?? '';

if ($action === 'register') {

    $identifier = $data['email'] ?? $data['em'] ?? '';
    $username = $data['username'] ?? $data['user'] ?? '';
    $password = $data['password'] ?? $data['pass'] ?? '';

    $sql = "SELECT * FROM Users WHERE Email = '$identifier';"; //check if email exist
    $result  = $conn->query($sql);

    if($result && $result->num_rows === 0){

        $hash = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO Users (Email, password, username) 
        VALUES ('$identifier', '$hash', '$username');"; //insert user info

        if($conn->query($sql) === true) {

            echo json_encode(["success" => true, $sql, $username]);
            
        }else{
            echo json_encode(["success" => false,"error" => "Error: " . $conn->error]);
            http_response_code(500);
        }
    }else{
        http_response_code(400);
        echo json_encode(["success" => false,"error" => "Error", "message:" => "User already exist"]);
    }
}else{
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    http_response_code(400);
}

$conn->close();