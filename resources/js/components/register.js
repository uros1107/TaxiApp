import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import toastr from 'toastr';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PhoneInput from 'react-phone-input-2'
import Spinner from './Spinner/normal';
import 'react-phone-input-2/lib/style.css'

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

const dropStyle = {
  width: "180px", 
  display: "inline", 
  bottom: "25px", 
  fontSize: 12
}

const termStyle = {
  color: "#000", 
  textDecorationLine: "underline"
}

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      image: '',
      formError: false,
      imgSrc: 'assets/images/signup.jpg',
      is_register: false,
      phone_verify: false,
      loading: false
    };

    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.passwordhandleChange = this.passwordhandleChange.bind(this);
    this.firstnamehandleChange = this.firstnamehandleChange.bind(this);
    this.lastnamehandleChange = this.lastnamehandleChange.bind(this);
    this.phonehandleChange = this.phonehandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.imageshow = this.imageshow.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.createImage = this.createImage.bind(this);
  }

  firstnamehandleChange(event) {
    this.setState({firstname: event.target.value});
  }

  lastnamehandleChange(event) {
    this.setState({lastname: event.target.value});
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value});
  }

  phonehandleChange(event) {
    this.setState({phone_numbr: event.target.value});
  }

  passwordhandleChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.state.image == '') {
      toastr.error('You should upload your profile image')
    } else {
      this.setState({loading: true})
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          password: this.state.password,
          address: this.state.address,
          phone_number: this.state.phone,
          file: this.state.image
        })
      };
      
      fetch("/api/register", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.setState({loading: false})
          var status = JSON.parse(result)
          if (status.success == false) {
            toastr.error('Your email has already taken!')
          } else if(status.success == -1) {
            toastr.error('Your phone number already exists')
          } else if(status.success == -2) {
            toastr.error(status.status)
          } else if(status.success == true) {
            localStorage['phone_number'] = this.state.phone
            localStorage['firstname'] = this.state.firstname
            localStorage['lastname'] = this.state.lastname
            localStorage['email'] = this.state.email
            localStorage['password'] = this.state.password
            localStorage['profile_img'] = this.state.image
            this.setState({phone_verify: true})
          } else if(status.error == true) {
            toastr.error('Sever Error!')
          }
        })
        .catch(error => toastr.error(error));
    }
  }

  imageshow(e) {
    // Assuming only image
    var file = this.refs.file.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
  
     reader.onloadend = function (e) {
        this.setState({
          imgSrc: [reader.result]
        })
      }.bind(this);

    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
          return;
    this.createImage(files[0]);
  }

  createImage(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      this.setState({
        image: e.target.result
      })
    };
    reader.readAsDataURL(file);
  }

  uploadImage()  {
    $('#image').click();
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
          <Link to="/chooseregister">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row style={{margin:"70px 0px 30px"}}>
            <Col lg={12} className="text-center">
              <Image src={this.state.imgSrc} style={{ width: "260px", borderRadius: "50%", height: "215px" }}/>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center">
              <h4 style={{fontWeight:"bold"}}>Welcome to Sign Up</h4>
              <h6>Please create account</h6>
            </Col>
          </Row>
          <Row style={{marginTop:"20px"}}>
            <Col lg={12}>
              <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Form.Group as={Row} controlId="image">
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="file" ref="file" onChange={this.imageshow} name="image" style={{display: "none"}} />
                  </Col>
                  <Button onClick={this.uploadImage}>Upload</Button>
                </Form.Group>
  
                <Form.Group as={Row} controlId="name">
                  <Form.Label column xs="4" sm="2" style={{paddingRight: 0}}>
                    First Name
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="text" value={this.state.firstname} onChange={this.firstnamehandleChange} style={{width: "100%"}} placeholder="First name" required/>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="name">
                  <Form.Label column xs="4" sm="2" style={{paddingRight: 0}}>
                    Last Name
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="text" value={this.state.lastname} onChange={this.lastnamehandleChange} style={{width: "100%"}} placeholder="Last name" required/>
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="email">
                  <Form.Label column xs="4" sm="2">
                    Email
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} style={{width: "100%"}} placeholder="your email" required/>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="phone">
                  <Form.Label column xs="4" sm="2">
                    Phone
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <PhoneInput
                      country={'us'}
                      value={this.state.phone}
                      onChange={phone => this.setState({ phone })}
                      inputStyle={{width: "100%"}}
                      dropdownStyle={dropStyle}
                    />
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="password">
                  <Form.Label column xs="4" sm="2">
                    Password
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="text" value={this.state.password} onChange={this.passwordhandleChange} style={{width: "100%"}} placeholder="your password" required/>
                  </Col>
                </Form.Group>

                <Col xs="12" className="text-right" style={{marginTop: 30, padding: 0}}>
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Sign Up
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center" style={{marginBottom: 30, marginTop: 12}}>
              <h6 style={{marginTop:"0.5rem", display: "contents"}}>Already have an account?</h6>&nbsp;
                <Link to="/login">
                  Sign In
                </Link>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center" style={{marginBottom: 10}}>
                <Link to="/terms" style={termStyle}>
                  Terms
                </Link>&nbsp;
                & &nbsp;
                <Link to="/policy" style={termStyle}>
                  Privacy Policy
                </Link>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Register;