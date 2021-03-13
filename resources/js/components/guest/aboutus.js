import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
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
              <h3 className="about-title text-center" style={{margin: "70px 0px 30px", fontSize: 32, fontWeight: 700}}>
                About Us
              </h3>
              <img className="fullwidth" src="assets/images/guests/about-banner.png" style={{width: "100%", marginBottom: 20}} alt="about-banner"></img>

              <div className="text-wrap">

                <p className="about-para">Native Ghanaian Richard Afornorpe jaunted along the famous Portland International Airport carpet in 2002 to meet his future wife, Kristina, and her family.</p>
                <p className="about-para">They had met on a dating site while he still lived in Ghana. After flights to Switzerland, New York, Seattle and finally Portland, Afornorpe prepared to meet the person with whom he would spend the rest of his life</p>
                <p className="about-para green-text">“I was happy, excited,” Afornorpe said with a sheepish smile, “but it’s a very new environment.”</p>
                <p className="about-para">The Afornorpes have owned Downtown Coffee Shop for a little more than a year. Richard has been driving the Downtown Coffee Shop taxi — a white Cadillac Escalade — since last June. He has, for the most part, settled in with his wife and seven foster children — ages 7 to 22. But it took a while.</p>
              </div>
             
              <div className="container1">
                <h1 className="text-center" style={{fontSize: 25, margin: "40px 0px 12px"}}>Checkout our video</h1>
                <img src="assets/images/guests/arrow.png" className="arrow img-responsive" width="10%"/>
                <video className="about-video" width="100%" height="230px" controls>
                  <source src="assets/video/FINAL2.mov" type="video/mp4" />
                  <source src="assets/video/FINAL2.mov" type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="container1">
                  <div className="col-12" style={{padding: 0}}>
                    <img className="fleft"  src="assets/images/guests/about-left-img.png" alt="about-banner" width="100%" height="200px" frameBorder="0" marginWidth="0" marginHeight="0" scrolling="no"></img>
                  </div>

                  <div className="col-12" style={{background: "#5e976a", paddingTop: 25}}>
                    <h4 className="text-heading text-center">
                      Job search
                    </h4>
                    <p className="about-para">Following their airport meeting, the couple returned to Kristina’s hometown to settle into an Emerald Heights apartment. Afornorpe spent nearly two years searching for a job. In the meantime, many of his days were spent at home doing laundry.</p>
                    <p className="about-para">I wasn’t used to just sitting at one place and doing nothing,” Afornorpe said. “Sitting down can be depressing, especially since I didn’t know a lot of people here.”</p>

                    <p className="about-para">Afornorpe often would kill time with strolls around Tongue Point, but he still felt lonely. On most days back in Ghana, much of his free time involved him visiting neighbors’ homes, usually unannounced. He soon found, though, that Americans tend to focus much of their leisure hours on family and, after making concrete plans, close friends.</p>
                    <p className="about-para">You can become friendly with people, but you just have to be cautious,” Afornorpe said.</p>

                    <p className="about-para">Afornorpe eventually landed a job at Fred Meyer in early 2004. He also moved on to work at Necanicum Village Senior Living Community in Seaside and then Costco until last summer.</p>
                  </div>

                  <div className="col-12" style={{padding: 0}}>
                    <img className="fright" src="assets/images/guests/about-right-img.png" alt="about-banner" width="100%" height="300px" frameBorder="0" marginWidth="0" marginHeight="0" scrolling="no"></img>
                  </div>

                  <div className="col-12"  style={{background: "#838383", color: "white", paddingTop: 25}}>
                    <h4 className="text-heading text-center">
                      Waiting for a bus
                    </h4>
                    <p className="about-para">He was standing inside the coffee shop last May when he noticed a number of people waiting on the sidewalks along 10th Street between Marine Drive and Duane Street. They had come from a cruise ship docked at a nearby pier and were waiting for a bus to take them to the Astoria Column. </p>
                    <p className="about-para">Afornorpe said that when he approached a nearby business owner to see what they could do, the owner said, “Don’t mind them.”</p>

                    <p className="about-para">“I was speechless,” Afornorpe said. “I heard people saying, ‘This is a very bad experience.’ They then could go back to the ship and write a very bad review. It doesn’t mean all Astorians are like that.”</p>
                    <p className="about-para">A family of five entered the coffee shop that same day to grab some food and coffee while they waited. A man then asked if Afornorpe would be willing to give him and his family a ride to the Astoria Column. Sensing the cruisers were developing a sour taste from their experience in Astoria, Afornorpe obliged.</p>

                    <p className="about-para">Less than a month later, Afornorpe registered the Downtown Coffee Shop taxi, which he now drives full time. He gives rides to travelers throughout Clatsop County, Pacific County, Washington, and to the Portland area. The Cadillac includes the Downtown Coffee Shop logo on its side and a disco ball on the inside for nighttime use.</p>

                    <p className="about-para">“I just wanted to do something different,” he said.</p>

                    <p className="about-para">Afornorpe said fake orders hampered his taxi-driving business in the beginning. He would receive prank calls and online orders in more distant parts of the county where customers wouldn’t show up. To curb those issues, customers ordering from locations 20 miles away or more from Astoria must pay in advance with a credit card.</p>

                    <p className="about-para">
                    Now that he’s settled in, Afornorpe will continue to build his businesses until he can hire drivers to log miles on the road for him. Locals have come to know his story and have been supportive, Afornorpe said.</p>

                  </div>

              </div>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default Register;