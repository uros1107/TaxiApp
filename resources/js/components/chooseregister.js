import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const buttonStyle = {
  width: "100%", 
  // background:"#877ef2, #ff2462",
  background:"#339966",
  borderRadius: "50px", 
  borderColor: "#339966",
  boxShadow: "#339966 0px 6px 23px -3px",
  margin: "10px 0px"
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class ChooseRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todriver: false,
      topassenger: false,
    };

    this.driverhandleChange = this.driverhandleChange.bind(this);
    this.passengerhandleChange = this.passengerhandleChange.bind(this);
  }

  driverhandleChange(event) {
    this.setState({todriver: true});
    localStorage['role'] = 1
  }

  passengerhandleChange(event) {
    this.setState({topassenger: true});
    localStorage['role'] = 0
  }

  render() {
    if(this.state.topassenger) {
      return <Redirect to="/register" />
    } 
    if(this.state.todriver) {
      return <Redirect to="/register" />
    } 
    return (
      <Container>
        <Link to="/">
            <ArrowBackIosIcon style={backStyle}/>
        </Link>
        <Row style={{margin:"70px 0px 30px"}}>
          <Col lg={12} className="text-center">
            <Image src="assets/images/welcome.jpg" style={{ width: "100%", borderRadius: "5%" }}/>
          </Col>
          <Col xs={12} className="text-center letterStyle">
            <p className="letter">MY DOWNTOWNTAXI</p>
            <p className="smallLetter">NEED A TAXI CAB?</p>
            <p className="xlLetter">BOOK A RIDE</p>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="text-center">
            <p style={{fontWeight:"bold", fontSize: 22}}>Welcome To Mydcstaxi!</p>
            <h6>Please create your account</h6>
          </Col>
        </Row>
        <Row style={{marginTop:"5px"}}>
          <Col lg={12} className="text-center">
              <Button variant="primary" onClick={this.driverhandleChange} style={buttonStyle}>
                Driver Sign Up
              </Button>
          </Col>
          <Col lg={12} className="text-center">
              <Button variant="primary"  onClick={this.passengerhandleChange} style={buttonStyle}>
                Passenger Sign Up
              </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ChooseRegister;