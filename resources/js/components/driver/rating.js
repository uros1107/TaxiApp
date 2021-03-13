import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Container, Row, Col } from 'react-bootstrap';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link,Redirect } from 'react-router-dom';

import Rating from '@material-ui/lab/Rating';

const backStyle = {
  position: "absolute",
  top: 15,
  left: 20,
  zIndex: 900,
  color: "b5b5b5"
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 23px -6px',
  },
  inline: {
    display: 'inline',
  },
}));

export default function AlignItemsList() {
  const classes = useStyles();

  const [ratings, setRatings] = useState([]);
  const [isLoaded, setIsLoad] = useState(false);

  useEffect(() => {

    var requestOptions = {
      method: 'GET',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
      },
    };
    
    fetch("/api/getrating", requestOptions)
      .then(response => response.text())
      .then(result => {
        setIsLoad(true)
        setRatings(JSON.parse(result))
      })
      .catch(error => console.log('error', error));
  
  }, []);

    if(!localStorage["appState"]) {
      return <Redirect to="/" />
    }

    if(!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Container>
          <Link to="/">
              <ArrowBackIosIcon style={backStyle}/>
          </Link>
          <Row>
              <Col xs={12} className="text-center">
                  <h4 style={{marginTop:"50px", fontSize: 20, marginBottom:20}}>Ratings</h4>
              </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center">
              {ratings == '' && (
                <h5 style={{marginTop:"40px", fontSize: 15}}>No ratings</h5>
              )}
              <List className={classes.root}>
              {ratings.map((rating, index) => ( 
                <ListItem key={index} alignItems="flex-start" style={{background: index % 2 == 0?'':'#f5f5f5', borderBottom: '1px solid #dddddd'}}>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={rating.photo == '' || rating.photo == null? "assets/images/users/default.png":"assets/images/users/a" + rating.photo} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={rating.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          <Rating name="size-small" defaultValue={rating.rating} size="small" readOnly />
                        </Typography>
                        {" - " + rating.review}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
              </List>
            </Col>
          </Row>
        </Container>
      )
    }
}