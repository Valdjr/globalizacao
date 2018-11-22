<?php
    session_start();
    $resultado = false;
    if ($_POST["palavra"] == $_SESSION["palavra"]){
        $resultado = true;
    }
    echo json_encode($resultado);
?>