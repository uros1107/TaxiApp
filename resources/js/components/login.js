import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from './Spinner/normal';

const buttonStyle = {
  width: "100%", 
};

const fastyle = {
  padding: 10,
  fontSize: 16,
  width: "initial",
  textAlign: "center",
  textDecoration: "none",
  margin: "5px 2px",
  borderRadius: "50%",
  margin: "10px 5px 24px"
}

const fafacebookstyle = {
  fontSize: 16,
  width: "initial",
  textAlign: "center",
  textDecoration: "none",
  margin: "5px 2px",
  borderRadius: "50%",
  padding: "10px 13px", 
  margin: "10px 5px 24px"
}

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLogedIn: false,
      googleLoginUrl: null,
      facebookLoginUrl: null,
      twitterLoginUrl: null,
      youtubeLoginUrl: null,
      instagramLoginUrl: null,
      linkedinLoginUrl: null,
      loading: false,
      isLoaded: false
    };

    this.googlehandleChange = this.googlehandleChange.bind(this);
    this.facebookhandleChange = this.facebookhandleChange.bind(this);
    this.instagramhandleChange = this.instagramhandleChange.bind(this);
    this.twitterhandleChange = this.twitterhandleChange.bind(this);
    this.youtubehandleChange = this.youtubehandleChange.bind(this);
    this.linkedinhandleChange = this.linkedinhandleChange.bind(this);
    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.passwordhandleChange = this.passwordhandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/social/url', { headers: new Headers({ accept: 'application/json' }) })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            this.setState({isLoaded: true})
            toastr.error('Social url is not clear')
            throw new Error('Something went wrong!');
        })
        .then((data) => {
          this.setState({
            isLoaded: true, 
            googleLoginUrl: data['googleurl'],
            facebookLoginUrl: data['facebookurl'],
            instagramLoginUrl: data['instagramurl'],
            twitterLoginUrl: data['twitterurl'],
            youtubeLoginUrl: data['youtubeurl'],
            linkedinLoginUrl: data['linkedinurl'],
          })
        })
        .catch((error) => {
          console.error(error)
          this.setState({isLoaded: true})
        });
  }

  googlehandleChange(event) {
    localStorage['social'] = 0;
    location.href = this.state.googleLoginUrl 
  }

  facebookhandleChange(event) {
    localStorage['social'] = 1;
    location.href = this.state.facebookLoginUrl 
  }

  instagramhandleChange(event) {
    localStorage['social'] = 2;
    location.href = this.state.instagramLoginUrl 
  }

  twitterhandleChange(event) {
    localStorage['social'] = 3;
    location.href = this.state.twitterLoginUrl 
  }

  youtubehandleChange(event) {
    localStorage['social'] = 4;
    location.href = this.state.youtubeLoginUrl 
  }

  linkedinhandleChange(event) {
    localStorage['social'] = 5;
    location.href = this.state.linkedinLoginUrl 
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value})
  }

  passwordhandleChange(event) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loadig: true})
    var requestOptions = {
      method: 'POST',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    };
    
    fetch("/api/login", requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({loadig: false})
        var status = JSON.parse(result)
        if(status.success) {
          toastr.success('Successfully logged in!')
          this.setState({isLoggedIn: true})
          let userData = {
            id: status.user.id,
            name: status.user.name,
            email: status.user.email,
            role: status.user.role,
            photo: status.user.photo,
            online_checked: status.user.is_online,
            access_token: status.user.remember_token,
          };
          let appState = {
            isLoggedIn: true,
            user: userData
          };
          localStorage["appState"] = JSON.stringify(appState);
          location.reload()
        } else {
          toastr.error('Your credentials is incorrect!')
        }

      })
      .catch(error => console.log('error', error));
  }

  render() {
    if(this.state.isLoggedIn) {
      return <Redirect to='/'/>
    }
    if(this.state.loading) {
      return  <Spinner />
    }
    if(!this.state.isLoaded) {
      return <Spinner />
    } else {
      return (
        <Container>
          <Link to="/">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row style={{margin:"70px 0px 30px"}}>
            <Col lg={12} className="text-center">
              <Image src="assets/images/login.jpg" style={{ width: "80%", borderRadius: "50%" }}/>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center">
              <h4 style={{fontWeight:"bold"}}>Welcome to Log in</h4>
              <h6>Log in to your account</h6>
            </Col>
          </Row>
          <Row style={{marginTop:"20px"}}>
            <Col lg={12}>
              <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit}>
                <Form.Group as={Row} controlId="email">
                  <Form.Label column xs="4" sm="2">
                    Email
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} placeholder="your email" required/>
                  </Col>
                </Form.Group>
  
                <Form.Group as={Row} controlId="password">
                  <Form.Label column xs="4" sm="2">
                    Password
                  </Form.Label>
                  <Col xs="8" sm="10" style={{paddingLeft: 0}}>
                    <Form.Control type="password" value={this.state.password} onChange={this.passwordhandleChange} placeholder="your password" required/>
                  </Col>
                </Form.Group>
                
                <Col xs="12" className="text-right" style={{padding: 0, margin: "30px 0px 5px"}}>
                  <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Sign in
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="text-center"  style={{marginBottom: 10}}>
              <h6 style={{marginTop:"0.5rem", display: "inline-block"}}>Don't have an account?</h6> &nbsp;
              <Link to="/chooseregister">
                Sign Up
              </Link>
            </Col>
            <Col xs={12} className="text-center" style={{marginBottom: 10}}>
              <Link to="/forgotpassword" className="text-right">Forgot password?</Link>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center">
              <a onClick={this.googlehandleChange} className="fa fa-google" style={fastyle}></a>
              <a onClick={this.facebookhandleChange} className="fa fa-facebook" style={fafacebookstyle}></a>
              <a onClick={this.twitterhandleChange} className="fa fa-twitter" style={fastyle}></a>
              <a onClick={this.youtubehandleChange} className="fa fa-youtube" style={fastyle}></a>
              <a onClick={this.instagramhandleChange} className="fa fa-instagram" style={fastyle}></a>
              {/* <a onClick={this.linkedinhandleChange} className="fa fa-linkedin" style={{margin: "10px 5px 24px"}}></a> */}
            </Col>
          </Row>
        </Container>
      ); 
    }
  }
}

export default Login;