import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2'
import Spinner from './Spinner/normal';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import 'react-phone-input-2/lib/style.css'

const buttonStyle = {
    width: "100%", 
};

const dropStyle = {
    width: "220px", 
    display: "inline", 
    bottom: "25px", 
    fontSize: 12
}

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }


export class PhoneNumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            data: {},
            imgSrc: 'assets/images/login.jpg',
            phone_verify: false,
            spinner: false,
            toHome: false
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    componentDidMount() {
        var requestOptions = {
            method: 'POST',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              social: localStorage['social']
            })
          };
        fetch(`/api/social/callback${this.props.location.search}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw toastr.error('Something went wrong, try again');
            })
            .then((data) => {
                if(data['status'] == 2) {
                    localStorage['firstname'] = data['social_user'].name
                    localStorage['lastname'] = data['social_user'].name
                    localStorage['email'] = data['social_user'].email
                    localStorage['password'] = ''
                    this.setState({ 
                        loading: false,
                    });
                } else {
                    toastr.success('Successfully logged in!')
                    this.setState({isLoggedIn: true})
                    let userData = {
                        id: data['user'].id,
                        name: data['user'].name,
                        email: data['user'].email,
                        role: data['user'].role,
                        photo: data['user'].photo,
                        access_token: data['user'].remember_token,
                    };
                    let appState = {
                        isLoggedIn: true,
                        user: userData
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                    this.setState({toHome: true})
                    location.reload()
                }
            })
            .catch((error) => {
                this.setState({ loading: false, error });
                console.error(error);
            });
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
            phone_number: this.state.phone,
          })
        };
        
        fetch("/api/register", requestOptions)
          .then(response => response.text())
          .then(result => {
            this.setState({spinner: false})
            var status = JSON.parse(result)
            if (status.success == false) {
              toastr.error('Your email has already taken!')
            } else if(status.success == -1) {
              toastr.error('Your phone number already exists')
            } else if(status.success == -2) {
              toastr.error(status.status)
            } else if(status.success == true) {
              localStorage['phone_number'] = this.state.phone
              this.setState({phone_verify: true})
            } else if(status.error == true) {
              toastr.error('Sever Error!')
            }
          })
          .catch(error => toastr.error('Failed!'));
      }

    render() {
        if(this.state.toHome) {
            return <Redirect to="/" />
        }
        if(this.state.spinner) {
            return <Spinner />
        }
        if(this.state.phone_verify) {
            return <Redirect to="/phoneverify" />
        } else if(this.state.loading) {
            return <div>Loading...</div>
        } else {
            return (
                <Container>
                    <Link to="/login">
                        <ArrowBackIosIcon style={backStyle}/>
                    </Link>
                    <Row style={{margin:"70px 0px 30px"}}>
                        <Col lg={12} className="text-center">
                            <Image src={this.state.imgSrc} className="rounded-circle" style={{ width: "80%" }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className="text-center" style={{margin: "20px 0px"}}>
                            <p style={{fontSize: 20, fontWeight: 600}}>Please your phone number.</p>
                        </Col>
                    </Row>
                    <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group as={Row} controlId="phone">
                            <Col xs="12" sm="12" style={{padding: "0px 30px"}}>
                                <PhoneInput
                                    country={'us'}
                                    value={this.state.phone}
                                    onChange={phone => this.setState({ phone })}
                                    inputStyle={{width: "100%"}}
                                    dropdownStyle={dropStyle}
                                />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col xs={12} className="text-center" style={{marginTop: 35}}>
                                <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                                    Get Verify Code
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            );
        }
    }
}

export default PhoneNumberInput;