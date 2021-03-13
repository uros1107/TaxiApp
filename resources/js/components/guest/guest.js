import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import LoginIcon from '@material-ui/icons/ExitToApp';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import InfoIcon from '@material-ui/icons/Info';
import EventNoteIcon from '@material-ui/icons/EventNote';
import PolicyIcon from '@material-ui/icons/Policy';
import GavelIcon from '@material-ui/icons/Gavel';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import { Link } from 'react-router-dom';

const itemStyle = {
  display: 'contents',
  color: 'black'
}

export class Guest extends Component {
  render() {
    return (
      <List>
        <ListItem button key='Home'>
          <Link to="/" style={itemStyle}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='Home' />
          </Link>
        </ListItem>
        <ListItem button key='contactus'>
          <Link to="/contactus" style={itemStyle}>
            <ListItemIcon><ContactSupportIcon /></ListItemIcon>
            <ListItemText primary='Contact Us' />
          </Link>
        </ListItem>
        <ListItem button key='aboutus'>
          <Link to="/aboutus" style={itemStyle}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary='About Us' />
          </Link>
        </ListItem>
        <ListItem button key='service'>
          <Link to="/service" style={itemStyle}>
            <ListItemIcon><ThumbUpIcon /></ListItemIcon>
            <ListItemText primary='Services' />
          </Link>
        </ListItem>
        <ListItem button key='terms'>
          <Link to="/terms" style={itemStyle}>
            <ListItemIcon><EventNoteIcon /></ListItemIcon>
            <ListItemText primary='Terms' />
          </Link>
        </ListItem>
        <ListItem button key='privacypolicy'>
          <Link to="/policy" style={itemStyle}>
            <ListItemIcon><PolicyIcon /></ListItemIcon>
            <ListItemText primary='Privacy Policy' />
          </Link>
        </ListItem>
        <ListItem button key='cancelpolicy'>
          <Link to="/cancelpolicy" style={itemStyle}>
            <ListItemIcon><GavelIcon /></ListItemIcon>
            <ListItemText primary='Cancellation Policy' />
          </Link>
        </ListItem>
        <ListItem button key='Login'>
          <Link to="/login" style={itemStyle}>
            <ListItemIcon><LoginIcon /></ListItemIcon>
            <ListItemText primary='Sign In' />
          </Link>
        </ListItem>
        <ListItem button key='register'>
          <Link to="/chooseregister" style={itemStyle}>
            <ListItemIcon><PersonAddIcon /></ListItemIcon>
            <ListItemText primary='Register' />
          </Link>
        </ListItem>
      </List>
    );
  }
}

export default Guest;
