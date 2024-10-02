<?php
$visitor_email = $_POST['email'];
$message = $_POST['message'];

$email_form = 'xyz@website.com'; #domain email

$email_subject = 'Subscription Confirmation';

$email_body="User Email: $visitor_email.\n".
            "User Message: $message.\n";

$to = 'almuhaimen14@gmail.com';#personal inquirer email
$headers="From: $email_from \r\n";
$headers .="Reply-To: $visitor_email \r\n";

mail($to,$email_subject,$email_body,$headers);
header("Location: contact.html");

?>