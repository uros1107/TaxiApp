import React, { Component } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Spinner from '../Spinner/normal';

const sysMsg = {
    marginBottom: "0px",
    color: "#5a5a5a",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  };

const driverImage = {
    width: "60px",
    height: "60px",
    maxWidth: "unset"
  };

const driverItem = {
    margin: "15px 0px",
    boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)",
    borderRadius: "10px"
  };

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
}

const addStyle = {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 900,
    color: "#0981fd"
  }

const headerStyle = {
    marginTop:"50px", 
    fontSize: 20, 
    fontWeight: "bold"
}

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            notifications: '',
            ratings: '',
            visible: false,
            notifychecked: false,
            loading: false
        };

        this.removeNotify = this.removeNotify.bind(this);
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
    
        fetch("/api/getnotification", requestOptions)
        .then(response => response.text())
        .then(result => {
            this.setState({
                notifications: JSON.parse(result).notification,
                ratings: JSON.parse(result).ratings,
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
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/removeadminnotify",
            data: {notification_id: notification_id},
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
              this.setState({loading: false})
              toastr.success('Your notification removed!')
              location.reload()
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
        if(this.state.notifychecked) {
            return <Redirect to="/adminNotificationDetail" />
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
                    <AddCircleOutlineIcon style={addStyle} onClick={() => this.setState({notifychecked: true})}/>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 style={headerStyle}>Notifications</h4>
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
                    <Row key={index} style={driverItem}>
                        <Col xs={3} className="text-center" style={{padding:"10px"}}>
                            <Image src={notification.photo == null || notification.photo==''?"assets/images/users/default.png":"assets/images/users/a" + notification.photo} style={driverImage} thumbnail className="rounded-circle"/>
                        </Col>
                        <Col xs={7} style={{padding:"15px 0px"}}>
                            <Row>
                                <Col xs={12}><p style={sysMsg}>{notification.system_message}</p></Col>
                                <Col xs={12} style={{fontSize: 12}}><i className='fa fa-user' style={{color:'#000'}}></i> {notification.name}</Col>
                                <Col xs={12} className="text-right" style={{fontSize: 12}}>{moment(notification.created_at).fromNow()}</Col>
                            </Row>
                        </Col>
                        <Col xs={2} className="text-center" style={{padding:"27px 0px"}}>
                            <CloseIcon style={{color: "#bfbfbf"}} onClick={() => this.removeNotify(notification.id)}/>
                        </Col>
                    </Row>
                    ))}
                </Container>
            )
        }
    }
}

export default Notification;