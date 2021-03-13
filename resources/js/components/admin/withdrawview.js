import React, { Component } from 'react';
import { Button,Container, Row, Col, Form, Image } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link, Redirect } from 'react-router-dom';
import toastr from 'toastr';


const buttonStyle = {
  width: "100%", 
  // background:"#877ef2", 
  // borderRadius: "50px", 
  // borderColor: "#877ef2",
  // boxShadow: "rgb(135 126 242) 0px 6px 23px -3px",
  margin: "15px 0px"
};

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

var withdraw_id = '';

export class DriverView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            withdraw: [],
            withdrawmanage: false
        };

      this.withdrawApproved = this.withdrawApproved.bind(this);
      this.withdrawDeclined = this.withdrawDeclined.bind(this);

      const { location } = this.props;
      const previousPath = location.withdraw_id;
      withdraw_id = previousPath;
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
          withdraw_id: withdraw_id
        })
      };
      
      fetch("api/withdrawview", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.setState({
              error: false,
              isLoaded: true,
              withdraw: JSON.parse(result)
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

    withdrawApproved(withdraw_id) {
        var requestOptions = {
          method: 'POST',  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
          },
          body: JSON.stringify({
            withdraw_id: withdraw_id
          })
        };
        
        fetch("api/withdrawapproved", requestOptions)
          .then(response => response.text())
          .then(result => {
              toastr.success('Successfully updated!')
              this.setState({withdrawmanage: true})
          })
          .catch(error => {
              console.log(error)
              toastr.error('Failed!')
          });
    }

    withdrawDeclined(withdraw_id) {
        var requestOptions = {
          method: 'POST',  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
          },
          body: JSON.stringify({
            withdraw_id: withdraw_id
          })
        };
        
        fetch("api/withdrawdeclined", requestOptions)
          .then(response => response.text())
          .then(result => {
              toastr.success('Successfully updated!')
              this.setState({withdrawmanage: true})
          })
          .catch(error => {
              console.log(error)
              toastr.error('Failed!')
          });
    }
    
    render() {
        if(!localStorage["appState"]) {
          return <Redirect to="/" />
        }
        if (this.withdrawmanage) {
          return <Redirect to="/withdrawalmanage" />;
        }
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
          return <CircularProgress color="secondary" />;
        } else {
            return (
              <Container>
                <Link to="/withdrawalmanage">
                    <ArrowBackIosIcon style={backStyle}/>
                </Link>
                <Row>
                  <Col xs ={12} className="text-center">
                    <h4 style={{margin: "50px 0px 20px", fontWeight: 600, textTransform: "capitalize"}}>{this.state.withdraw.name}</h4>
                  </Col>
                </Row>
                <Row style={{padding: "10px 40px"}}>
                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <Row>
                      <Col xs={2} className="text-center">
                        <i className='fa fa-user' style={{color:'#000', fontSize: 16}}></i>
                      </Col>
                      <Col xs={10}>
                        {this.state.withdraw.name}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <Row>
                      <Col xs={2} className="text-center">
                        <i className='fa fa-credit-card-alt' style={{color:'#000', fontSize: 12}}></i>
                      </Col>
                      <Col xs={10}>
                        {this.state.withdraw.card_number}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <Row>
                      <Col xs={2} className="text-center">
                        <i className='fa fa-calendar' style={{color:'#000', fontSize: 14}}></i>
                      </Col>
                      <Col xs={10}>
                        {this.state.withdraw.exp_month + '/' + this.state.withdraw.exp_year}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <Row>
                      <Col xs={2} className="text-center">
                        <i className='fa fa-dollar' style={{color:'#000', fontSize: 16}}></i>
                      </Col>
                      <Col xs={10}>
                        {'$' + this.state.withdraw.amount}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="text-left" style={{margin: "5px 0px"}}>
                    <Row>
                      <Col xs={2} className="text-center">
                        <i className='fa fa-clock-o' style={{color:'#000', fontSize: 16}}></i>
                      </Col>
                      <Col xs={10}>
                        {moment(this.state.withdraw.created_at).fromNow()}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={6}>
                      <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.withdrawApproved(this.state.withdraw.id)}>
                          Approved
                      </Button>
                  </Col>
                  <Col xs={6}>
                      <Button variant="primary" type="button" className="standardButton" style={buttonStyle} onClick={() => this.withdrawDeclined(this.state.withdraw.id)}>
                          Declined
                      </Button>
                  </Col>
                </Row>
              </Container>
            )
        }
    }
}

export default DriverView;