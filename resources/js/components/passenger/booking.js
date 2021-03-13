import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';

const driverImage = {
  // width: "50%"
  width: 150,
  height: 150
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

const buttonStyle = {
  width: "100%", 
  marginTop: "50px",
};

const bookingForm = {
  display: "inline",
};

var driver_id = '';
var driver_info = '';

export class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      autocomplete2: '',
      autocomplete3: '',
      spinner: false
    };

    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.passwordhandleChange = this.passwordhandleChange.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.autocomplete2 = {};
    this.autocomplete3 = {};
  }

  componentDidMount() {
    //get google map autocompletd
    this.autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('autocomplete2'), {})  //for departure
    this.autocomplete3 = new google.maps.places.Autocomplete(document.getElementById('autocomplete3'), {})  //for destination

    //get driver information
    const { location } = this.props;
    const previousPath = location.driver_id;
    driver_id = previousPath;

    var requestOptions = {
      method: 'POST',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
      },
      body: JSON.stringify({
        driver_id: driver_id
      })
    };
    
    fetch("/api/driver/info", requestOptions)
      .then(response => response.text())
      .then(result => {
        driver_info = JSON.parse(result);
        this.setState({flag: false});
      })
      .catch(error => console.log('error', error));
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value});
  }

  passwordhandleChange(event) {
    this.setState({password: event.target.value});
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components
    this.setState({
      name: addressObject.name
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({spinner: true})

    if (!localStorage["appState"]) {
      toastr.error('You should login!')
    } else {
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          passenger_name: $('#passenger_name').val(),
          phone_number: $('#phone_number').val(),
          departure: $('#autocomplete2').val(),
          destination: $('#autocomplete3').val(),
          booking_time: $('#booking_time').val(),
          number_people: $('#number_people').val(),
          message: $('#message').val(),
          driver_id: driver_id
        })
      };
      
      fetch("/api/passenger/requestorder", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          this.setState({spinner: false})
          var status = JSON.parse(result)
          if(status.error) {
            toastr.error('Passenger information is incorrect')
          }
          if (status.success) {
            toastr.success('Successfully sent ride request!')
          } else if(status.success == 'false') {
            toastr.error('Order Failed!')
          }
        })
        .catch(error => {
          console.log(error)
          toastr.error('Failed!')
        });
    }
  }

  render() {
    if(this.state.spinner) {
      return <Spinner />
    }
    if (this.state.flag) {
      return 'Loading...'
    }
    return (
      <Container>
        <Link to="/driversearch">
            <ArrowBackIosIcon style={backStyle}/>
        </Link>
        <Row style={{margin:"50px 0px 0px"}}>
          <Col lg={12} className="text-center" style={{marginBottom:15}}>
            <h4>Booking Detail</h4>
          </Col>
          <Col lg={12} className="text-center">
            <Image src={"assets/images/users/a" + driver_info.photo} style={driverImage} className="rounded-circle"/>
          </Col>
          <Col lg={12} className="text-center" style={{fontSize: 24, fontWeight: 700}}>
            {driver_info.name}
          </Col>
        </Row>
        
        <Row style={bookingForm}>
          <Form onSubmit={this.handleSubmit}>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    {/* <AccountCircle /> */}
                    <i className="fa fa-user" style={{fontSize:20}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="passenger_name" label="Passenger name" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-phone" style={{fontSize:20}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="phone_number" label="Phone number" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-location-arrow" style={{fontSize:20}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="autocomplete2" name="departure" label="Departure" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-compass" style={{fontSize:24}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="autocomplete3" name="destination" label="Destination" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-clock-o" style={{fontSize:24}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="booking_time" label="Booking time" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-car" style={{fontSize:18}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="number_people" label="Number of people" required/>
                  </Grid>
                </Grid>
              </Col>
              <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item style={{width:"10%"}}>
                    <i className="fa fa-commenting" style={{fontSize:22}}></i>
                  </Grid>
                  <Grid item style={{width:"90%"}}>
                    <TextField style={{width:"100%"}} id="message" label="Message type here" />
                  </Grid>
                </Grid>
              </Col>
              <Col xs="12" className="text-right">
                <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                  Order
                </Button>
              </Col>
            </Form>
        </Row>
      </Container>
    );
  }
}

export default Booking;