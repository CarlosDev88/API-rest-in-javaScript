<?php

if(isset($_POST)){
    error_reporting(0);

    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $comments = $_POST["comments"];

    $domain = $_SERVER["HTTP_HOST"];
    $to="arturorueda88@gmail.com";
    $subject ="Contacto desde el sitio $domain: $subject";
    $message = "
        <p>
            Datos enviados desde el formulario del sitio <b>$domain</b>            
        </p>
        <ul>
            <li>Nombre: <b>$name</b></li>
            <li>Correo: <b>$email</b></li>
            <li>Asunto: $subject</li>
            <li>Comentario: $comments</li>
        </ul>
    ";

    $header="MIME-Version:1.0\r\n"."Content-Type: text/html; charset=utf-8\r\n".
    "From: Envio automatico No Responder <no-reply@$domain>";

   $send_mail = mail($to,$subject,$message,$header);

   if($send_mail){
    $res=[
        "err"=> false,
        "message"=>"Tus datos han sido enviados"
    ];
   }else{
    $res=[
        "err"=> true,
        "message"=>"Hubo un erro al enviar los  datos "
    ];  
   }

   header("Access-Control-Allow-Origin:*");   //esta es desde cualquier orige sin seguridad
   header("Access-Control-Allow-Origin:https//elDominoDelQueResivoPeticiones");
   header('Content-type:application/json');
   echo json_encode($res);
   exit;

}