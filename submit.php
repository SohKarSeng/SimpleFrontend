<?php

// —— Sanitize Inputs ——————————————————————————————————————————————————————————————
$firstName      = trim(htmlspecialchars($_POST['first_name'] ?? ''));
$lastName       = trim(htmlspecialchars($_POST['last_name'] ?? ''));
$email          = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$age            = filter_var($_POST['age'] ?? 0, FILTER_VALIDATE_INT);
$category       = trim(htmlspecialchars($_POST['category'] ?? ''));
$status         = trim(htmlspecialchars($_POST['status'] ?? 'active'));
$notes          = trim(htmlspecialchars($_POST['notes'] ?? ''));

$methods = $_SERVER['REQUEST_METHOD'];

if ($methods === 'GET') {
    $getEmail = $_GET['email'] ?? null;

    if (!$email) {
        http_response_code(400);
        echo json_encode(['error' => 'Email Is Required']);
        exit;
    }

    try {
        $stmt = $link->prepare("SELECT Email FROM UserInformation WHERE Email = :email");
        $stmt->execute([':email' => $getEmail]);
        $getUser = $stmt->fetch(POD::FETCH_ASSOC);

        if ($getUser) {
            echo json_encode($getUser);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User Not Found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else if ($methods === 'POST') {
    // —— Connection ———————————————————————————————————————————————————————————————————
    try {
        $link = new PDO(
            'mysql:host=localhost;dbname=mysqldb;charset=utf8mb4',
            'admin',
            '021@29',

            array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_PERSISTENT => false
            )
        );

        // —— Assigning Insert —————————————————————————————————————————————————————————————
        $handleInput = $link->prepare('insert into UserInformation (FirstName, LastName, Email, Age, Category, Status, Notes) 
                                        values (:firstName, :lastName, :email, :age, :category, :status, :notes)');
        $handleInput->bindParam(':firstName',   $firstName, PDO::PARAM_STR);
        $handleInput->bindParam(':lastName',    $lastName,  PDO::PARAM_STR);
        $handleInput->bindParam(':email',       $email,     PDO::PARAM_STR);
        $handleInput->bindParam(':age',         $age,       PDO::PARAM_INT);
        $handleInput->bindParam(':category',    $category,  PDO::PARAM_STR);
        $handleInput->bindParam(':status',      $status,    PDO::PARAM_STR);
        $handleInput->bindParam(':notes',       $notes,     PDO::PARAM_STR);
        $handleInput->execute();

        http_response_code(200);
        echo json_encode(['success' => true, 'id' => $link->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    // —— Other Possibilities ——————————————————————————————————————————————————————————
    http_response_code(405); /* Methods Not Allowed */
    echo json_encode(['error' => "Methods $methods not supported, check Frontend Triggering points."]);
}
?>