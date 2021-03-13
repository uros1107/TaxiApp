import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CarIcon from '@material-ui/icons/LocalTaxi';
import VehicleIcon from '@material-ui/icons/DriveEta';
import NotificationIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import LogoutIcon from '@material-ui/icons/MeetingRoom';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import GradeIcon from '@material-ui/icons/Grade';

import { Link } from 'react-router-dom';

const itemStyle = {
  display: 'contents',
  color: 'black'
}

export class Driver extends Component {
  render() {
    return (
      <List>
        <ListItem button key='Home'>
          <Link to="/" style={itemStyle}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='Home' />
          </Link>
        </ListItem>

        <ListItem button key='Earnings'>
          <Link to='/earning' style={itemStyle}>
            <ListItemIcon><MoneyIcon /></ListItemIcon>
            <ListItemText primary='Earnings' />
          </Link>
        </ListItem>

        <ListItem button key='DriverNotification'>
          <Link to="/driverNotification" style={itemStyle}>
            <ListItemIcon><NotificationIcon /></ListItemIcon>
            <ListItemText primary='Notification' />
          </Link>
        </ListItem>

        <ListItem button key='vehicle'>
          <Link to="/vehicle" style={itemStyle}>
            <ListItemIcon><VehicleIcon /></ListItemIcon>
            <ListItemText primary='My Vehicle' />
          </Link>
        </ListItem>

        <ListItem button key='DriverReview'>
          <Link to="/rating" style={itemStyle}>
            <ListItemIcon><GradeIcon /></ListItemIcon>
            <ListItemText primary='Review' />
          </Link>
        </ListItem>

        <ListItem button key='DriverProfile'>
          <Link to="/profile" style={itemStyle}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary='Profile' />
          </Link>
        </ListItem>

        <ListItem button key='PickupRequest'>
          <Link to="/mypickup" style={itemStyle}>
            <ListItemIcon><CarIcon /></ListItemIcon>
            <ListItemText primary='Pickup Request' />
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

export default Driver;
