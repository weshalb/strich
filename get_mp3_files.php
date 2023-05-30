<?php
$upload_folder = "uploads/";

$mp3Files = [];
foreach (glob($upload_folder . "*.mp3") as $file) {
  $fileName = basename($file);
  $filePath = $upload_folder . $fileName;
  $mp3Files[] = [
    'name' => $fileName,
    'url' => $filePath
  ];
}

header('Content-Type: application/json');
echo json_encode($mp3Files);
?>
