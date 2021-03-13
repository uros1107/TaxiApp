import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }

const buttonStyle = {
    width: "100%", 
    margin: "20px 0px",
  };

const headerStyle = {
    marginTop:50, 
    marginBottom:20 , 
    fontWeight: "bold"
}

export class DriverSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          radius: '',
          fee: '',
          fare_mile: '',
          cancel_fee: '',
          error: false,
          isLoaded: false,
          loading: false
        };

        this.radiushandleChange = this.radiushandleChange.bind(this);
        this.feehandleChange = this.feehandleChange.bind(this);
        this.fareMilehandleChange = this.fareMilehandleChange.bind(this);
        this.cancelFeehandleChange = this.cancelFeehandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        var requestOptions = {
            method: 'GET',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
            },
          };
          
          fetch("/api/getsettings", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    radius: JSON.parse(result)[0].radius,
                    fee: JSON.parse(result)[0].fee,
                    fare_mile: JSON.parse(result)[0].fare_per_mile,
                    cancel_fee: JSON.parse(result)[0].cancel_fee,
                    isLoaded: true
                })
            })
            .catch(error => {
                console.log(error)
                toastr.error('Failed!')
            });
    }

    radiushandleChange(event) {
        this.setState({radius: event.target.value});
    }

    cancelFeehandleChange(event) {
        this.setState({cancel_fee: event.target.value});
    }

    feehandleChange(event) {
        this.setState({fee: event.target.value});
    }

    fareMilehandleChange(event) {
        this.setState({fare_mile: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/settings",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {
                radius: this.state.radius,
                fee: this.state.fee,
                fare_mile: this.state.fare_mile,
                cancel_fee: this.state.cancel_fee,
            },
            success: function(result){
                this.setState({loading: false})
                if (result.success == true) {
                    toastr.success('Successfully saved!')
                } else {
                    toastr.error('Server error!')
                }
            }.bind(this),
            error: function(error) {
                this.setState({loading: false})
                console.log(error)
                toastr.error('Failed!')
            }.bind(this)
        });
    }

    
    
    render() {
        if(!localStorage["appState"]) {
            return <Redirect to="/" />
        }
        if(this.state.loading) {
            return <Spinner />
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
                            <h4 style={headerStyle}>Settings</h4>
                        </Col>
                    </Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label style={{fontSize: 18}}>Radius</Form.Label>
                            <Form.Control type="text" value={this.state.radius} onChange={this.radiushandleChange} placeholder="Enter Radius" />
                            <Form.Text className="text-muted">
                                We'll search drivers near by this radius.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label style={{fontSize: 18}}>Fee</Form.Label>
                            <Form.Control type="text" value={this.state.fee} onChange={this.feehandleChange} placeholder="Enter Fee" />
                            <Form.Text className="text-muted">
                                We'll get from customers money by this fee.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label style={{fontSize: 18}}>Fare per mile</Form.Label>
                            <Form.Control type="text" value={this.state.fare_mile} onChange={this.fareMilehandleChange} placeholder="Enter Price" />
                            <Form.Text className="text-muted">
                                We'll calculate fare by this price per mile.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label style={{fontSize: 18}}>Ride cancel fee</Form.Label>
                            <Form.Control type="text" value={this.state.cancel_fee} onChange={this.cancelFeehandleChange} placeholder="Enter Cancel Fee" />
                            <Form.Text className="text-muted">
                                We'll apply cancel fee to customers.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="buttton" className="standardButton" style={buttonStyle}>
                            Save
                        </Button>
                    </Form>
                </Container>
            )
        }
    }
}

export default DriverSearch;