import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import { Link, Router, Route, BrowserRouter,Redirect } from 'react-router-dom';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from './checkoutform';

const stripePromise = loadStripe("pk_test_UjJ892tTsUChobO26XmPQvjy");

const buttonStyle = {
    width: "100%", 
    margin: "20px 0px",
  };

const driverName = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "0px"
  };

const driverImage = {
    width: "60px",
    height: "60px"
  };

const driverItem = {
    margin: "15px 0px",
    boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)",
    borderRadius: "15px"
  };

const modal = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',    
}

const fade = {
    backgroundColor: "white",
    padding: "15px",
}

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
}

var mybookings = '';

export class MyBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            bookings: '',
            open: false,
            booking_id: '',
            ratings: '',
            loading: false
        };

        this.requestCancel = this.requestCancel.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        var requestOptions = {
            method: 'POST',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
            }
        };
    
        fetch("/api/getmybooking", requestOptions)
        .then(response => response.text())
        .then(result => {
            mybookings = JSON.parse(result);
            this.setState({
                bookings: mybookings.bookings,
                ratings: mybookings.ratings,
                error: false,
                isLoaded: true
            })
          }
        )
        .catch(error => {
            this.setState({
                isLoaded: true,
                error: true
            });
        });
    }

    requestCancel(booking_id) {
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/bookingcancel",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {booking_id: booking_id},
            success: function(result){
              this.setState({loading: false})
              if(result.success == true) {
                toastr.success('Your booking canceled and you paid cancel fee $' + result.cancel_fee + ' to driver!')
              } else {
                console.log(result.error)
                toastr.error(result.error)
              }
              location.reload()
            }.bind(this),
            error: function(error) {
              this.setState({loading: false})
              toastr.error('Failed!')
            //   location.reload()
            }.bind(this)
        });
    }

    handleOpen(booking_id) {
        this.setState({booking_id: booking_id});
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }
    
    render() {
        if(!localStorage["appState"]) {
            return <Redirect to="/" />
          }
        if(this.state.loading) {
            return <Spinner />
        }
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Container>
                    <Link to="/">
                        <ArrowBackIosIcon style={backStyle}/>
                    </Link>
                    { localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 1 && (              // driver
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={{marginTop:"50px", fontSize: 20}}>My Pickup Requests</h4>
                        </Col>
                    </Row>
                    )}
                    { localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0 && (                 //passenger
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={{marginTop:"50px", fontSize: 20}}>My Bookings</h4>
                        </Col>
                    </Row>
                    )}
                    {this.state.bookings == '' && (
                    <Row>
                        <Col xs={12} className="text-center">
                            <h5 style={{marginTop:"50px", fontSize: 15}}>No Bookings</h5>
                        </Col>
                    </Row>
                    )}
                    {this.state.bookings.map((booking, index) => (
                    <Row key={index} style={driverItem}>
                        <Col xs={3} md={6} className="text-left" style={{padding:"10px"}}>
                            <Image src={booking.photo == null || booking.photo == ''?"assets/images/users/default.png":"assets/images/users/a" + booking.photo} style={driverImage} className="rounded-circle"/>
                        </Col>
                        { localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0 && (              //passenger
                        <Col xs={9} style={{padding:"15px"}}>
                            <Row>
                                <Col xs={12}><p style={driverName}>{booking.name}</p></Col>
                                <Col xs={12} style={{fontSize: 12}}><i className='fa fa-star' style={{color:'#fdce22'}}></i> {this.state.ratings[booking.driver_id]}</Col>
                            </Row>
                        </Col>
                        )}
                        { localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 1 && (                // driver
                        <Col xs={9} style={{padding:"15px"}}>
                            <Row>
                                <Col xs={12}><p style={driverName}>{booking.name}</p></Col>
                                {/* <Col xs={12} style={{fontSize: 12}}><i className='fa fa-phone' style={{color:'#000'}}></i> {booking.phone}</Col> */}
                            </Row>
                        </Col>
                        )}
                        <Col xs={12}>
                            <p style={{marginBottom: 10}}><i className='fa fa-location-arrow' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.departure}</p>
                        </Col>
                        <Col xs={12}>
                            <p style={{marginBottom: 10}}><i className='fa fa-map-marker' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.destination}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-clock-o' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.order_time}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-car' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.number_people}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-dollar' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.price}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-support' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {booking.trip_distance + ' mile'}</p>
                        </Col>
                        {booking.status == 0 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Pending</p>
                            </Col>
                        )}
                        {booking.status == 1 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Accepted</p>
                            </Col>
                        )}
                        {booking.status == 2 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Canceled</p>
                            </Col>
                        )}
                        {booking.status == 3 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Completed</p>
                            </Col>
                        )}

                        {localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0 && (
                            <Col lg={12} className="text-center">
                                <Image src={"assets/images/cars/a" + booking.car_image} thumbnail style={{ width:290, height:190 }}/>
                            </Col>
                        )}

                        {localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0 && (
                            <Col xs={6}>
                                <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.handleOpen(booking.id)}>
                                    Give Review
                                </Button>
                            </Col>
                        )}
                        {localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 0 && (
                            <Col xs={6}>
                                <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.requestCancel(booking.id)}>
                                    Cancel
                                </Button>
                            </Col>
                        )}
                        <Col xs={12} className="text-right" style={{color: '#a7a7a7'}}>
                            {moment(booking.updated_at).fromNow()}
                        </Col>
                    </Row>
                    ))}

                    <div>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            style={modal}
                            open={this.state.open}
                            onClose={this.handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={this.state.open} style={{width: "90%"}}>
                            <div style={fade}>
                                <h4 id="transition-modal-title" style={{margin: "10px 0px 10px"}} className="text-center">Give Reveiw to Driver</h4>
                                <Divider style={{margin:"15px 0px"}}/>
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm booking_id={this.state.booking_id}/>
                                </Elements>
                            </div>
                            </Fade>
                        </Modal>
                    </div>
                </Container>
            )
        }
    }
}

export default MyBooking;