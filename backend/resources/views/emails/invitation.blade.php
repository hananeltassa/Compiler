<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaboration Invitation</title>
    <style>
        @import url('{{ asset('css/email-style.css') }}');
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You're Invited to Collaborate!</h1>
        </div>

        <div class="content">
            <p>Hi,</p>
            <p>You have been invited to collaborate on a file. Click the link below to accept the invitation:</p>

            <!-- The dynamic invitation link -->
            <p><a href="{{ $acceptLink }}" class="btn accept-btn">Accept Invitation</a></p>
            <p><a href="{{ $denyLink }}" class="btn deny-btn">Deny Invitation</a></p>

            <p>If you did not request this, please ignore this email.</p>
        </div>

        <div class="footer">
            <p>Thank you for using our platform!</p>
        </div>
    </div>
</body>
</html>
