import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import toastr from 'toastr';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ReactCodeInput from 'react-code-input'
import Spinner from './Spinner/normal';

const buttonStyle = {
  width: "90%", 
  fontSize: 18
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

const dropStyle = {
  width: "180px", 
  display: "inline", 
  bottom: "25px", 
  fontSize: 12
}

export class PhoneVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: '',
      imgSrc: 'assets/images/login.jpg',
      toCardInput: false,
      toCarInformation: false,
      spinner: false
    };
    
    this.firstnamehandleChange = this.firstnamehandleChange.bind(this);
    this.verifyhandleChange = this.verifyhandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  firstnamehandleChange(event) {
    this.setState({firstname: event.target.value});
  }

  verifyhandleChange(event) {
    this.setState({verify_code: event});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({spinner: true})
    var requestOptions = {
      method: 'POST',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: localStorage['phone_number'],
        verify_code: this.state.verify_code,
      })
    };
    
    fetch("/api/phoneverify", requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({spinner: false})
        var status = JSON.parse(result)
        if(status.success == true) {
          localStorage['phone_verify'] = true
          if(localStorage['role'] == 1) {
            this.setState({toCarInformation: true})
          } else {
            this.setState({toCardInput: true})
          }
        } else {
          toastr.error("Invalid verification code entered!")
        }
      })
      .catch(error => toastr.error(error.message));
  }

  render() {
      if(this.state.spinner) {
        return <Spinner />
      }
      if(this.state.toCarInformation) {
        return <Redirect to="/carinformation" />
      }
      if(this.state.toCardInput) {
        return <Redirect to="/cardInput" />
      } else {
        return (
          <Container>
            <Link to="/register">
                <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <Row style={{margin:"70px 0px 30px"}}>
              <Col lg={12} className="text-center">
                <Image src={this.state.imgSrc} className="rounded-circle" style={{ width: "80%" }}/>
              </Col>
            </Row>
            <Row style={{margin:"40px 0px 0px"}}>
              <Col xs={12} className="text-center">
                <h5 style={{fontSize: 20, fontWeight: 800}}>Verify Code</h5>
                <p style={{marginBottom: 0, color: "#a7a7a7"}}>Please check your SMS.</p> 
                <p style={{color: "#a7a7a7"}}>We just sent a verification code to your phone</p>
              </Col>
            </Row>
            <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <Row>
                <Col lg={12} className="text-center" style={{marginBottom: 30}}>
                  <ReactCodeInput type='number' onChange={this.verifyhandleChange} fields={4}/>
                </Col>
                <Col lg={12} className="text-center" style={{marginBottom: 30}}>
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Phone Verify
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        );
      }
  }
}

export default PhoneVerify;