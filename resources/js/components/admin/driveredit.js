import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import Spinner from '../Spinner/normal';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const buttonStyle = {
  width: "100%"
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

var myprofile = '';
var driver_id = '';

export class DriverEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            is_actived: false,
            loading: false,

            //  profile
            name: '',
            email: '',
            password: '',
            phone: '',
            image: '',
            imgSrc: 'assets/images/profile.png',
            uploadCheck: false,

            // vehicle
            brand: '',
            model: '',
            carplate: '',
            image1: '',
            imgSrc1: 'assets/images/cars/default_car.jpg',
            uploadCheck1: false,
        };

      //  profile
      this.emailhandleChange = this.emailhandleChange.bind(this);
      this.passwordhandleChange = this.passwordhandleChange.bind(this);
      this.namehandleChange = this.namehandleChange.bind(this);
      this.phonehandleChange = this.phonehandleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.imageshow = this.imageshow.bind(this);
      this.uploadImage = this.uploadImage.bind(this);
      this.createImage = this.createImage.bind(this);

      //  vehicle
      this.carplatehandleChange = this.carplatehandleChange.bind(this);
      this.modelhandleChange = this.modelhandleChange.bind(this);
      this.brandhandleChange = this.brandhandleChange.bind(this);
      this.imageshow1 = this.imageshow1.bind(this);
      this.uploadImage1 = this.uploadImage1.bind(this);
      this.createImage1 = this.createImage1.bind(this);
      this.toggleChecked = this.toggleChecked.bind(this);

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
      
      fetch("api/driveredit", requestOptions)
        .then(response => response.text())
        .then(result => {
          myprofile = JSON.parse(result)
          this.setState({
              error: false,
              isLoaded: true,
              name: myprofile.driver.name,
              email: myprofile.driver.email,
              // password: '',
              phone: myprofile.driver.phone,
              is_actived: myprofile.driver.is_actived == 1? true:false,
              image: myprofile.driver.photo,
              imgSrc: myprofile.driver.photo == null || myprofile.driver.photo == ''?'assets/images/users/default.png':'assets/images/users/a' + myprofile.driver.photo,

              // vehicle
              brand: myprofile.vehicle != null? myprofile.vehicle.car_brand : '',
              model: myprofile.vehicle != null? myprofile.vehicle.car_model : '',
              carplate: myprofile.vehicle != null? myprofile.vehicle.car_plate : '',
              image1: myprofile.vehicle != null? myprofile.vehicle.car_image : '',
              imgSrc1: myprofile.vehicle != null ? 'assets/images/cars/a' + myprofile.vehicle.car_image : 'assets/images/cars/default_car.jpg',
              uploadCheck1: false
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

    toggleChecked() {
      if(this.state.is_actived == true) {
        this.setState({is_actived: false});
      } else {
        this.setState({is_actived: true});
      }
      // localStorage["online_checked"] =!online_checked;
      // $.ajax({
      //     method: "POST",
      //     url: "api/setonline",
      //     data: {
      //       set_online: !online_checked
      //     },
      //     success: function(result){
      //         console.log('success')
      //     },
      //     error: function(error) {
      //       console.log(error)
      //     }
      // });
    };
  
    namehandleChange(event) {
      this.setState({name: event.target.value});
    }
  
    emailhandleChange(event) {
      this.setState({email: event.target.value});
    }
  
    phonehandleChange(event) {
      this.setState({phone: event.target.value});
    }
  
    passwordhandleChange(event) {
      this.setState({password: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.setState({loading: true})
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          // profile
          id: driver_id,
          name: this.state.name,
          email: this.state.email,
          // password: this.state.password,
          phone: this.state.phone,
          is_actived: this.state.is_actived? 1:0,
          file: this.state.image,
          uploadCheck: this.state.uploadCheck,

          // vehicle
          brand: this.state.brand,
          model: this.state.model,
          carplate: this.state.carplate,
          file1: this.state.image1,
          uploadCheck1: this.state.uploadCheck1
        })
      };
      
      fetch("/api/driverprofileupdate", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.setState({loading: false})
            var status = JSON.parse(result)
            if(status.status == 0) {
              toastr.error('User save error!')
            } else if(status.status == 1) {
              toastr.error('Vehicle save error!')
            } else {
              toastr.success('Successfully updated!')
            }
        })
        .catch(error => toastr.error('Failed!'));
    }
  
    imageshow(e) {
      // Assuming only image
      this.setState({
        image: e.target.result,
        uploadCheck: true
      });  
      var file = this.refs.file.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
    
       reader.onloadend = function (e) {
          this.setState({
              imgSrc: [reader.result]
          })
        }.bind(this);

      this.setState({image: e.target.value});

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

// ------------------------  vehicle
    brandhandleChange(event) {
      this.setState({brand: event.target.value});
    }
  
    modelhandleChange(event) {
      this.setState({model: event.target.value});
    }
  
    carplatehandleChange(event) {
      this.setState({carplate: event.target.value});
    }
  
    imageshow1(e) {
      // Assuming only image
      var file = this.refs.file1.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
    
       reader.onloadend = function (e) {
          this.setState({
            imgSrc1: [reader.result],
            uploadCheck1: true
          })
        }.bind(this);
  
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
            return;
      this.createImage1(files[0]);
    }
  
    createImage1(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          image1: e.target.result
        })
      };
      reader.readAsDataURL(file);
    }
  
    uploadImage1()  {
      $('#image1').click();
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
                <Link to="/drivermanage">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 0px", fontWeight: 600, textTransform: "capitalize"}}>{this.state.name}</h4>
                  </Col>
                </Row>
                <Row style={{margin:"20px 0px"}}>
                  <Col lg={12} className="text-center">
                    <Image src={this.state.imgSrc} className="rounded-circle" thumbnail style={{ width:220, height:220 }}/>
                  </Col>
                </Row>
                <Row style={{marginTop:"15px"}}>
                  <Col lg={12}>
                    <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                      <Form.Group as={Row} controlId="image">
                        <Col xs={6} sm={6} className="text-left">
                          <FormGroup>
                            <FormControlLabel
                              control={<Switch checked={this.state.is_actived} onChange={this.toggleChecked} />}
                              label="Active/Deactive"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="6" sm="6" className="text-right">
                          <Form.Control type="file" ref="file" onChange={this.imageshow} name="image" style={{display: "none"}} />
                          <Button onClick={this.uploadImage}>Upload</Button>
                        </Col>
                      </Form.Group>

                      <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item style={{width:"10%"}}>
                            <i className="fa fa-user" style={{fontSize:20}}></i>
                          </Grid>
                          <Grid item style={{width:"90%"}}>
                            <TextField style={{width:"100%"}} value={this.state.name} onChange={this.namehandleChange} label="User Name" required/>
                          </Grid>
                        </Grid>
                      </Col>

                      <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item style={{width:"10%"}}>
                            <i className="fa fa-envelope-open" style={{fontSize:16}}></i> { /*fa fa-envelope-square */}
                          </Grid>
                          <Grid item style={{width:"90%"}}>
                            <TextField type="email" style={{width:"100%"}} value={this.state.email} onChange={this.emailhandleChange} label="User Email" required/>
                          </Grid>
                        </Grid>
                      </Col>

                      {/* <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item style={{width:"10%"}}>
                            <i className="fa fa-key" style={{fontSize:20}}></i>
                          </Grid>
                          <Grid item style={{width:"90%"}}>
                            <TextField type="password" style={{width:"100%"}} value={this.state.password} onChange={this.passwordhandleChange} label="User Password"/>
                          </Grid>
                        </Grid>
                      </Col> */}

                      <Col xs={12} className="text-center" style={{margin: "5px 0px"}}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item style={{width:"10%"}}>
                            <i className="fa fa-phone" style={{fontSize:20}}></i>
                          </Grid>
                          <Grid item style={{width:"90%"}}>
                            <TextField style={{width:"100%"}} value={this.state.phone} onChange={this.phonehandleChange} label="User Phone" required/>
                          </Grid>
                        </Grid>
                      </Col>

{/* --------------------------- vehicle ------------------------ */}
                    <Row style={{margin:"20px 0px"}}>
                      <Col lg={12} className="text-center">
                        <Image src={this.state.imgSrc1} thumbnail style={{ width:290, height:190 }}/>
                      </Col>
                    </Row>
                      <Form.Group controlId="image1" className="text-center">
                        <Col xs="12" sm="12">
                          <Form.Control type="file" ref="file1" onChange={this.imageshow1} name="image1" style={{display: "none"}} />
                        </Col>
                        <Button onClick={this.uploadImage1}>Car Image</Button>
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
        
                      <Col xs="12" className="text-right" style={{margin: "30px 0px"}}>
                        <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                          Update
                        </Button>
                      </Col>
                    </Form>
                  </Col>
                </Row>
               
              </Container>
            )
        }
    }
}

export default DriverEdit;