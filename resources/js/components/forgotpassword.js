import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import toastr from 'toastr';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from './Spinner/normal';

const buttonStyle = {
  width: "100%", 
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      imgSrc: 'assets/images/forgotpassword.png',
      phone_verify: false,
      loading: false
    };

    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true})
    var requestOptions = {
      method: 'POST',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
      })
    };
    
    fetch("/api/forgotpassword", requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({loading: false})
        var status = JSON.parse(result)
        if (status.success == true) {
          toastr.success('We sent reset password to your email address!')
          location.reload()
        } else if(status.success == false) {
          toastr.error('Sever Error!')
        }
      })
      .catch(error => toastr.error('Failed!'));
  }

  render() {
    if(this.state.loading) {
      return <Spinner />
    }
    if(this.state.phone_verify) {
      return <Redirect to="/phoneverify" />
    } else{
      return (
        <Container>
          <Link to="/login">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row style={{margin:"50px 0px 30px"}}>
            <Col lg={12} className="text-center">
              <Image src={this.state.imgSrc} className="rounded-circle" style={{ width: "80%" }}/>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center">
              <h4 style={{fontWeight:"bold", marginBottom: 20}}>Forgot your password?</h4>
              <h6>Please enter your email address</h6>
              <h6 style={{color: "#9c9c9c"}}>We will send you reset password to your email address</h6>
            </Col>
          </Row>
          <Row style={{marginTop:"20px"}}>
            <Col lg={12}>
              <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Form.Group as={Row} controlId="name">
                  <Form.Label column xs="3" sm="2" style={{paddingRight: 0}}>
                    Email
                  </Form.Label>
                  <Col xs="9" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} placeholder="Your email address" required/>
                  </Col>
                </Form.Group>

                <Col xs="12" className="text-right" style={{margin: "40px 0px", padding: 0}}>
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Send
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Register;