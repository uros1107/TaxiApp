import React, { Component } from 'react';
import { Button,Container, Row, Col, Image } from 'react-bootstrap';
import toastr from 'toastr';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link,Redirect } from 'react-router-dom';
import Spinner from '../Spinner/normal';

const buttonStyle = {
    width: "100%", 
    margin: "20px 0px",
  };

const driverName = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "0px"
  };

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }

  const driverImage = {
    width: "60px",
    height: "60px",
    maxWidth: "unset"
  };



const star = {
    width: "15px"
  };

const driverItem = {
    margin: "10px 0px",
    boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)",
    borderRadius: "10px"
  };

const earnMsg = {
    // fontSize: "16px",
    // fontWeight: "600",
    marginBottom: "0px",
    color: "#808080",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  };

const acceptMsg = {
    // fontSize: "16px",
    // fontWeight: "600",
    marginBottom: "0px",
    color: "#0b56ff",
    fontSize: "0.9rem",
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  };

const rejectMsg = {
    // fontSize: "16px",
    // fontWeight: "600",
    marginBottom: "0px",
    color: "#ff0b0b",
    fontSize: "0.9rem",
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  };

const adminMsg = {
    // fontSize: "16px",
    // fontWeight: "600",
    marginBottom: "0px",
    color: "#04e468",
    fontSize: "0.9rem",
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  };

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            notifications: [],
            loading: false
        };

        this.requestAccept = this.requestAccept.bind(this);
        this.requestRemove = this.requestRemove.bind(this);
    }

    componentDidMount() {
        var requestOptions = {
            method: 'GET',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
            }
        };
    
        fetch("/api/get_driver_notification", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(JSON.parse(result))
            this.setState({
                notifications: JSON.parse(result),
                error: false,
                isLoaded: true
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

    removeNotify(notification_id) {
        $.ajax({
            method: "POST",
            url: "api/removenotify",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {notification_id: notification_id},
            success: function(result){
              toastr.success('Your notification removed!')
            },
            error: function(error) {
              console.log(error)
              toastr.error('Failed!')
            }
        });
    }

    requestAccept(notification_id) {
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/requestaccept",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {notification_id: notification_id},
            success: function(result){
                if(result) {
                    this.setState({loading: false})
                    toastr.success('Your booking Success!')
                    location.reload()
                } else {
                    this.setState({loading: false})
                    toastr.success('Your booking Failed! Passenger cant pay trip fare by card!')
                }
            }.bind(this),
            error: function(error) {
              this.setState({loading: false})
              toastr.error('Server error')
            }.bind(this)
        });
    }

    requestRemove(notification_id) {
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/requestreject",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {notification_id: notification_id},
            success: function(result){
              this.setState({loading: false})
              toastr.success('Your booking canceled!')
              location.reload()
            }.bind(this),
            error: function(error) {
              this.setState({loading: false})
              toastr.error('Server error')
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
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Container>
                    <Link to="/">
                        <ArrowBackIosIcon style={backStyle}/>
                    </Link>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={{marginTop:"50px", fontSize: 20, fontWeight: 'bold'}}>Notifications</h4>
                        </Col>
                    </Row>
                    {this.state.notifications == '' && (
                    <Row>
                        <Col xs={12} className="text-center">
                            <h5 style={{marginTop:"50px", fontSize: 15}}>No notifications</h5>
                        </Col>
                    </Row>
                    )}
                    {this.state.notifications.map((notification, index) => (
                        notification.is_system_message == 1 && notification.whose_notify == 1?
                            <Row key={index} style={driverItem}>
                                <Col xs={3} className="text-center" style={{padding:"10px"}}>
                                    <Image src={notification.photo == null || notification.photo==''?"assets/images/users/default.png":"assets/images/users/a" + notification.photo} style={driverImage} thumbnail className="rounded-circle"/>
                                </Col>
                                <Col xs={7} style={{padding:"15px 0px"}}>
                                    <Row>
                                        {notification.status == 3 && (          //admin msg
                                            <Col xs={12}><p style={adminMsg}>{notification.system_message}</p></Col>
                                        )}
                                        {notification.status == 2 && (          //earned
                                            <Col xs={12}><p style={earnMsg}>{notification.system_message}</p></Col>
                                        )}
                                        {notification.status == 1 && (          //accept
                                            <Col xs={12}><p style={acceptMsg}>{notification.system_message}</p></Col>
                                        )}
                                        {notification.status == 0 && (          //reject
                                            <Col xs={12}><p style={rejectMsg}>{notification.system_message}</p></Col>
                                        )}
                                        <Col xs={12} style={{fontSize: 12}}><i className='fa fa-user' style={{color:'#000'}}></i> {notification.name}</Col>
                                        <Col xs={12} className="text-right" style={{fontSize: 12}}>{moment(notification.created_at).fromNow()}</Col>
                                    </Row>
                                </Col>
                                <Col xs={2} className="text-center" style={{padding:"27px 0px"}}>
                                    <CloseIcon style={{color: "#bfbfbf"}} onClick={() => this.removeNotify(notification.id)}/>
                                </Col>
                            </Row> :
                            <Row key={index} style={driverItem}>
                                {/* <Col xs={12} className="text-center">
                                    <p style={{marginBottom: 10}}><i className='fa fa-question-circle-o' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.driver_message}</p>
                                </Col> */}
                                <Col xs={3} className="text-center" style={{padding:"10px"}}>
                                    <Image src={notification.photo == null || notification.photo==''?"assets/images/users/default.png":"assets/images/users/a" + notification.photo} style={driverImage} thumbnail className="rounded-circle"/>
                                </Col>
                                <Col xs={6} style={{padding:"15px 0px"}}>
                                    <Row>
                                        <Col xs={12}><p style={driverName}>{notification.name}</p></Col>
                                        {/* <Col xs={12} style={{fontSize: 12}}><i className='fa fa-phone' style={{color:'#000'}}></i> {notification.phone}</Col> */}
                                    </Row>
                                </Col>
                                <Col xs={3} style={{padding:"15px 10px"}}>
                                    <p>{'$ ' + notification.trip_fare}</p>
                                </Col>
                                <Col xs={12}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-location-arrow' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.departure}</p>
                                </Col>
                                <Col xs={12}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-map-marker' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.destination}</p>
                                </Col>
                                <Col xs={6}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-clock-o' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.order_time}</p>
                                </Col>
                                <Col xs={6}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-car' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.number_people}</p>
                                </Col>
                                <Col xs={6}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-dollar' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.trip_fare}</p>
                                </Col>
                                <Col xs={6}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-support' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.trip_distance + ' mile'}</p>
                                </Col>
                                <Col xs={12}>
                                    <p style={{marginBottom: 10}}><i className='fa fa-commenting-o' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {notification.passenger_message}</p>
                                </Col>
                                <Col xs={6}>
                                    <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.requestAccept(notification.id)}>
                                        Accept
                                    </Button>
                                </Col>
                                <Col xs={6}>
                                    <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.requestRemove(notification.id)}>
                                        Decline
                                    </Button>
                                </Col>
                                <Col xs={12} className="text-right" style={{fontSize: 12}}>{moment(notification.created_at).fromNow()}</Col>
                            </Row>
                    ))}
                </Container>
            )
        }
    }
}

export default Notification;