import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CarIcon from '@material-ui/icons/LocalTaxi';
import NotificationIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import LogoutIcon from '@material-ui/icons/MeetingRoom';
import HistoryIcon from '@material-ui/icons/History';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import { Link } from 'react-router-dom';

const itemStyle = {
  display: 'contents',
  color: 'black'
}

export class Passenger extends Component {
  render() {
    return (
      <List>
        <ListItem button key='Home'>
          <Link to="/" style={itemStyle}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='Home' />
          </Link>
        </ListItem>

        <ListItem button key='MyBooking'>
          <Link to='/mybooking' style={itemStyle}>
            <ListItemIcon><CarIcon /></ListItemIcon>
            <ListItemText primary='My Booking' />
          </Link>
        </ListItem>

        <ListItem button key='Notification'>
          <Link to="/passengerNotification" style={itemStyle}>
            <ListItemIcon><NotificationIcon /></ListItemIcon>
            <ListItemText primary='Notification' />
          </Link>
        </ListItem>

        <ListItem button key='Profile'>
          <Link to="/profile" style={itemStyle}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary='Profile' />
          </Link>
        </ListItem>

        <ListItem button key='RideHistory'>
          <Link to="/ridehistory" style={itemStyle}>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary='Ride History' />
          </Link>
        </ListItem>

        <ListItem button key='todriver'>
          <Link to="/todriver" style={itemStyle}>
            <ListItemIcon><RadioButtonCheckedIcon /></ListItemIcon>
            <ListItemText primary='To Driver' />
          </Link>
        </ListItem>

        <ListItem key='Logout'>
          <Link to="/logout" style={itemStyle}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary='Logout' />
          </Link>
        </ListItem>
      </List>
    );
  }
}

export default Passenger;
