import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import toastr from 'toastr';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from './Spinner/normal';

const buttonStyle = {
  width: "100%", 
  marginTop: 5
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
      imgSrc: 'assets/images/credit_card.jpg',
      isLoggedIn: false,
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      zip: '',
      spinner: false
    };

    this.cardNamehandleChange = this.cardNamehandleChange.bind(this);
    this.cardNumberhandleChange = this.cardNumberhandleChange.bind(this);
    this.expiryMonthhandleChange = this.expiryMonthhandleChange.bind(this);
    this.expiryYearhandleChange = this.expiryYearhandleChange.bind(this);
    this.cvchandleChange = this.cvchandleChange.bind(this);
    this.ziphandleChange = this.ziphandleChange.bind(this);
    this.stripeHandleResponse = this.stripeHandleResponse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  ziphandleChange(event) {
    this.setState({zip: event.target.value});
  }

  cardNamehandleChange(event) {
        this.setState({cardName: event.target.value})
  }

  cardNumberhandleChange(event) {
    this.setState({cardNumber: event.target.value})
}

  stripeHandleResponse(status, response) {
      if (response.error) {
          toastr.error(response.error.message)
      } else {
          /* token contains id, last4, and card type */
          var token = response['id'];
          this.setState({spinner: true})

          $.ajax({
              type: "POST",
              url: "api/creditcard",
              // headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
              method:"POST",
              data: {
                token: token,
                name: localStorage['firstname'],
                lastname: localStorage['lastname'],
                email: localStorage['email'],
                password: localStorage['password'],
                phone_number: localStorage['phone_number'],
                file: localStorage['profile_img'],
                role: localStorage['role'],
              },
              success: function(result){
                  this.setState({spinner: false})
                  if(result.success == true) {
                    toastr.success("Successfully created your account!")
                    this.setState({isLoggedIn: true})
                    let userData = {
                      id: result.user.id,
                      name: result.user.name,
                      email: result.user.email,
                      role: result.user.role,
                      photo: result.user.photo,
                      access_token: result.user.remember_token,
                    };
                    let appState = {
                      isLoggedIn: true,
                      user: userData
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                    location.reload()
                  } else {
                    toastr.error("Failed")
                  }
              }.bind(this), // when .ajax function use
              error: function (error) {
                  console.log(error.message)
                  this.setState({spinner: false})
                  toastr.error('Your card was declined')
              }.bind(this)
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
        address_zip:this.state.zip
    }, this.stripeHandleResponse)
  }

  render() {
      if(this.state.spinner) {
        return <div><Spinner /></div>
      }

      if(!localStorage['phone_verify']) {
        return <Redirect to="/" />
      } 
      if(this.state.isLoggedIn) {
        return <Redirect to="/" />
      } else {
        return (
          <Container>
            <Link to="/register">
                <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <Row>
              <Col lg={12} className="text-center">
                <h4 style={{margin: "60px 0px 20px", fontWeight: 600}}>Card Information</h4>
              </Col>
              <Col lg={12} style={{margin: "0px 10px 20px"}}>
                <Image src={this.state.imgSrc} style={{ width: "100%", height:220 }}/>
              </Col>
            </Row>
            <Form onSubmit={this.handleSubmit} style={{padding: "0px 15px", marginBottom: 40}}>
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

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>ZIP code</Form.Label>
                    <Form.Control type="text" placeholder="11111" value={this.state.zip} onChange={this.ziphandleChange} required/>
                </Form.Group>

                <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Save Card
                </Button>
            </Form>
          </Container>
        );
      }
  }
}

export default PhoneVerify;