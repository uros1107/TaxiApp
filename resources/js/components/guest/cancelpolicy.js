import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from '../Spinner/normal';
import '../../style.css'

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
      cancel_fee: '',
      isLoaded: false,
    };
}

  componentDidMount() {
    var requestOptions = {
        method: 'GET',  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
        },
      };
      
      fetch("/api/getsettings", requestOptions)
        .then(response => response.text())
        .then(result => {
            this.setState({
                cancel_fee: JSON.parse(result)[0].cancel_fee,
                isLoaded: true
            })
        })
        .catch(error => {
            console.log(error)
            toastr.error('Failed!')
        });
  }

  render() {
      if(!this.state.isLoaded) {
        return <Spinner />
      } else{
        return (
          <Container>
            <Link to="/">
                <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <Row>
              <Col>
                <div className="text-center" style={{margin: "70px 0px 20px"}}>
                  <h1>Cancellation Policy</h1>
                </div>
  
                <div>
                  <div><strong>CANCELLATION POLICY</strong><br/>
                    <ul>
                      <li> To cancel your ride please call Downtown Taxi LLC at 503-791-6728 or email us at <a href="mailto:info@mydcstaxi.com" target="_blank">info@mydcstaxi.com</a>.</li>
                      <li> Refunds will be issued for cancled rides.</li>
                    </ul>
                    <strong>REFUND POLICY:</strong><br/>
                    <ul>
                      <li>Refunds will be issued within 21 days.  The refund ammount will be made to the account that made the original payment.</li>
                    </ul>
                    <strong>CANCEL FEE:</strong><br/>
                    <ul>
                      <li>Customers will be charged a Cancellation fee of ${this.state.cancel_fee} after 10 minute window and the ride is completed, your cancellation fee will be refunded to your original payment method. Refunds may take up to 21 business days to process depending on your bank.</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        );
      }
    }
}

export default Register;