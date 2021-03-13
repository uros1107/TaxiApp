import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import { Link, Router, Route, BrowserRouter,Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const buttonStyle = {
    width: "100%", 
    margin: "20px 0px",
  };

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }

const driverName = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "0px"
  };

const driverEmail = {
    fontSize: "12px",
  };

const driverImage = {
    width: "61px",
    height: "61px",
  };

const carImage = {
    width: "290px",
    height: "200px",
  };

const star = {
    width: "15px"
  };

const driverItem = {
    margin: "15px 0px",
    boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)",
    borderRadius: "15px"
  };

var driver_datas = '';
var ratings = '';
var rides = '';
var trip_fare = '';

export class DriverSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          previousPath: '',
          booking: false,
          isLoaded: false
        };
    }

    componentDidMount() {
        driver_datas = JSON.parse(localStorage['search_drivers']).drivers;
        ratings = JSON.parse(localStorage['search_drivers']).ratings;
        rides = JSON.parse(localStorage['search_drivers']).rides;
        trip_fare = JSON.parse(localStorage['search_drivers']).trip_fare;
        this.setState({isLoaded: true})
    }
    
    render() {
        if(!localStorage["appState"]) {
            return <Redirect to="/" />
        }
        if(this.state.booking) {
            return <Redirect to={{pathname: '/booking'}}/>
        }

        if (!this.state.isLoaded) {
            return <div>Is Loading...</div>
        } else{
            return (
                <Container>
                    <Link to="/">
                        <ArrowBackIosIcon style={backStyle}/>
                    </Link>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={{marginTop:"50px", fontSize: 20}}>Choose Your Driver</h4>
                        </Col>
                    </Row>
                    {driver_datas == '' && (
                        <Row>
                            <Col xs={12} className="text-center">
                                <h5 style={{marginTop:"50px", fontSize: 15}}>No drivers nearby you</h5>
                            </Col>
                        </Row>
                    )}
                    {driver_datas.map((driver, index) => (
                    <Row key={index} style={driverItem}>
                        <Col xs={3} md={6} className="text-left" style={{padding:"10px"}}>
                            <Image src={"assets/images/users/a" + driver.photo} style={driverImage} className="rounded-circle"/>
                        </Col>
                        <Col xs={6} style={{padding:"15px 0px"}}>
                            <Row>
                                <Col xs={12}><p style={driverName}>{driver.name}</p></Col>
                                {/* <Col xs={12}><p style={driverEmail}>{driver.email}</p></Col> */}
                                <Col xs={12} style={{fontSize: 12}}><i className='fa fa-star' style={{color:'#fdce22'}}></i>&nbsp; <b>{ratings[driver.id]}</b> {'(' + rides[driver.id] + ')'} &nbsp;&nbsp;<i className='fa fa-car'></i></Col>
                            </Row>
                        </Col>
                        <Col xs={3} className="text-center" style={{padding: "15px 10px"}}>
                            <p style={{fontWeight: 500}}>{'$ ' + trip_fare}</p>
                        </Col>
                        <Col xs={12}>
                            <p><i className='fa fa-location-arrow' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {driver.current_location}</p>
                        </Col>
                        <Col xs={12} className="text-center">
                            <Image src={"assets/images/cars/a" + driver.car_image} style={carImage} thumbnail/>
                        </Col>
                        <Col xs={12} className="text-center">
                            <Link className="btn btn-primary standardButton" style={buttonStyle} to={{pathname: '/booking', driver_id: driver.id}}>
                                Booking
                            </Link>
                        </Col>
                    </Row>
                    ))}
                </Container>
            )
        }
    }
}

export default DriverSearch;