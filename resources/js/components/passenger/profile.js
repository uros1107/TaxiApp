import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link, Redirect } from 'react-router-dom';

const buttonStyle = {
    width: "100%", 
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

var myprofile = '';

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            loading: false,

            name: '',
            email: '',
            password: '',
            phone: '',
            image: '',
            formError: false,
            imgSrc: 'assets/images/profile.png',
            uploadCheck: false
        };

      this.emailhandleChange = this.emailhandleChange.bind(this);
      this.passwordhandleChange = this.passwordhandleChange.bind(this);
      this.namehandleChange = this.namehandleChange.bind(this);
      this.phonehandleChange = this.phonehandleChange.bind(this);
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
    
        fetch("/api/profile", requestOptions)
        .then(response => response.text())
        .then(result => {
            myprofile = JSON.parse(result)
            this.setState({
                error: false,
                isLoaded: true,

                name: myprofile[0].name,
                email: myprofile[0].email,
                password: '',
                phone: myprofile[0].phone,
                image: myprofile[0].photo,
                imgSrc: myprofile[0].photo == null || myprofile[0].photo == ''?'assets/images/users/default.png':'assets/images/users/a' + myprofile[0].photo
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
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          phone: this.state.phone,
          file: this.state.image,
          uploadCheck: this.state.uploadCheck
        })
      };
      
      fetch("/api/update", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.setState({loading: false})
            toastr.success('Successfully saved!')
            var status = JSON.parse(result)
            let userData = {
              id: status.user.id,
              name: status.user.name,
              email: status.user.email,
              role: status.user.role,
              photo: status.user.photo,
              access_token: status.user.remember_token,
            };
            let appState = {
              isLoggedIn: true,
              user: userData
            };
            localStorage["appState"] = JSON.stringify(appState);
            // location.reload()
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
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 0px", fontWeight: 600}}>My Profile</h4>
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
                        <Col xs="8" sm="10">
                          <Form.Control type="file" ref="file" onChange={this.imageshow} name="image" style={{display: "none"}} />
                        </Col>
                        <Button onClick={this.uploadImage}>Upload</Button>
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="email">
                        <Form.Label column xs="4" sm="2">
                          Name
                        </Form.Label>
                        <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                          <Form.Control type="text" value={this.state.name} onChange={this.namehandleChange} placeholder="your name" required/>
                        </Col>
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="email">
                        <Form.Label column xs="4" sm="2">
                          Email
                        </Form.Label>
                        <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                          <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} placeholder="your email" required/>
                        </Col>
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="email">
                        <Form.Label column xs="4" sm="2">
                          Password
                        </Form.Label>
                        <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                          <Form.Control type="text" value={this.state.password} onChange={this.passwordhandleChange} placeholder="your password" required/>
                        </Col>
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="password">
                        <Form.Label column xs="4" sm="2">
                          Phone
                        </Form.Label>
                        <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                          <Form.Control type="text" value={this.state.phone} onChange={this.phonehandleChange} placeholder="your phone number" required/>
                        </Col>
                      </Form.Group>
        
                      <Col xs="12" className="text-right" style={{marginBottom: 30}}>
                        <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                          Save
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

export default Profile;