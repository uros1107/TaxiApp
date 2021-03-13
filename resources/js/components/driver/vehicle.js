import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link,Redirect } from 'react-router-dom';
import Spinner from '../Spinner/normal';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const buttonStyle = {
  width: "100%",
  margin: "50px 0px 0px",
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

const todriverStyle = {
  fontWeight:"bold", 
  margin: "50px 0px 0px"
}

export class Vehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
      loading: false,
      brand: '',
      model: '',
      carplate: '',
      image: '',
      formError: false,
      imgSrc: 'assets/images/cars/default_car.jpg'
    };

    this.carplatehandleChange = this.carplatehandleChange.bind(this);
    this.modelhandleChange = this.modelhandleChange.bind(this);
    this.brandhandleChange = this.brandhandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.imageshow = this.imageshow.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.createImage = this.createImage.bind(this);
  }

  componentWillMount() {
    var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        }
    };

    fetch("/api/vehicle", requestOptions)
    .then(response => response.text())
    .then(result => {
        var myvehicle = JSON.parse(result)
        if(myvehicle != '') {
          this.setState({
            error: false,
            isLoaded: true,

            brand: myvehicle.car_brand,
            model: myvehicle.car_model,
            carplate: myvehicle.car_plate,
            image: myvehicle.car_image,
            imgSrc: myvehicle.car_image == null || myvehicle.car_image == ''?'assets/images/cars/default_car.jpg':'assets/images/cars/a' + myvehicle.car_image,
            uploadCheck: false
          })
        }
      }
    )
    .catch(error => {
        this.setState({
            isLoaded: true,
            error: true
        });
    });
  }

  brandhandleChange(event) {
    this.setState({brand: event.target.value});
  }

  modelhandleChange(event) {
    this.setState({model: event.target.value});
  }

  carplatehandleChange(event) {
    this.setState({carplate: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true})
    if (this.state.image == '') {
      toastr.error('You should upload car image')
    } else {
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          brand: this.state.brand,
          model: this.state.model,
          carplate: this.state.carplate,
          user_id: JSON.parse(localStorage['appState']).user.id,
          file: this.state.image,
          uploadCheck: this.state.uploadCheck
        })
      };
      
      fetch("/api/vehicleupdate", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.setState({loading: false})
          toastr.success('Success!')
        })
        .catch(error => toastr.error('Failed!'));
    }
  }

  imageshow(e) {
    // Assuming only image
    var file = this.refs.file.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
  
     reader.onloadend = function (e) {
        this.setState({
          imgSrc: [reader.result],
          uploadCheck: true
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
    if(!localStorage["appState"]) {
      return <Redirect to="/" />
    }
    if(this.state.loading) {
      return <Spinner />
    }
    if (this.state.error) {
        return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
        return <CircularProgress color="secondary" />;
    } else {
      return (
        <Container>
          <Link to="/">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row>
            <Col lg={12} className="text-center">
              <h4 style={todriverStyle}>My Vehicle Information</h4>
            </Col>
          </Row>
          <Row style={{margin:"20px 0px"}}>
            <Col lg={12} className="text-center">
              <Image src={this.state.imgSrc} thumbnail style={{ width:290, height:190 }}/>
            </Col>
          </Row>
          <Row style={{marginTop:"15px"}}>
            <Col lg={12}>
              <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Form.Group controlId="image" className="text-center">
                  <Col xs="12" sm="12">
                    <Form.Control type="file" ref="file" onChange={this.imageshow} name="image" style={{display: "none"}} />
                  </Col>
                  <Button onClick={this.uploadImage}>Car Image</Button>
                </Form.Group>

                <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item style={{width:"10%"}}>
                      <i className="fa fa-car" style={{fontSize:16}}></i>
                    </Grid>
                    <Grid item style={{width:"90%"}}>
                      <TextField style={{width:"100%"}} value={this.state.brand} onChange={this.brandhandleChange} label="Brand" required/>
                    </Grid>
                  </Grid>
                </Col>

                <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item style={{width:"10%"}}>
                      <i className="fa fa-car" style={{fontSize:16}}></i>
                    </Grid>
                    <Grid item style={{width:"90%"}}>
                      <TextField style={{width:"100%"}} value={this.state.model} onChange={this.modelhandleChange} label="Model" required/>
                    </Grid>
                  </Grid>
                </Col>

                <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item style={{width:"10%"}}>
                      <i className="fa fa-car" style={{fontSize:16}}></i>
                    </Grid>
                    <Grid item style={{width:"90%"}}>
                      <TextField style={{width:"100%"}} value={this.state.carplate} onChange={this.carplatehandleChange} label="CarPlate" required/>
                    </Grid>
                  </Grid>
                </Col>

                <Col xs="12" className="text-right">
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Save
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

export default Vehicle;