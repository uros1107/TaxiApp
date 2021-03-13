import React, { Component } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

const driverItem = {
    margin: "15px 0px",
    boxShadow: "0px 0px 23px -6px rgba(0,0,0,0.25)",
    borderRadius: "10px"
  };

export class RideHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            histories: [],
            ratings: [],
            visible: false
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
    
        fetch("/api/getridehistory", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(JSON.parse(result))
            this.setState({
                histories: JSON.parse(result).histories,
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
    
    render() {
        if(!localStorage["appState"]) {
            return <Redirect to="/" />
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
                            <h4 style={{marginTop:"50px", fontSize: 20}}>Ride History</h4>
                        </Col>
                    </Row>
                    {this.state.histories == '' && (
                    <Row>
                        <Col xs={12} className="text-center">
                            <h5 style={{marginTop:"50px", fontSize: 15}}>No history</h5>
                        </Col>
                    </Row>
                    )}
                    {this.state.histories.map((history, index) => (
                    <Row key={index} style={driverItem}>
                        <Col xs={3} md={6} className="text-left" style={{padding:"10px"}}>
                            <Image src={history.photo == null || history.photo == ''?"assets/images/users/default.png":"assets/images/users/a" + history.photo} style={driverImage} className="rounded-circle"/>
                        </Col>
                        <Col xs={6} style={{padding:"15px 0px 15px"}}>
                            <Row>
                                <Col xs={12}><p style={driverName}>{history.name}</p></Col>
                                <Col xs={12} style={{fontSize: 12}}><i className='fa fa-star' style={{color:'#fdce22'}}></i> {this.state.ratings[history.driver_id]}</Col>
                            </Row>
                        </Col>
                        <Col xs={3} className="text-center" style={{padding:"15px"}}>
                            <p>{'$ ' + history.price}</p>
                        </Col>
                        <Col xs={12}>
                            <p style={{marginBottom: 10}}><i className='fa fa-location-arrow' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.departure}</p>
                        </Col>
                        <Col xs={12}>
                            <p style={{marginBottom: 10}}><i className='fa fa-map-marker' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.destination}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-clock-o' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.order_time}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-car' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.number_people}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-dollar' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.price}</p>
                        </Col>
                        <Col xs={6}>
                            <p style={{marginBottom: 10}}><i className='fa fa-support' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; {history.trip_distance + ' mile'}</p>
                        </Col>
                        {history.status == 0 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Pending</p>
                            </Col>
                        )}
                        {history.status == 1 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Accepted</p>
                            </Col>
                        )}
                        {history.status == 2 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Canceled</p>
                            </Col>
                        )}
                        {history.status == 3 && (
                            <Col xs={6}>
                                <p style={{marginBottom: 10}}><i className='fa fa-hourglass-start' style={{color:'#ff0505'}}></i>&nbsp;&nbsp; Completed</p>
                            </Col>
                        )}
                        <Col xs={12} className="text-right">
                            <p style={{marginBottom: 0, color: '#929292', fontSize: 12}}>{moment(history.updated_at).fromNow()}</p>
                        </Col>
                    </Row>
                    ))}
                </Container>
            )
        }
    }
}

export default RideHistory;