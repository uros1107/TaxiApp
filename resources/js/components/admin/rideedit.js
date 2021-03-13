import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import Spinner from '../Spinner/normal';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
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

var order_id = '';

export class CustomEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            price: '',
            order_time: '',
            message: '',
            status: '',
            formError: false,
            loading: false
        };

      this.pricehandleChange = this.pricehandleChange.bind(this);
      this.orderTimehandleChange = this.orderTimehandleChange.bind(this);
      this.messagehandleChange = this.messagehandleChange.bind(this);
      this.statushandleChange = this.statushandleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

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
  
    pricehandleChange(event) {
      this.setState({price: event.target.value});
    }
  
    orderTimehandleChange(event) {
      this.setState({order_time: event.target.value});
    }
  
    messagehandleChange(event) {
      this.setState({message: event.target.value});
    }
  
    statushandleChange(event) {
      this.setState({status: event.target.value});
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
          id: order_id,
          price: this.state.price,
          order_time: this.state.order_time,
          message: this.state.message,
          status: this.state.status
        })
      };
      
      fetch("/api/orderupdate", requestOptions)
        .then(response => response.text())
        .then(result => {           
            this.setState({loading: false})
            if(result == 1) {
              toastr.success('Successfully updated!')
            } else {
              toastr.error('Failed!')
            }
            
        })
        .catch(error => toastr.error('Failed!'));
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
                <Link to="/ridemanage">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 0px", fontWeight: 600, textTransform: "capitalize"}}>Order Update</h4>
                  </Col>
                </Row>
                <Row style={{marginTop:"15px"}}>
                  <Col lg={12}>
                    <Form style={{margin:"0px 10px"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
                      <Form.Group as={Row} controlId="price" style={{margin: "30px 0px"}}>
                        <Form.Label>
                          Price
                        </Form.Label>
                          <Form.Control type="text" value={this.state.price} onChange={this.pricehandleChange} placeholder="price"/>
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="ordertime" style={{margin: "30px 0px"}}>
                        <Form.Label>
                          Order Time
                        </Form.Label>
                          <Form.Control type="text" value={this.state.order_time} onChange={this.orderTimehandleChange} placeholder="order time"/>
                       
                      </Form.Group>
        
                      <Form.Group as={Row} controlId="password" style={{margin: "30px 0px"}}>
                        <Form.Label>
                          Message
                        </Form.Label>
                          <Form.Control type="text" value={this.state.message} onChange={this.messagehandleChange} placeholder="message"/>
                      </Form.Group>

                      <Form.Group as={Row} controlId="status" style={{margin: "30px 0px"}}>
                        <Form.Label>
                          Status
                        </Form.Label>
                          <Form.Control as="select" value={this.state.status} onChange={this.statushandleChange}>
                            <option value="0">Pending</option>
                            <option value="1">Accept</option>
                            {/* <option value="3">Complete</option> */}
                            <option value="2">Cancel</option>
                          </Form.Control>
                      </Form.Group>
        
                      <Col xs="12" className="text-center">
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

export default CustomEdit;