import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';

import Rating from '@material-ui/lab/Rating';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

const listStyle = {
  width: '100%',
  maxWidth: '100%',
  backgroundColor: "white",
  paddingTop: 0,
  paddingBottom: 0,
  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 23px -6px',
}

const typoStyle = {
  display: 'inline',
}

const todriverStyle = {
  fontWeight:"bold", 
  margin: "50px 0px 0px"
}

var myprofile = '';
var driver_id = '';

export class DriverView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            is_actived: false,
            ratings: [],

            //  profile
            name: '',
            email: '',
            phone: '',
            imgSrc: 'assets/images/profile.png',
            uploadCheck: false,

            // vehicle
            brand: '',
            model: '',
            carplate: '',
            imgSrc1: 'assets/images/cars/default_car.jpg',
        };

      const { location } = this.props;
      const previousPath = location.driver_id;
      driver_id = previousPath;
    }

    componentDidMount() {
      //  profile
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          driver_id: driver_id
        })
      };
      
      fetch("api/driverview", requestOptions)
        .then(response => response.text())
        .then(result => {
          myprofile = JSON.parse(result)
          this.setState({
              error: false,
              isLoaded: true,
              ratings: myprofile.ratings,
              name: myprofile.driver.name,
              email: myprofile.driver.email,
              // password: '',
              phone: myprofile.driver.phone,
              is_actived: myprofile.driver.is_actived == 1? true:false,
              imgSrc: myprofile.driver.photo == null || myprofile.driver.photo == ''?'assets/images/users/default.png':'assets/images/users/a' + myprofile.driver.photo,

              // vehicle
              brand: myprofile.vehicle != null? myprofile.vehicle.car_brand : '',
              model: myprofile.vehicle != null? myprofile.vehicle.car_model : '',
              carplate: myprofile.vehicle != null? myprofile.vehicle.car_plate : '',
              imgSrc1: myprofile.vehicle != null? 'assets/images/cars/a' + myprofile.vehicle.car_image : 'assets/images/cars/default_car.jpg',
          })
        })
        .catch(error => {
          console.log(error.message)
          this.setState({
              isLoaded: false,
              error: false
          });
        });
    }
    
    render() {
        if(!localStorage["appState"]) {
          return <Redirect to="/" />
        }
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
          return <CircularProgress color="secondary" />;
        } else {
            return (
              <Container>
                <Link to="/drivermanage">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 0px", fontWeight: 600, textTransform: "capitalize"}}>{this.state.name}</h4>
                  </Col>
                </Row>
                <Row style={{margin:"20px 0px"}}>
                  <Col xs={4} className="text-center" style={{ padding: "2px 10px"}}>
                    <Image src={this.state.imgSrc} className="rounded-circle" thumbnail style={{ width:"100%" }}/>
                  </Col>
                  <Col xs={8}>
                    <Row>
                      <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                        <i className='fa fa-user' style={{color:'#000'}}></i>&nbsp; {this.state.name}
                      </Col>

                      <Col xs={12} className="text-left" style={{margin: "5px 0px", wordBreak: "break-all"}}>
                        <i className='fa fa-envelope-open' style={{color:'#000', fontSize: 11}}></i>&nbsp; {this.state.email}
                      </Col>

                      <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                        <i className='fa fa-phone' style={{color:'#000'}}></i>&nbsp; {this.state.phone}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{marginTop:"15px"}}>
                  <Col lg={12} className="text-center">
                    <Image src={this.state.imgSrc1} thumbnail style={{ width:290, height:190 }}/>
                  </Col>
                </Row>
                <Row style={{padding: "10px 40px"}}>
                  <Col xs={6} className="text-left" style={{margin: "5px 0px"}}>
                    <i className='fa fa-car' style={{color:'#000'}}></i>&nbsp; {this.state.brand}
                  </Col>

                  <Col xs={6} className="text-left" style={{margin: "5px 0px"}}>
                    <i className='fa fa-car' style={{color:'#000'}}></i>&nbsp; {this.state.model}
                  </Col>

                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <i className='fa fa-car' style={{color:'#000'}}></i>&nbsp; {this.state.carplate}
                  </Col>
                </Row>

                {/* ratings part */}
                <Row>
                  <Col xs={12} style={{padding: "12px 25px"}}>
                    <h5 style={{color: "#0072ff", fontWeight: 600}}>Ratings from Customers</h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="text-center">
                    {this.state.ratings == '' && (
                      <p style={{fontSize:16}}>No reviews</p>
                    )}
                    <List style={listStyle}>
                    {this.state.ratings.map((rating, index) => ( 
                      <ListItem key={index} alignItems="flex-start" style={{background: index % 2 == 0?'':'#f5f5f5', borderBottom: '1px solid #dddddd'}}>
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={rating.photo == '' || rating.photo == null? "assets/images/users/default.png":"assets/images/users/a" + rating.photo} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={rating.name}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                style={typoStyle}
                                color="textPrimary"
                              >
                                <Rating name="size-small" defaultValue={rating.rating} size="small" readOnly />
                              </Typography>
                              {" - " + rating.review}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))}
                      {/* <Divider variant="inset" component="li" /> */}
                    </List>
                  </Col>
                </Row>
              </Container>
            )
        }
    }
}

export default DriverView;