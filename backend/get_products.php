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

$role = trim($data["role"] ?? "");
$owner_id = intval($data["owner_id"] ?? 0);

if ($role === "owner") {
    $sql = "SELECT * FROM product WHERE owner_id = ?";
    $stmt = sqlsrv_query($conn, $sql, [$owner_id]);
} else {
    $sql = "SELECT * FROM product";
    $stmt = sqlsrv_query($conn, $sql);
}

if ($stmt === false) {
    echo json_encode(["success" => false]);
    exit;
}

$products = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $products[] = $row;
}

echo json_encode(["success" => true, "products" => $products]);
?>