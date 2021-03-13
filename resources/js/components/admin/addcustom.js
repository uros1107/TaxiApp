import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import toastr from 'toastr';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from '../Spinner/normal';

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

export class AddCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      phone_number: '',
      image: '',
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      formError: false,
      imgSrc: 'assets/images/users/default.png',
      is_added: false,
      loading: false
    };

    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.passwordhandleChange = this.passwordhandleChange.bind(this);
    this.namehandleChange = this.namehandleChange.bind(this);
    this.phonehandleChange = this.phonehandleChange.bind(this);
    this.cardNamehandleChange = this.cardNamehandleChange.bind(this);
    this.cardNumberhandleChange = this.cardNumberhandleChange.bind(this);
    this.expiryMonthhandleChange = this.expiryMonthhandleChange.bind(this);
    this.expiryYearhandleChange = this.expiryYearhandleChange.bind(this);
    this.cvchandleChange = this.cvchandleChange.bind(this);
    this.stripeHandleResponse = this.stripeHandleResponse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.imageshow = this.imageshow.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.createImage = this.createImage.bind(this);
  }

  namehandleChange(event) {
    this.setState({username: event.target.value});
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value});
  }

  phonehandleChange(event) {
    this.setState({phone_number: event.target.value});
  }

  passwordhandleChange(event) {
    this.setState({password: event.target.value});
  }

  expiryMonthhandleChange(event) {
    this.setState({expiryMonth: event.target.value});
  }

  expiryYearhandleChange(event) {
    this.setState({expiryYear: event.target.value});
  }

  cvchandleChange(event) {
    this.setState({cvc: event.target.value});
  }

  cardNamehandleChange(event) {
    this.setState({cardName: event.target.value})
  }

  cardNumberhandleChange(event) {
    this.setState({cardNumber: event.target.value})
  }

  stripeHandleResponse(status, response) {
    if (response.error) {
        this.setState({loading: true})
        toastr.error(response.error.message)
    } else {
        /* token contains id, last4, and card type */
        this.setState({loading: true})
        var token = response['id'];
        this.setState({spinner: true})

        var requestOptions = {
          method: 'POST',  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              // 'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
          },
          body: JSON.stringify({
            token: token,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            phone_number: this.state.phone_number,
            file: this.state.image
          })
        };
        
        fetch("/api/addcustom", requestOptions)
          .then(response => response.text())
          .then(result => {
            this.setState({loading: false})
            var status = JSON.parse(result)
            if (status.success == false) {
              toastr.error('Your email has already taken!')
            } else if(status.success == true) {
              toastr.success('Successfully added!')
              this.setState({is_added: true})
            } else if(status.error == true) {
              toastr.error('Sever Error!')
            }
          })
          .catch(error => {
            this.setState({loading: false})
            toastr.error('Failed!')
          });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    Stripe.setPublishableKey("pk_test_UjJ892tTsUChobO26XmPQvjy");
    
    Stripe.createToken({
        number: this.state.cardNumber, 
        exp_month: this.state.expiryMonth,
        exp_year: this.state.expiryYear,
        cvc: this.state.cvc,
    }, this.stripeHandleResponse)
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
    if(!localStorage["appState"]) {
      return <Redirect to="/" />
    }
    if(this.state.is_added) {
      return <Redirect to="/custommanage" />
    } else{
      return (
        <Container>
          <Link to="/custommanage">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row style={{margin:"70px 0px 30px"}}>
            <Col lg={12} className="text-center">
              <Image src={this.state.imgSrc} className="rounded-circle" style={{ width:220, height:220 }}/>
            </Col>
          </Row>
          <Row style={{marginTop:"15px"}}>
            <Col lg={12}>
              <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Form.Group as={Row} controlId="image">
                  <Col xs="8" sm="10">
                    <Form.Control type="file" ref="file" onChange={this.imageshow} name="image" style={{display: "none"}} />
                  </Col>
                  <Button onClick={this.uploadImage}>Upload</Button>
                </Form.Group>

                <p style={{fontSize: 20, fontWeight: "bold"}}>Personal Information</p>
  
                <Form.Group as={Row} controlId="name">
                  <Form.Label column xs="4" sm="2">
                    Name
                  </Form.Label>
                  <Col xs="8" sm="10">
                    <Form.Control type="text" value={this.state.username} onChange={this.namehandleChange} placeholder="your name" required/>
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="email">
                  <Form.Label column xs="4" sm="2">
                    Email
                  </Form.Label>
                  <Col xs="8" sm="10">
                    <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} placeholder="your email" required/>
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="password">
                  <Form.Label column xs="4" sm="2">
                    Password
                  </Form.Label>
                  <Col xs="8" sm="10">
                    <Form.Control type="text" value={this.state.password} onChange={this.passwordhandleChange} placeholder="your password" required/>
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="phone">
                  <Form.Label column xs="4" sm="2">
                    Phone
                  </Form.Label>
                  <Col xs="8" sm="10">
                    <Form.Control type="text" value={this.state.phone} onChange={this.phonehandleChange} placeholder="your phone number" required/>
                  </Col>
                </Form.Group>

                <p style={{fontSize: 20, fontWeight: "bold", marginTop: "2rem"}}>Card Information</p>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Card Name</Form.Label>
                    <Form.Control autoComplete='off' type="text" value={this.state.cardName} onChange={this.cardNamehandleChange} placeholder="Card name" className="card-num" required/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control autoComplete='off' type="text" value={this.state.cardNumber} onChange={this.cardNumberhandleChange} placeholder="1234 1234 1234 1234" className="card-num" maxLength="16" required/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>CVC</Form.Label>
                    <Form.Control autoComplete='off' type="text" value={this.state.cvc} onChange={this.cvchandleChange} placeholder="Cvc" maxLength="3" required/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Expiration Month</Form.Label>
                    <Form.Control type="text" placeholder="MM" value={this.state.expiryMonth}  onChange={this.expiryMonthhandleChange} maxLength="2" required/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Expiration Year</Form.Label>
                    <Form.Control type="text" placeholder="YYYY" value={this.state.expiryYear} onChange={this.expiryYearhandleChange} maxLength="4" required/>
                </Form.Group>
  
                <Col xs="12" className="text-right" style={{marginBottom: 30}}>
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Add Customer
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

export default AddCustom;