import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import { Link, Router, Route, BrowserRouter,Redirect } from 'react-router-dom';
import toastr from 'toastr';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TextField from '@material-ui/core/TextField';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Spinner from '../Spinner/normal';

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

const addStyle = {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 900,
    color: "#0981fd"
  }

export class NotificationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            value: '0',
            loading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        event.preventDefault();
        this.setState({loading: true})
        $.ajax({
            method: "POST",
            url: "api/sendnotification",
            headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            data: {
                message: this.state.message,
                who: this.state.value
            },
            success: function(result){
              this.setState({loading: false})
              if(result.status == true) {
                toastr.success('Successfully sent!')
              } else {
                toastr.error(result.status)
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
        return (
            <Container>
                <Link to="/adminNotification">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                    <Col xs={12} className="text-center">
                        <h4 style={{marginTop:"50px", marginBottom:"20px", fontSize: 20}}>Send Notification</h4>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Message"
                        multiline
                        rows={4}
                        placeholder="Enter your notification"
                        variant="outlined"
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.target.value})}
                        style={{width: "100%", marginBottom: "16px"}}
                        required
                    />
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" value={this.state.value} onChange={(event) => this.setState({value: event.target.value})}>
                            <FormControlLabel value="0" control={<Radio />} label="To All Customers" />
                            <FormControlLabel value="1" control={<Radio />} label="To All Drivers" />
                            <FormControlLabel value="2" control={<Radio />} label="To All" />
                        </RadioGroup>
                    </FormControl>
                    <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                        Send Notification
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default NotificationDetail;