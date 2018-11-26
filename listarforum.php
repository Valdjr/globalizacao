<?php

require_once 'conexao.php';

$pesquisa = isset($_POST['pesquisa']) ? $_POST['pesquisa'] : '' ;

$con = Conexao::getInstance();

if ($con->connect_errno) {
    echo "Failed to connect to MySQL: " . $con->connect_error;
}

$retorno = $con->query("SELECT * FROM comentario WHERE votos >= 0 and (comentario LIKE '%" . $pesquisa ."%' or nome LIKE '%" . $pesquisa ."%') ORDER BY votos DESC LIMIT 5");
$dados = [];
while($obj = $retorno->fetch_assoc()){
    $dados[] = $obj;
}

$retorno2 = $con->query("SELECT * FROM comentario WHERE votos < 0 and (comentario LIKE '%" . $pesquisa ."%' or nome LIKE '%" . $pesquisa ."%') ORDER BY votos ASC LIMIT 5");
$dados2 = [];
while($obj2 = $retorno2->fetch_assoc()){
    $dados2[] = $obj2;
}

$resultado = ['positivos' => $dados, 'negativos' => $dados2];

echo json_encode($resultado);
