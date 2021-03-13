import React, { Component } from 'react';
import { Button,Container, Row, Col, Form } from 'react-bootstrap';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import 'react-phone-input-2/lib/style.css'
import '../../style.css'
import Spinner from '../Spinner/normal';

const buttonStyle = {
  width: "100%", 
  // background:"#877ef2"
  // background:"#ff2462", 
  // borderRadius: "50px", 
  // borderColor: "#ff2462",
  // boxShadow: "#ec4272 0px 6px 23px -3px",
  marginTop: 30
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      loading: false
    };

    this.namehandleChange = this.namehandleChange.bind(this);
    this.emailhandleChange = this.emailhandleChange.bind(this);
    this.messagehandleChange = this.messagehandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  namehandleChange(event) {
    this.setState({name: event.target.value});
  }

  emailhandleChange(event) {
    this.setState({email: event.target.value});
  }

  messagehandleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true})
    $.ajax({
        method: "POST",
        url: "api/contactus",
        // headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        data: {
            name: this.state.name,
            email: this.state.email,
            message: this.state.message
        },
        success: function(result){
          this.setState({loading: false})
            if (result.success == true) {
                toastr.success('Successfully sent your message!')
                location.reload()
            } else {
                toastr.error('Contact failed!')
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
      if(this.state.loading) {
        return <Spinner />
      }
      return (
        <Container>
          <Link to="/">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row>
            <Col xs={12} className="text-center">
              <p style={{marginTop: 50, fontSize: 32, fontWeight: 700}}>Contact Us</p>
              <p style={{fontSize: 18, marginBottom: 0}}>Get a hold of Downtown Taxi</p>
              <p>We try to respond within 24 hours of your request. Thank you for your patience.</p>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="name">
                  <Form.Label style={{fontSize: 18}}>Your Name</Form.Label>
                  <Form.Control type="text" value={this.state.name} onChange={this.namehandleChange} placeholder="Enter your name" required/>
              </Form.Group>

              <Form.Group controlId="email">
                  <Form.Label style={{fontSize: 18}}>Your Email</Form.Label>
                  <Form.Control type="email" value={this.state.email} onChange={this.emailhandleChange} placeholder="Enter your email address" required/>
              </Form.Group>

              <Form.Group controlId="message">
                  <Form.Label style={{fontSize: 18}}>Message</Form.Label>
                  <Form.Control as="textarea" rows="3" value={this.state.message} onChange={this.messagehandleChange} placeholder="Enter your message" required/>
              </Form.Group>

              <Button variant="primary" type="buttton" className="standardButton" style={buttonStyle}>
                  Send
              </Button>
          </Form>
        </Container>
      );
    }
}

export default Register;