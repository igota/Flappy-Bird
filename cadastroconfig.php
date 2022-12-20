<?php
      //inclui a execução do arquivos criado para se conectar ao banco de dados local
      include_once('config.php');

      $nome =   $_POST['nome'] ; //captura os inputs e armazena nas variaveis
      $tema =   $_POST['tema'] ;
      $nivel =   $_POST['nivel'] ;
      $distancia =   $_POST['distancia'] ;
      $velocidade =   $_POST['velocidade'] ;
      $seleciona =   $_POST['select'] ;
      $tipo =   $_POST['tipo'] ;
      $personagem =   $_POST['personagem'] ;
      $pontuacao =   $_POST['pontos'] ;

      //insere os dados através do comando SQL INSERT INTO e relaciona com os campos criados na tabela config-jogo
      $result = mysqli_query($conexao, "INSERT INTO config(nome,cenario,intervalo,distancia,velocidadejogo,personagem,tipo,velocidadeperso,pontuacao) 
      VALUES('$nome','$tema','$nivel','$distancia','$velocidade','$seleciona','$tipo','$personagem','$pontuacao')");
      $stmt->bindParam(':nome', $nome );
      $stmt->bindParam(':tema', $tema );
      $stmt->bindParam(':nivel', $nivel );
      $stmt->bindParam(':distancia', $distancia );
      $stmt->bindParam(':velocidade', $velocidade );
      $stmt->bindParam(':select', $seleciona );
      $stmt->bindParam(':tipo', $tipo );
      $stmt->bindParam(':personagem', $personagem );
      $stmt->bindParam(':pontuacao', $pontuacao );
      $stmt->execute();






    

   

?>