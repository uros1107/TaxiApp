import React, { Component } from 'react';
import { Button,Container, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';

import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { bind } from 'file-loader';

const buttonStyle = {
    width: "100%", 
    // background:"#877ef2"
    // background:"#ff2462", 
    // borderRadius: "50px", 
    // borderColor: "#ff2462",
    // boxShadow: "#ec4272 0px 6px 23px -3px",
};

// var stripe = useStripe();
var i = 0;

export class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: '',
      rating: 0,
      review: '',
      spinner: false,
      booking_id: this.props.booking_id
    };

    this.tiphandleChange = this.tiphandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  tiphandleChange(event) {
    this.setState({tip: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({spinner: true});

    $.ajax({
        type: "POST",
        url: "api/stripepayment",
        // headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        method:"POST",
        data: {
          tip: this.state.tip,
          booking_id: this.state.booking_id,
          rating: this.state.rating,
          review: this.state.review
        },
        success: function(result){
            this.setState({spinner: false});
            // var status = JSON.parse(result.success)
            if (result.success == 1) {
                toastr.success('Success operation')
                location.reload()
            } else if(result.success == 0) {
                toastr.error(result.error)
            } else {
                toastr.error(result.error)
            }
        }.bind(this),
        error: function (error) {
            this.setState({spinner: false});
            toastr.error(error.message)
        }.bind(this)
    });
  }

  render() {
    if(!localStorage["appState"]) {
      return <Redirect to="/" />
    }
    if(this.state.isLoggedIn) {
      return <Redirect to='/'/>
    }

    if(this.state.spinner) {
      return <Spinner />
    }

    return (
      <Container>
            <Form onSubmit={this.handleSubmit}>
                <Box component="fieldset" mb={3} borderColor="transparent" style={{marginBottom: 10}}>
                    <Typography component="legend">Review</Typography>
                    <Rating
                        name="simple-controlled"
                        value={this.state.value}
                        onChange={(event, newValue) => {
                            this.setState({rating: newValue});
                        }}
                    />
                </Box>

                <TextField
                    id="outlined-multiline-static"
                    label="Message"
                    multiline
                    rows={3}
                    placeholder="Leave a message"
                    variant="outlined"
                    value={this.state.value}
                    onChange={(event) => this.setState({review: event.target.value})}
                    style={{width: "100%", marginBottom: "16px"}}
                    required
                />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Would like to add a tip?</Form.Label>
                    <Form.Control type="text" placeholder="Amount" value={this.state.tip}  onChange={this.tiphandleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="standardButton" style={buttonStyle}>
                    Pay Now
                </Button>
            </Form>
      </Container>
    );
  }
}

export default CheckoutForm;