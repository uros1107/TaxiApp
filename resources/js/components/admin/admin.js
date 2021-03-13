import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CarIcon from '@material-ui/icons/LocalTaxi';
import NotificationIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import LogoutIcon from '@material-ui/icons/MeetingRoom';
import SettingsIcon from '@material-ui/icons/Settings';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import HistoryIcon from '@material-ui/icons/History';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';

import { Link } from 'react-router-dom';

const itemStyle = {
  display: 'contents',
  color: 'black'
}

export class Admin extends Component {
  render() {
    return (
      <List>
        <ListItem button key='custommanagement'>
          <Link to='/custommanage' style={itemStyle}>
            <ListItemIcon><EmojiPeopleIcon /></ListItemIcon>
            <ListItemText primary='Customer Manage' />
          </Link>
        </ListItem>

        <ListItem button key='drivermanagement'>
          <Link to='/drivermanage' style={itemStyle}>
            <ListItemIcon><AirlineSeatReclineNormalIcon /></ListItemIcon>
            <ListItemText primary='Driver Manage' />
          </Link>
        </ListItem>

        {/* <ListItem button key='withdrawalmanagement'>
          <Link to='/withdrawalmanage' style={itemStyle}>
            <ListItemIcon><CarIcon /></ListItemIcon>
            <ListItemText primary='Withdrawal Manage' />
          </Link>
        </ListItem> */}

        <ListItem button key='ridemanagement'>
          <Link to='/ridemanage' style={itemStyle}>
            <ListItemIcon><CarIcon /></ListItemIcon>
            <ListItemText primary='Ride Manage' />
          </Link>
        </ListItem>

        <ListItem button key='income'>
          <Link to='/income' style={itemStyle}>
            <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
            <ListItemText primary='Income' />
          </Link>
        </ListItem>

        <ListItem button key='AdminNotification'>
          <Link to="/adminNotification" style={itemStyle}>
            <ListItemIcon><NotificationIcon /></ListItemIcon>
            <ListItemText primary='Notification' />
          </Link>
        </ListItem>

        <ListItem button key='profile'>
          <Link to='/profile' style={itemStyle}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary='Profile' />
          </Link>
        </ListItem>

        <ListItem button key='setting'>
          <Link to='/setting' style={itemStyle}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary='Setting' />
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

export default Admin;
