<?php
    session_start();

    require_once 'conexao.php';

    $resultado = false;
    if ($_POST["palavra"] == $_SESSION["palavra"]){

        $con = Conexao::getInstance();

        if ($con->connect_errno) {
            echo "Failed to connect to MySQL: " . $con->connect_error;
        }


        $id = $_POST['id'];
        $nome = $_POST['nome'];
        $comentario = $_POST['comentario'];
        $acao = $_POST['acao'];

        if($acao == 1) {

            $retorno = $con->query("SELECT votos FROM comentario WHERE id = {$id}");
            while($obj = $retorno->fetch_assoc()){
                $dados[] = $obj;
            }
            $votos = $dados[0]['votos'];
            $votos += 1;

            $con->query("UPDATE comentario SET votos = '{$votos}' WHERE id = {$id}");

        } else if($acao == 2) {

            $retorno = $con->query("SELECT votos FROM comentario WHERE id = {$id}");
            while($obj = $retorno->fetch_assoc()){
                $dados[] = $obj;
            }
            $votos = $dados[0]['votos'];
            $votos -= 1;

            $con->query("UPDATE comentario SET votos = '{$votos}' WHERE id = {$id}");

        } else {

            $sql = "INSERT INTO comentario (comentario,nome) VALUES ('{$comentario}','{$nome}')";
            $result = $con->query($sql);

        }

        $resultado = true;
    }
    echo json_encode($resultado);
?>
