import React, { Component } from 'react';
import { Button,Container, Row, Col } from 'react-bootstrap';
import { Link,Redirect } from 'react-router-dom';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import {loadStripe} from '@stripe/stripe-js';

// import CheckoutForm from './checkoutform';

const stripePromise = loadStripe("pk_test_UjJ892tTsUChobO26XmPQvjy");

const buttonStyle = {
    width: "100%", 
    margin: "50px 0px 0px",
  };

const balanceStyle = {
    width: 250,
    height: 250,
    // margin: 25,
    borderRadius: "50%",
    margin: "0 auto",
    textAlign: "center",
    borderRadius: "50%",
    border: "25px solid #00ff68"
}

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }

const balanceMoney = {
    margin: "79px 0px", 
    fontSize: 35, 
    color: "#00ff68"
}

var mybookings = '';

export class MyBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            earning: '',
            toWithdrawal: false
        };
    }

    componentWillMount() {
        var audio = new Audio('assets/audio/notification_simple-02.wav')
        audio.load()
        audio.play()
        var requestOptions = {
            method: 'GET',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
            }
        };
    
        fetch("/api/getmyearnings", requestOptions)
        .then(response => response.text())
        .then(result => {
            var user_balance = JSON.parse(result);
            this.setState({
                earning: user_balance,
                isLoaded: true,
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

    render() {
        if(!localStorage["appState"]) {
            return <Redirect to="/" />
        }
        if(this.state.toWithdrawal) {
            return <Redirect to="/withdrawal"></Redirect>
        }

        if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Container>
                    <Link to="/">
                        <ArrowBackIosIcon style={backStyle}/>
                    </Link>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={{marginTop:50, marginBottom:20, fontWeight: "bold"}}>My Earnings</h4>
                        </Col>
                        <Col xs={12} className="text-center" style={{marginTop: 40}}>
                            <div style={balanceStyle}>
                                <h1 style={balanceMoney}>{'$' + this.state.earning}</h1>
                            </div>
                            <div className="text-center" style={{margin: "40px 20px"}}>
                                <p style={{fontSize: 20}} className="mb-0">Total Balance</p>
                                <p style={{color: "#888888"}}>Hope you earn many money!</p>
                            </div>
                        </Col>
                        {/* <Col xs="12" className="text-right">
                            <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.setState({toWithdrawal: true})}>
                                WithDrawal
                            </Button>
                        </Col> */}
                    </Row>
                </Container>
            )
        }
    }
}

export default MyBooking;