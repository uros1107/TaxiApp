import React, {useEffect} from 'react';
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
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link,Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import toastr from 'toastr';

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
    textAlign: "center",
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

const moreStyle = {
    ':focus': {
        outline: "0px dotted", 
        outline: "0px auto -webkit-focus-ring-color"
    }
  };

export default function Withdraw() {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [withdrawals, setWithDrawals] = React.useState([]);
  const [withdrawview, setWithdrawView] = React.useState(false);
  const [withdrawview_id, setWithdrawviewId] = React.useState(false);

  const viewhandleClick = (withdraw_id) => {
    setWithdrawView(true)
    setWithdrawviewId(withdraw_id)
  };

  const deletehandleClick = (withdraw_id) => {
    $.ajax({
        method: "POST",
        url: "api/withdrawdelete",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        data: {
            withdraw_id: withdraw_id
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
  }

  useEffect(() => {
    var requestOptions = {
      method: 'GET',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
      },
    };
    
    fetch("/api/getallwithdrawal", requestOptions)
      .then(response => response.text())
      .then(result => {
        setIsLoaded(true)
        setWithDrawals(JSON.parse(result))
      })
      .catch(error => {
        console.log("driver manage")
        console.log('error', error)
      });
  }, []);

  if(!localStorage["appState"]) {
    return <Redirect to="/" />
  }

  if(withdrawview) {
      return <Redirect to={{pathname: '/withdrawview', withdraw_id: withdrawview_id}} />
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
        <div className={classes.root}>
            <Link to="/">
                    <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <Grid item xs={12} md={6}>
            <Typography variant="h4" className={classes.title} style={{margin:"70px 0px 20px"}}>
                Withdraw Management
            </Typography>
            <div className={classes.demo}>
                <List dense={dense} style={{padding: 0}}>
                {withdrawals.map((withdrawal, index) => ( 
                    <ListItem key={index} style={{background: index % 2 == 0?'':'#f5f5f5', borderBottom: '1px solid #dddddd'}}>
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={withdrawal.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + withdrawal.photo} className={classes.small} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={withdrawal.name}
                        secondary={"Requests withdrawal of $" + withdrawal.amount}
                    />
                    <ListItemSecondaryAction  style={moreStyle}>
                        <IconButton edge="end" aria-label="edit" onClick={() => viewhandleClick(withdrawal.id)}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="edit" onClick={() => deletehandleClick(withdrawal.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    </ListItem>
                ))}
                </List>
            </div>
            </Grid>
        </div>
    )
  }
}