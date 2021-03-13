import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Row, Col, Image } from 'react-bootstrap';
import toastr from 'toastr';
import Spinner from './Spinner/normal';

const mapStyles = {
  width: '100%',
  height: '100%',
};

function errorHandler(err) {
  alert(err.message);
}

var latitude = '';
var longitude = '';
var marker = '';

export class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  // Hides or shows the InfoWindow
      activeMarker: {},          // Shows the active marker upon click
      selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
      showPassenger: localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0?true:false,
      showDriver: localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 1?true:false,
      showAdmin: localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 2?true:false,
      drivers: [],
      isLoaded: false,
      profileimg: {},
      location: '',
      current_lat: '',
      current_long: '',
      mylocationshowingInfo: false,
      departure: props.departure,
      destination: props.destination,
      directionsDisplay: new google.maps.DirectionsRenderer()
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.mylocationClick = this.mylocationClick.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.onClose = this.onClose.bind(this);
  }

    handleMapLoad(props) {
      if(this.state.showDriver) {
        var directionsService = new google.maps.DirectionsService();
        this.state.directionsDisplay.setMap(null);
        
        this.state.directionsDisplay.setMap(this.refs.google_map.map);
        var directionsDisplay = this.state.directionsDisplay

        var map = this.refs.google_map.map;
         // Start/Finish icons
        var icons = {
          start: new google.maps.MarkerImage(
            // URL
            'assets/images/location/start.gif',
            // (width,height)
            new google.maps.Size( 40, 62 ),
            // The origin point (x,y)
            new google.maps.Point( 0, 0 ),
            // The anchor point (x,y)
            new google.maps.Point( 25, 25 )
          ),
          end: new google.maps.MarkerImage(
            // URL
            'assets/images/location/end.gif',
            // (width,height)
            new google.maps.Size( 40, 62 ),
            // The origin point (x,y)
            new google.maps.Point( 0, 0 ),
            // The anchor point (x,y)
            new google.maps.Point( 25, 25 )
          )
        };

        function makeMarker(position, icon, title, map) {
          marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: title
           });
        };

        const makeRequest = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            
            directionsService.route({
              origin: props.departure,
              destination: props.destination,
              travelMode: 'DRIVING'
          }, function(response, status) {
            if (status === 'OK') { 
              directionsDisplay.setDirections(response);
              directionsDisplay.setOptions( { suppressMarkers: true } );  //original marker hidden
              var leg = response.routes[0].legs[0];

              if (marker && marker.setMap) {
                marker.setMap(null);
              }
              
              makeMarker( leg.start_location, icons.start, "title", map);
              makeMarker( leg.end_location, icons.end, 'title', map);
            } else {
              toastr.error('Directions request failed due to ' + status);
            }
          });
        }
        makeRequest();
      }
    }

  componentDidMount() {
    //get current location of owner
    // if (!this.state.showAdmin) {
    this.intervalpublic = setInterval(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }, errorHandler);
      if (latitude != '' || longitude != '') {
        this.setState({
          isLoaded: true,
          current_lat: latitude,
          current_long: longitude
        })
      }
    }, 1000);
    // }

    // get location of ordered drivers in real time(when passenger)
    if (this.state.showPassenger) {
      this.intervalpassenger = setInterval(() => {
        var requestOptions = {
          method: 'GET',  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
          },
        };
        
        fetch("/api/getorderdrivers", requestOptions)
          .then(response => response.text())
          .then(result => {
            this.setState({
              isLoaded: true,
              drivers: JSON.parse(result).drivers
            })
          })
          .catch(error => {
            console.log("driver manage")
            console.log('error', error)
          });
      }, 10000);
    }

    //get location of all drivers in real time (when admin)
    if (this.state.showAdmin) {
      this.intervaladmin = setInterval(() => {
        var requestOptions = {
          method: 'GET',  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
          },
        };
        
        fetch("/api/getalldriver", requestOptions)
          .then(response => response.text())
          .then(result => {
            this.setState({
              isLoaded: true,
              drivers: JSON.parse(result).drivers
            })
          })
          .catch(error => {
            console.log("driver manage")
            console.log('error', error)
          });
      }, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalpassenger);
    clearInterval(this.intervaladmin);
    clearInterval(this.intervalpublic);
  }

  mylocationClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      mylocationshowingInfo: true,
    });
  } 

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      profileimg: props.image,
      location: props.location
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
    if (this.state.mylocationshowingInfo) {
      this.setState({
        mylocationshowingInfo: false,
        activeMarker: null
      });
    }
  };
  render() {
    if (!this.state.isLoaded) {
      return <div><Spinner /></div>
    } else {
      return (
        <Map
          ref="google_map"
          onClick={() => this.handleMapLoad(this.props)}
          google={this.props.google}
          zoom={10}
          mapTypeId= {google.maps.MapTypeId.ROADMAP}
          zoomControl= {false}
          panControl= {false}
          scaleControl= {false}
          mapTypeControl= {false}
          overviewMapControl= {false}
          streetViewControl= {false}  
          fullscreenControl= {false}
          style={mapStyles}
          // styles={customMap}
          departure={this.state.departure}
          destination={this.state.destination}
          initialCenter={{
           lat: this.state.current_lat,
           lng: this.state.current_long
          //  lat: 3.139003,
          //  lng: 101.686855
          }}
        >
          {this.handleMapLoad}
          <Marker
              content={"My location"}
              onClick={this.mylocationClick}
              icon={{
                url: "assets/images/location/mylocation.gif",
                scaledSize: {width: 100, height: 100},
                anchor: new google.maps.Point(50, 50),
              }}
            />
          {(this.state.showAdmin || this.state.showPassenger) && this.state.drivers.map((driver, index) => (
            <Marker
              key={index}
              position={{
                lat: driver.latitude,
                lng: driver.longitude
              }}
              onClick={this.onMarkerClick}
              name={driver.name}
              location={driver.current_location}
              image={driver.photo == '' || driver.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + driver.photo}
              icon={{
                url: "assets/images/location/car.png",
                scaledSize: {width: 20, height: 40},
                anchor: new google.maps.Point(15, 20),
              }}
            />
          ))}

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.mylocationshowingInfo}
              onClose={this.onClose}
            >
              <h6>{this.state.selectedPlace.content}</h6>
            </InfoWindow>

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
              <Row style={{margin: 0}}>
                <Col xs={12} className="text-center">
                  <h6>{this.state.selectedPlace.name}</h6>
                </Col>
                <Col xs={12} className="text-center">
                  <Image src={this.state.profileimg} style={{maxWidth: 130}}  className="rounded-circle" thumbnail></Image>
                </Col>
                <Col xs={12} className="text-center">
                  <h5 style={{fontSize: 12}}>{this.state.location}</h5>
                </Col>
              </Row>
            </InfoWindow>
          </Map>
      );
    }
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBoY4Yn60USF1fDNIm65QVpRBowNeBBgbA'
})(GoogleMap);