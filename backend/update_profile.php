<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");

if ($user_id <= 0 || $name === "") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid data"
    ]);
    exit;
}

$sql = "
UPDATE customer
SET name = ?, phone = ?, address = ?
WHERE customer_id = ?
";

$params = [$name, $phone, $address, $user_id];

$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => sqlsrv_errors()
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Profile updated successfully"
]);
?>