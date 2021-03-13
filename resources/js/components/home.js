import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import TextsmsIcon from '@material-ui/icons/Textsms';
import Badge from '@material-ui/core/Badge';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Link, Redirect} from 'react-router-dom';
import GoogleMap from './googlemap';
import Guest from "./guest/guest";
import Passenger from "./passenger/passenger";
import Driver from "./driver/driver";
import Admin from "./admin/admin";
import { Button, Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import toastr from 'toastr';
import Spinner from './Spinner/index';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  formControl: {
    margin: "0px 10px",
    minWidth: 120,
    background: "white",
    width: "95%",
    padding: "0px 20px",
    borderRadius: 12,
    position:"absolute", 
    bottom:15, 
    right:0
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const locationStyle = {
  fontSize:20, 
  transform: "rotate(136deg)",
  color: "#27fd00"
}

const buttonStyle = {
  width: "100%", 
  // background:"#877ef2"
  // background:"#ff2462", 
  // borderRadius: "50px", 
  // borderColor: "#ff2462",
  // boxShadow: "#ec4272 0px 6px 23px -3px",
};

const menuStyle = {
  width:"32px", 
  boxShadow: "rgba(0, 0, 0, 0.398438) 0px 2px 4px"
};

const userStyle = {
  width:"32px", 
  boxShadow: "rgba(0, 0, 0, 0.398438) 0px 2px 4px",
  marginLeft: "10px"
};

const cardStyle = {
  borderRadius:"10px", 
  boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)"
};

const profileImage = {
  width: '130px',
  height: '130px',
  margin: "50px 0px 20px"
};

const profileName = {
  fontSize: 16, 
  color: "#7207ff",
}

const notifStyle = {
  // color: "#887ff2",
  color: "#ff2462",
  background: "white",
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  padding: "3px",
  marginLeft:"15px"
}

// get latitude and longitude from departure address
function getGeoLocate(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( 
      { 'address': address},
      function(results, status) {		            
      if (status === "OK") {
        if (results[0]) {
                  var latitude = results[0].geometry.location.lat();
                  var longitude = results[0].geometry.location.lng();	
          $('#dp_lat').val(latitude);
          $('#dp_lon').val(longitude);                    
        } 
      } else {
              alert("Geocoder failed due to: " + status);
      }
  }
  );   
}

// get latitude and longitude from destination address
function getGeoLocate1(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( 
      { 'address': address},
      function(results, status) {		            
      if (status === "OK") {
        if (results[0]) {
                  var latitude = results[0].geometry.location.lat();
                  var longitude = results[0].geometry.location.lng();	
          $('#ds_lat').val(latitude);
          $('#ds_lon').val(longitude);                    
        } 
      } else {
              alert("Geocoder failed due to: " + status);
      }
  }
  );   
}

var driver_datas = "";

export default function Home() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    flag: false
  });
  const [search_result, setSearch_result] = useState(false);
  const [showPassenger, setShowPassenger] = useState(localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0?true:false);
  const [showDriver, setShowDriver] = useState(localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 1?true:false);
  const [showAdmin, setShowAdmin] = useState(localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 2?true:false);
  const [isLogedIn, setIsLogedIn] = useState(localStorage["appState"]?true:false);
  const [userInfo, setUserInfo] = useState(localStorage["appState"]?JSON.parse(localStorage["appState"]):'');
  const [admin_ntf_count, setAdminNtfCount] = useState(0);
  const [ntf_count, setNtfCount] = useState(0);
  const [p_ntf_count, setP_NtfCount] = useState(0);
  const [checkadminnotification, setCheckAdminNotification] = useState(false);
  const [checknotification, setCheckNotification] = useState(false);
  const [checkp_notification, setCheckP_Notification] = useState(false);
  const [online_checked, setChecked] = useState(localStorage["appState"] && JSON.parse(localStorage["appState"]).user.online_checked?true:false);
  const [passengerchat, setPassengerChat] = useState(false);
  const [driverchat, setDriverChat] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // google map
  const [age, setAge] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [departure, setDeparture] = useState([]);
  const [destination, setDestination] = useState([]);

  const selecthandleChange = (event) => {
    setAge(event.target.value);
    setDeparture(passengers[event.target.value].departure);
    setDestination(passengers[event.target.value].destination);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (  
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{textAlign:"center"}}
    >
      
{ !isLogedIn && (
        <div>
          <Image src="assets/images/welcome.jpg" style={profileImage} className="rounded-circle" thumbnail/>
          <p style={profileName}>Welcome!</p>
        </div>
      )}
{ isLogedIn && (
        <div>
          <Image src={userInfo.user.photo == null || userInfo.user.photo == ''?'assets/images/users/default.png':'assets/images/users/a' + userInfo.user.photo} style={profileImage} className="rounded-circle" thumbnail/>
          <p style={profileName} className="text-capitalize">{userInfo.user.name}</p>
        </div>
      )}

{ !isLogedIn && (
        <Guest />
      )}

{ showPassenger && (
          <Passenger />
        )}

{ showAdmin && (
          <Admin />
        )}

{ showDriver && (
          <Driver />
        )}

{showDriver && (
        <Divider></Divider>
      )}

{showDriver && (
        <div className="text-right" style={{margin: "0px 40px"}}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={online_checked} onChange={toggleChecked} />}
                label="Online/Offline"
              />
            </FormGroup>
        </div>
      )}
    </div>
  )

  const toggleChecked = () => {
    setChecked((prev) => !prev);
    localStorage["online_checked"] =!online_checked;
    $.ajax({
        method: "POST",
        url: "api/setonline",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        data: {
          set_online: !online_checked
        },
        success: function(result){
            console.log('success')
        },
        error: function(error) {
          console.log(error)
        }
    });
  };

  const google_address = () => {

    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})  //for departure
    var autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('autocomplete1'), {})  //for destination
    
    // autocomplete.addListener("place_changed", handlePlaceSelect)
    // autocomplete1.addListener("place_changed", handlePlaceSelect)
  }

  const handleSubmit = (event) => {
  
    getGeoLocate($('#autocomplete').val())
    getGeoLocate1($('#autocomplete1').val())

    event.preventDefault()

    setTimeout(() => {
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          departure_lat: $('#dp_lat').val(),
          departure_lon: $('#dp_lon').val(),
          destination_lat: $('#ds_lat').val(),
          destination_lon: $('#ds_lon').val()
        })
      };
      if(!localStorage['appState']) {
        toastr.error('You should log in!')
      } else if ($('#dp_lat').val() == '' || $('#dp_lon').val() == '' || $('#ds_lat').val() == '' || $('#ds_lon').val() == '') {
        toastr.error('Google address is incorrect!')
      } else {
        setSpinner(true)
        fetch("/api/driver/search", requestOptions)
          .then(response => response.text())
          .then(result => {
              driver_datas = JSON.parse(result);
              localStorage['search_drivers'] = JSON.stringify(driver_datas)
              setTimeout(() => {
                setSearch_result(true);
                // setSpinner(false)
              }, 5000);
            }
          )
          .catch(error => console.log('error', error));
      }
    }, 2000);

      //  ----------------  Calculate distance between two latitude and longitude
      // var origin1 = new google.maps.LatLng($('#dp_lat').val(), $('#dp_lon').val());
      // var origin2 = $('#autocomplete').val();
      // var destinationA = $('#autocomplete1').val();
      // var destinationB = new google.maps.LatLng($('#ds_lat').val(), $('#ds_lon').val());

      // const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
      //   const matrixOptions = {
      //     origins: [origin1, origin2], // technician locations
      //     destinations: [destinationA, destinationB], // customer address
      //     travelMode: 'DRIVING',
      //     unitSystem: google.maps.UnitSystem.IMPERIAL
      //   };
      //   // Call Distance Matrix service
      //   service.getDistanceMatrix(matrixOptions, callback);
  
      //   // Callback function used to process Distance Matrix response
      //   function callback(response, status) {
      //     if (status == 'OK') {
      //       var origins = response.originAddresses;
      //       var destinations = response.destinationAddresses;
        
      //       for (var i = 0; i < origins.length; i++) {
      //         var results = response.rows[i].elements;
      //         for (var j = 0; j < results.length; j++) {
      //           var element = results[j];
      //           var distance = element.distance.text;
      //           console.log('distance=' + distance);
      //           localStorage['distance'] = JSON.stringify({distance: distance})
      //           var duration = element.duration.text;
      //           console.log('duration=' + duration);
      //           var from = origins[i];
      //           var to = destinations[j];
      //         }
      //       }
      //     }      
      //   }
  }

  if (showDriver) {
    useEffect(() => {
      //get ordered passengers
      $.ajax({
          method: "GET",
          url: "api/getorderpassengers",
          headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
          success: function(result){
              if(result != 0) {
                setDeparture(result[0].departure);
                setDestination(result[0].destination);
                setPassengers(result)
              }
          },
          error: function(error) {
            console.log(error)
          }
      });

      //real time notification
      const timer = setInterval(() => {
        $.ajax({
            method: "GET",
            url: "api/get_driver_new_notification",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
                console.log(result.notification_count)
                setNtfCount(result.notification_count)
                if(result.notification_count != 0) {
                  var audio = new Audio('assets/audio/notification_simple-02.wav')
                  audio.load()
                  audio.play()
                }
            },
            error: function(error) {
              console.log(error)
            }
        });
      }, 7000);
      // clearing interval
       return () => clearInterval(timer);
    }, []);
  }

  if (showPassenger) {
    useEffect(() => {
      const timer = setInterval(() => {
        $.ajax({
            method: "GET",
            url: "api/get_passenger_new_notification",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
                console.log(result.notification_count)
                setP_NtfCount(result.notification_count)
                if(result.notification_count != 0) {
                  var audio = new Audio('assets/audio/notification_simple-02.wav')
                  audio.load()
                  audio.play()
                }
            },
            error: function(error) {
              console.log(error)
            }
        });
      }, 8000);
      // clearing interval
      return () => clearInterval(timer);
    });
  }

  if (showAdmin) {
    useEffect(() => {
        $.ajax({
            method: "GET",
            url: "api/getNewnotification",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
                console.log(result.notification_count)
                setAdminNtfCount(result.notification_count)
                if(result.notification_count != 0) {
                  var audio = new Audio('assets/audio/notification_simple-02.wav')
                  audio.load()
                  audio.play()
                }
            },
            error: function(error) {
              console.log(error)
            }
        });
    });
  }

  const admin_notification = () => {
    setAdminNtfCount(0)
    setCheckAdminNotification(true)
    $.ajax({
        method: "POST",
        url: "api/remove_admin_new_notification",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        success: function(result){
          console.log("remove new notification success")
        },
        error: function(error) {
          console.log(error)
        }
    });
  }

  const notification = () => {
    setNtfCount(0)
    setCheckNotification(true)
    $.ajax({
        method: "POST",
        url: "api/remove_driver_new_notification",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        success: function(result){
          console.log("remove new notification success")
        },
        error: function(error) {
          console.log(error)
        }
    });
  }

  const p_notification = () => {
    setP_NtfCount(0)
    setCheckP_Notification(true)
    $.ajax({
        method: "POST",
        url: "api/remove_passenger_new_notification",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        success: function(result){
          console.log("remove new notification success")
        },
        error: function(error) {
          console.log(error)
        }
    });
  }

  const PassengerChatting = () => {
    setPassengerChat(true)
  }

  const DriverChatting = () => {
    setDriverChat(true)
  }

  if(checknotification) {                                             // when driver
    return <Redirect to="/driverNotification" />
  }

  if(checkp_notification) {                                           //  when passenger
    return <Redirect to="/passengerNotification" />
  }

  if(checkadminnotification) {                                           //  when admin
    return <Redirect to="/adminNotification" />
  }

  if(search_result) {
      return <Redirect to={{pathname: '/driversearch', driver_datas: driver_datas}}/>
  }

  if(passengerchat) {
    return <Redirect to='/passengerchat'/>
  }

  if(driverchat) {
    return <Redirect to='/driverchat'/>
  }

  if(spinner) {
    return <div><Spinner /></div>
  }
  
  return (
    <div>
      <Container>
        <GoogleMap departure={departure} destination={destination}/>
        <Row>
          <Col xs={6} md={6} className="text-left" style={{marginTop:"15px"}}>
          <React.Fragment key='left'>
            <Image src="assets/images/menu.png"  onClick={toggleDrawer('left', true)} style={menuStyle} className="rounded-circle"/>
            <Drawer anchor='left' open={state['left']} onClose={toggleDrawer('left', false)}>
              {list('left')}
            </Drawer>
          </React.Fragment>
          </Col>

          <Col xs={6} md={6} className="text-right" style={{marginTop:"15px", padding: "0px 25px"}}>
            { showPassenger && (
                <TextsmsIcon style={notifStyle} onClick={PassengerChatting}/>
            )}

            { showDriver && (
                <TextsmsIcon style={notifStyle} onClick={DriverChatting}/>
            )}

            { showAdmin && (  //when admin
                <Badge color="secondary" badgeContent={admin_ntf_count}>
                  <NotificationsActiveIcon style={notifStyle} onClick={admin_notification}/>
                </Badge>
            )}

            { showDriver && (  //when driver
                <Badge color="secondary" badgeContent={ntf_count}>
                  <NotificationsActiveIcon style={notifStyle} onClick={notification}/>
                </Badge>
            )}

            { showPassenger && (  //when passenger
                <Badge color="secondary" badgeContent={p_ntf_count}>
                  <NotificationsActiveIcon style={notifStyle} onClick={p_notification}/>
                </Badge>
            )}

            { !localStorage["appState"] && (
              <Link to="/chooseregister"><Image src="assets/images/user.png" style={userStyle} className="rounded-circle"/></Link>
            )}
          </Col>
          
        </Row>
        {showPassenger && (
        <Row>
          <Col lg={12} md={12} xs={12} style={{position:"absolute", bottom:"15px", right:"0"}}>
            <Card style={cardStyle}>
              <Card.Body style={{padding: "0px 0px 15px"}}>
                <Form onSubmit={handleSubmit}>
                  <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item style={{width:"10%"}}>
                        <i className="fa fa-location-arrow" style={locationStyle}></i>
                      </Grid>
                      <Grid item style={{width:"85%"}}>
                        <TextField style={{width:"100%"}} onChange={google_address} id="autocomplete" name="departure" label="Entere your departure" required/>
                      </Grid>
                    </Grid>
                  </Col>
                  <input type="hidden" id="dp_lat" value=""></input>
                  <input type="hidden" id="dp_lon" value=""></input>

                  <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item style={{width:"10%"}}>
                        <i className="fa fa-map-marker" style={{fontSize:20, color: "#f71717"}}></i>
                      </Grid>
                      <Grid item style={{width:"85%"}}>
                        <TextField style={{width:"100%"}} onChange={google_address} id="autocomplete1" name="destination" label="Enter your destination" required/>
                      </Grid>
                    </Grid>
                  </Col>
                  <input type="hidden" id="ds_lat" value=""></input>
                  <input type="hidden" id="ds_lon" value=""></input>

                  <Col xs="12" className="text-right" style={{marginTop: 15}}>
                    <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                      Driver Search
                    </Button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        )}
        {!localStorage['appState'] && (
        <Row>
          <Col lg={12} md={12} xs={12} style={{position:"absolute", bottom:"15px", right:"0"}}>
            <Card style={cardStyle}>
              <Card.Body style={{padding: "0px 0px 15px"}}>
                <Form onSubmit={handleSubmit}>
                  <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item style={{width:"10%"}}>
                        <i className="fa fa-location-arrow" style={locationStyle}></i>
                      </Grid>
                      <Grid item style={{width:"85%"}}>
                        <TextField style={{width:"100%"}} onChange={google_address} id="autocomplete" name="departure" label="Entere your departure" required/>
                      </Grid>
                    </Grid>
                  </Col>
                  <input type="hidden" id="dp_lat" value=""></input>
                  <input type="hidden" id="dp_lon" value=""></input>

                  <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item style={{width:"10%"}}>
                        <i className="fa fa-map-marker" style={{fontSize:20, color: "#f71717"}}></i>
                      </Grid>
                      <Grid item style={{width:"85%"}}>
                        <TextField style={{width:"100%"}} onChange={google_address} id="autocomplete1" name="destination" label="Enter your destination" required/>
                      </Grid>
                    </Grid>
                  </Col>
                  <input type="hidden" id="ds_lat" value=""></input>
                  <input type="hidden" id="ds_lon" value=""></input>

                  <Col xs="12" className="text-right" style={{marginTop: 15}}>
                    <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                      Driver Search
                    </Button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        )}
        {showDriver && (
          // <Row>
            <Col xs={12} style={{position: "unset"}}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label" style={{margin: "5px 20px"}}>My Passengers</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  onChange={selecthandleChange}
                  style={{marginTop: 25, marginBottom: 10}}
                >
                  {/* {passengers == '' && (
                  <MenuItem style={{background: '#fff', borderBottom: '1px solid #dddddd'}}>
                    <Row>
                      <Col xs={12} style={{margin: "5px 0px", paddingLeft: 0}}>
                        <p style={{margin: "0px 10px", fontSize: 16, fontWeight: 600}}>No Passengers</p>
                      </Col>
                    </Row>
                  </MenuItem>
                  )} */}
                  {passengers.map((passenger, index) => (
                  <MenuItem value={index} key={index} style={{background: '#fff', borderBottom: '1px solid #dddddd'}}>
                    <Row>
                      <Col xs={4} className="text-center">
                        <Image src={passenger.photo == null?"assets/images/users/default.png":"assets/images/users/a" + passenger.photo} className="rounded-circle" style={{width: 50}}></Image>
                      </Col>
                      <Col xs={8} style={{margin: "5px 0px", paddingLeft: 0}}>
                        <p style={{margin: "0px 10px", fontSize: 16, fontWeight: 600}}>{passenger.name}</p>
                        <p style={{margin: "0px 10px", fontSize: 12}}>{ 'Order Time: '  + passenger.order_time}</p>
                      </Col>
                    </Row>
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
          // </Row>
        )}
      </Container>
    </div>
  );
}
