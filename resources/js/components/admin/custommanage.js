import React, {useEffect} from 'react';
import { Link,Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import toastr from 'toastr';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Container } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
    fontWeight: "bold"
  },
}));

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "#b5b5b5"
  }

const addStyle = {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 900,
    color: "#0981fd"
  }

export default function Customer() {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [customid, setCustomId] = React.useState('');
  const [customhistory, setCustomHistory] = React.useState(false);
  const [customedit, setCustomEdit] = React.useState(false);
  const [addcustomer, setAddCustom] = React.useState(false);

  useEffect(() => {

    var requestOptions = {
      method: 'GET',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
      },
    };
    
    fetch("/api/getallpassenger", requestOptions)
      .then(response => response.text())
      .then(result => {
        setIsLoaded(true)
        setCustomers(JSON.parse(result))
      })
      .catch(error => console.log('error', error));
  
  }, []);

  const customdelete = (custom_id) => {
    $.ajax({
        method: "POST",
        url: "api/customdelete",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        data: {
          custom_id: custom_id
        },
        success: function(result){
            toastr.success('Successfully removed!')
            location.reload()
        },
        error: function(error) {
          console.log(error)
          toastr.error('Failed!')
        }
    });
  };

  const customhistoryhandle = (custom_id) => {
    setCustomId(custom_id)
    setCustomHistory(true)
  };

  const customedithandle = (custom_id) => {
    setCustomId(custom_id)
    setCustomEdit(true)
  };

  const addCustom = () => {
    setAddCustom(true)
  };

  if(customhistory) {
    return <Redirect to={{pathname: '/customhistory', custom_id: customid}} />
  }

  if(customedit) {
    return <Redirect to={{pathname: '/customedit', custom_id: customid}} />
  }

  if(addcustomer) {
    return <Redirect to='/addcustom' />
  }

  if(!localStorage["appState"]) {
    return <Redirect to="/" />
  }

  if (!isLoaded) {
      return <div>Loading...</div>
  } else{
      return (
        <div className={classes.root}>
            <Link to="/">
                  <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <PersonAddIcon style={addStyle} onClick={() => addCustom()}/>
            {/* <Container> */}
              <Grid item xs={12} md={6} className="text-center">
                <Typography variant="h4" className={classes.title} style={{margin:"70px 0px 20px"}}>
                  Customer Management
                </Typography>
                <div className={classes.demo}>
                  <List dense={dense}>
                  {customers.map((customer, index) => ( 
                      <ListItem key={index} style={{background: index % 2 == 1?'':'#efefef', borderBottom: '1px solid #dddddd'}}>
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={customer.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + customer.photo} className={classes.small} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={customer.name}
                          secondary={customer.phone}
                        />
                        {/* <p>{customer.name}</p> */}
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit" onClick={() => customhistoryhandle(customer.id)}>
                            <DirectionsCarIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="edit" onClick={() => customedithandle(customer.id)}>
                            <EditIcon />
                          </IconButton>
                          {/* <IconButton edge="end" aria-label="delete" onClick={() => customdelete(customer.id)}>
                            <DeleteIcon />
                          </IconButton> */}
                        </ListItemSecondaryAction>
                      </ListItem>
                  ))}
                  </List>
                </div>
              </Grid>
            {/* </Container> */}
        </div>
      );
  }
}