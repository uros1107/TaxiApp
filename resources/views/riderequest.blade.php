<!DOCTYPE html>
<html>
<head>
    <title>Your Ride Request</title>
</head>
<body>
    <div>
      <h3>Your new ride!</h3>
      <p>name: {{ $data['name'] }}</p>
      <p>email: {{ $data['email'] }}</p>
      <p>message: {{ $data['message'] }}</p>
      <p>Departure: {{ $data['departure'] }}</p>
      <p>Destination: {{ $data['destination'] }}</p>
      <p>Number of people: {{ $data['number_people'] }}</p>
      <p>Order time: {{ $data['order_time'] }}</p>
    </div>
</body>
</html>