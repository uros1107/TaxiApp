<!DOCTYPE html>
<html>
<head>
    @yield('title')
    <title>Mydcstaxi</title>

    <meta name="csrf-token" content="{{csrf_token()}}" />
    <meta name="google-site-verification" content="l74YPRPlflhmlVjCEmb6vrdekZFOflGtkgKllSnY_4E" />
    <meta name="description" content="Downtown Taxi is a taxi services based in Astoria Oregon.This is taxi booking. This is Mydcstaxi.com.  With service from Cannon Beach to Portland and everywhere in between.  Online booking.">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="keywords" content="taxi, booking, dcstaxi, mydcstaxi, my, dcs, order, ride, sharing, distance, passenger, driver, driver,admin, auth, downtown, coffee, astoria, uber, lyft, Downtowncoffeeshoptaxillc, shopping, shop, cab, taxi cab, car, rider, map, google,">
    <meta property="og:title" content="taxi, booking, dcstaxi, mydcstaxi, my, dcs, order, ride, sharing, distance, passenger, driver, driver,admin, auth, downtown, coffee, astoria, uber, lyft, Downtowncoffeeshoptaxillc, shopping, shop, cab, taxi cab, car, rider, map, google," />
    <meta property="og:description" content="Downtown Taxi is a taxi services based in Astoria Oregon.This is taxi booking. This is Mydcstaxi.com.  With service from Cannon Beach to Portland and everywhere in between.  Online booking." />
    <meta property="og:image" content="" />
    <meta name="author" content="GeniusOcean">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="{{asset('/css/app.css')}}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="https://unpkg.com/react@16.6.3/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16.6.3/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/moment@2.22.1/min/moment.min.js"></script>
    <script src="https://js.stripe.com/v2/"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.42&key=AIzaSyBoY4Yn60USF1fDNIm65QVpRBowNeBBgbA&libraries=places">
    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/javascript" src="{{ asset('/js/app.js')}}"></script>
</body>
</html>
