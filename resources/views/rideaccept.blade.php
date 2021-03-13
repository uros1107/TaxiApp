<!DOCTYPE html>
<html>
<head>
    <title>Your ride request accepted</title>
</head>
<body>
    <div>
      <h3 style="color: blue !important">Accepted your ride!</h3>
      <p>Name: {{ $data['name'] }}</p>
      <p>Email: {{ $data['email'] }}</p>
      <p>Message: {{ $data['message'] }}</p>
      <p>Departure: {{ $data['departure'] }}</p>
      <p>Destination: {{ $data['destination'] }}</p>
      <p>Number of people: {{ $data['number_people'] }}</p>
      <p>Order time: {{ $data['order_time'] }}</p>
    </div>
</body>
</html>