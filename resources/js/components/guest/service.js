import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import '../../style.css'

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

export class Register extends Component {

  render() {
      return (
        <Container>
          <Link to="/">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row>
            <Col>
              <div className="text-center" style={{marginTop: 70}}>
                  <h1>Our Services</h1>
              </div>

              <div style={{margin: "30px 0px"}}>
                  <h2 id="">Services Offered</h2>
                      <ul>
                          <li>The Cleanest Vehicles</li>
                          <li>Largest Fleet of Cars of all sizes</li>
                          <li>Easy to Make Reservations</li>
                          <li>Complete-Service Transportation</li>
                          <li>Long Distance Services</li>
                      </ul>
                  <h2 id="">Use our Taxi for</h2>
                      <ul>
                          <li>Out on the town</li>
                          <li>Shopping at the Malls</li>
                          <li>Hospital Visits</li>
                          <li>Tours</li>
                          <li>Social Visits</li>
                      </ul>
              </div>

              <div className="text-center" style={{marginBottom: 30}}>
                  <h1>Our Vehicles</h1>
                  <div data-role="content" className="blog">        
                      <div className="item" style={{margin: "20px 0px"}}>   
                          <img className="fullwidth" style={{width: "100%"}} src="assets/images/guests/dts.jpg" alt="dts" />
                          {/* <h2 style={{margin: "15px 0px 30px"}}>Cadillac DTS</h2> */}
                      </div>
                      <div className="item" style={{margin: "20px 0px"}}>   
                          <img className="fullwidth" style={{width: "100%"}} src="assets/images/guests/escalade.jpg" alt="dts" />
                          {/* <h2 style={{margin: "15px 0px 30px"}}>Cadillac Escalade</h2> */}
                      </div>
                  </div>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default Register;