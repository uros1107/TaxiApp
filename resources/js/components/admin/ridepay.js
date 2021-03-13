import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from '../Spinner/normal';
import { Link } from 'react-router-dom';

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

const title = {
  fontSize: 18,
  fontWeight: 600
}

const detail = {
  fontSize: 14,
  fontWeight: 400,
  marginBottom: 20
}

var order_id = '';

export class RidePay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            departure: '',
            destination: '',
            number_people: '',
            price: '',
            order_time: '',
            message: '',
            status: '',
            formError: false,
            loading: false,
        };

      this.processpayment = this.processpayment.bind(this);

      const { location } = this.props;
      const previousPath = location.order_id;
      order_id = previousPath;
    }

    componentDidMount() {
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          order_id: order_id
        })
      };
      
      fetch("api/orderedit", requestOptions)
        .then(response => response.text())
        .then(result => {
          var order = JSON.parse(result)
          this.setState({
              error: false,
              isLoaded: true,
              price: order.price,
              departure: order.departure,
              destination: order.destination,
              number_people: order.number_people,
              order_time: order.order_time,
              message: order.message,
              status: order.status,
          })
        })
        .catch(error => {
          toastr.error(error.message)
          this.setState({
              isLoaded: false,
              error: false
          });
        });
    }
  
    processpayment() {
      this.setState({loading: true})
      var requestOptions = {
        method: 'POST',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
        body: JSON.stringify({
          order_id: order_id,
        })
      };
      
      fetch("/api/processpayment", requestOptions)
        .then(response => response.text())
        .then(result => {
            this.setState({loading: false})
            var status = JSON.parse(result)           
            if(status.success == 1) {
              toastr.success('Successfully paid!')
            } else if(status.success == 0) {
              toastr.error(status.error)
            } else if(status.success == 2) {
              toastr.error(status.error)
            } else if(status.success == 3) {
              toastr.error('First, please accept ride')
            } else if(status.success == 4 || status.success == 6) {
              toastr.error('This ride has been already paid')
            } else {
              toastr.error("This ride can't pay")
            }
            
        })
        .catch(error => {
          console.log(error)
          toastr.error('Server error')
        });
    }
    
    render() {
        if(this.state.loading) {
          return <Spinner />
        }
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
                <Link to="/ridemanage">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 0px", fontWeight: 600, textTransform: "capitalize"}}>Make Payment</h4>
                  </Col>
                </Row>
                <Row style={{marginTop:"15px"}}>
                  <Col lg={4} style={title}>
                    Departure :
                  </Col>
                  <Col lg={8} style={detail}>
                    {this.state.departure}
                  </Col>
                  <Col lg={4} style={title}>
                    Destination :
                  </Col>
                  <Col lg={8} style={detail}>
                    {this.state.destination}
                  </Col>
                  <Col lg={4} style={title}>
                    Price :
                  </Col>
                  <Col lg={8} style={detail}>
                    {'$' + this.state.price}
                  </Col>
                  <Col lg={4} style={title}>
                    Number People :
                  </Col>
                  <Col lg={8} style={detail}>
                    {this.state.number_people}
                  </Col>
                  <Col lg={4} style={title}>
                    Order time :
                  </Col>
                  <Col lg={8} style={detail}>
                    {this.state.order_time}
                  </Col>
                  <Col lg={4} style={title}>
                    Status :
                  </Col>
                  <Col lg={8} style={detail}>
                    {this.state.status == 0 && (
                      'Pending'
                    )}
                    {this.state.status == 1 && (
                      'Accepted'
                    )}
                    {this.state.status == 2 && (
                      'Canceled'
                    )}
                  </Col>
                  <Col xs="12" className="text-center">
                    <Button variant="primary" type="button" className="standardButton" onClick={this.processpayment} style={buttonStyle}>
                      Process Payment
                    </Button>
                  </Col>
                </Row>
              </Container>
            )
        }
    }
}

export default RidePay;