import React, { Component } from 'react';
import { Button,Container, Row, Col, Form } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const buttonStyle = {
    width: "100%", 
    // background:"#877ef2"
    // background:"#ff2462", 
    // borderRadius: "50px", 
    // borderColor: "#ff2462",
    // boxShadow: "#ec4272 0px 6px 23px -3px",
    margin: "20px 0px",
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      amount: '',
    };

    this.cardNumberhandleChange = this.cardNumberhandleChange.bind(this);
    this.expiryMonthhandleChange = this.expiryMonthhandleChange.bind(this);
    this.expiryYearhandleChange = this.expiryYearhandleChange.bind(this);
    this.cvchandleChange = this.cvchandleChange.bind(this);
    this.amounthandleChange = this.amounthandleChange.bind(this);
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

  cardNumberhandleChange(event) {
    this.setState({cardNumber: event.target.value})
  }

  amounthandleChange(event) {
    this.setState({amount: event.target.value});
  }

  // stripeHandleResponse(status, response) {
  //       if (response.error) {
  //           toastr.error(response.error.message)
  //       } else {
  //           /* token contains id, last4, and card type */
  //           var token = response['id'];
  //           console.log(response['id']);

  //           $.ajax({
  //               type: "POST",
  //               url: "api/requestwithdrawal",
  //               method:"POST",
  //               data: {
  //                 token: token,
  //                 amount: this.state.amount
  //               },
  //               success: function(result){
  //                   //var status = JSON.parse(result)
  //                   if (result.success == true) {
  //                       toastr.success('Successfully withdrawal sent request')
  //                       location.reload()
  //                   } else if(result.success == false) {
  //                       toastr.success('Withdrawal request failed')
  //                   } else {
  //                       toastr.error('Your balance is not enough')
  //                   }
  //               },
  //               error: function (error) {
  //                   console.log(error.message)
  //                   toastr.error('Failed')
  //               }
  //           });
  //       }
  //   }

  handleSubmit(event) {
    event.preventDefault();

    // Stripe.setPublishableKey("pk_live_xzcZ3K2Sf0SrRbUZ8v2OQblk");

    // Stripe.createToken({
    //     number: this.state.cardNumber,
    //     exp_month: this.state.expiryMonth,
    //     exp_year: this.state.expiryYear,
    //     cvc: this.state.cvc,
    // }, this.stripeHandleResponse)

    $.ajax({
        type: "POST",
        url: "api/requestwithdrawal",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        method:"POST",
        data: {
          // token: token,
          amount: this.state.amount,
          number: this.state.cardNumber,
          exp_month: this.state.expiryMonth,
          exp_year: this.state.expiryYear,
          cvc: this.state.cvc,
        },
        success: function(result){
            //var status = JSON.parse(result)
            if (result.success == true) {
                toastr.success('Successfully withdrawal sent request')
                location.reload()
            } else if(result.success == false) {
                toastr.success('Withdrawal request failed')
            } else {
                toastr.error('Your balance is not enough')
            }
        },
        error: function (error) {
            console.log(error.message)
            toastr.error('Failed')
        }
    });
  }

  render() {
    if(this.state.isLoggedIn) {
      return <Redirect to='/'/>
    }

    if(!localStorage["appState"]) {
      return <Redirect to="/" />
    }

    return (
      <Container>
          <Row>
            <Link to="/earning">
                <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <Col xs={12} className="text-center" style={{marginTop: 50, marginBottom: 20}}>
                <h4>Withdrawal</h4>
            </Col>
            <Col xs={12}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control autoComplete='off' type="text" value={this.state.cardNumber} onChange={this.cardNumberhandleChange} placeholder="1234 1234 1234 1234" className="card-num" maxLength="16" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control autoComplete='off' type="text" value={this.state.cvc} onChange={this.cvchandleChange} placeholder="Cvc" maxLength="3" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Expiration Month</Form.Label>
                        <Form.Control autoComplete='off' type="text" placeholder="MM" value={this.state.expiryMonth}  onChange={this.expiryMonthhandleChange} maxLength="2" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Expiration Year</Form.Label>
                        <Form.Control autoComplete='off' type="text" placeholder="YYYY" value={this.state.expiryYear} onChange={this.expiryYearhandleChange} maxLength="4" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Amount ($)</Form.Label>
                        <Form.Control type="text" placeholder="100" value={this.state.amount} onChange={this.amounthandleChange} maxLength="4" required/>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                        Request
                    </Button>
                </Form>     
            </Col>
          </Row>
      </Container>
    );
  }
}

export default Withdrawal;