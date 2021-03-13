import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { db } from "../../firebase";
import { auth } from "../../firebase";

const inputStyle = {
    position: "absolute",
    background: "white",
    bottom: "0px",
    width: "100%",
    padding: "5px 15px"
}

const avatarStyle = {
    fontSize: 20, 
    padding: 13,
    textAlign: "center",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 23px -6px"
}

const menuStyle = {
    width:"32px", 
    boxShadow: "rgba(0, 0, 0, 0.398438) 0px 2px 4px",
    position: "absolute",
    top: 20,
    right: 20
  };

const backStyle = {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 900,
    color: "b5b5b5"
  }

const toUserStyle = {
    margin: "0px 15px", 
    display: "inline", 
    color: "#8c8c8c"
}

export default function Chat() {
    const [state, setState] = React.useState({
        left: false,
    });

    const [user, setUser] =  useState(JSON.parse(localStorage['appState']).user);
    const [touser, setToUser] =  useState('');
    const [chats, setChats] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [content, setContent] = useState('');
    const [readError, setReadError] = useState(null);
    const [writeError, setWriteError] = useState(null);
    const [loadingChats, setLoadingChats] = useState(true);
    
    const myref = React.useRef()

    const scrollToRef = (ref) => window.scrollTo(0, ref)   

    useEffect(() => {
        const chatArea = myref.current;
        $.ajax({
            url: "api/getdrivers",
            method:"GET",
            // headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
                setDrivers(result.drivers)
                if (result.drivers != '') {
                    setToUser(result.drivers[0])
                }
            }
        });

        setLoadingChats(true);
        setReadError(null);

        try {
            db.ref("chats").on("value", snapshot => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                chats.sort(function (a, b) { return a.timestamp - b.timestamp })
                setChats(chats);

                chatArea.scrollTop = chatArea.scrollHeight;
                setLoadingChats(false);
            });
        } catch (error) {
            setReadError(error.message)
            setLoadingChats(false)
        }
    }, []);

    const driver_communication = (driver_id) => {
        $.ajax({
            url: "api/getdriver",
            data: {driver_id : driver_id},
            method:"GET",
            // headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
            success: function(result){
                setToUser(result)
            }
        });
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
        }

        setState({ state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
        style={{width: 250}}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
        >
        <List style={{paddingTop: 0}}>
            <ListItem style={{padding: 20, background: "#f3f3f3"}}>
                <ListItemIcon>
                    <Avatar alt="Remy Sharp" src={user.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + user.photo}/>
                </ListItemIcon>
                <ListItemText primary={user.name} />
            </ListItem>
            <Divider></Divider>
            {drivers != '' && drivers.map((driver, index) => (
            <ListItem button key={index}>
                <Button onClick={() => driver_communication(driver.id)}>
                    <ListItemIcon>
                        <Avatar alt="Remy Sharp" src={driver.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + driver.photo}/>
                    </ListItemIcon>
                    <ListItemText primary={driver.name} />
                </Button>
            </ListItem>
            ))}
        </List>
        </div>
    );

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setWriteError(null)
        const chatArea = myref.current;
        try {
            if(content != '') {
                db.ref("chats").push({
                    content: content,
                    timestamp: Date.now(),
                    uid: user.id,
                    toid: touser.id                 
                });
                setContent('');
                setTimeout(()=>{
                    chatArea.scrollTop = chatArea.scrollHeight;
                }, 50)                
            }
        } catch (error) {
            console.log(error.message)
            setWriteError(error.message);
        }
    }

    const formatTime = (timestamp) => {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }

    return (
        <div>
            <Link to="/">
                <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <React.Fragment>
                <MenuIcon  onClick={toggleDrawer('left', true)} style={menuStyle}/>
                <Drawer anchor='left' open={state['left']} onClose={toggleDrawer('left', false)}>
                    {list('left')}
                </Drawer>
            </React.Fragment>
            <div style={avatarStyle}>
                <Avatar style={{display: "inline-table", width: 40, height: 40}} alt="Remy Sharp" src={touser.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + touser.photo}/>
                <p style={toUserStyle}>{touser.name}</p>
            </div>
            <div className="chat-area" ref={myref}>
            
                { loadingChats ? <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : ""}
                
                { chats.map(chat => {
                    if((chat.toid == user.id && chat.uid == touser.id) || (chat.uid == user.id && chat.toid == touser.id)) {
                        return <div style={{width: "100%", display: "flex"}} key={chat.timestamp}><p className={"chat-bubble " + (user.id === chat.uid ? "current-user" : "")}>
                            {chat.content}
                            <br />
                            <span className="chat-time float-right">{moment(chat.timestamp).fromNow()}</span>
                        </p></div>
                    }
                })}
            </div>
            <div>
                <form onSubmit={handleSubmit} style={inputStyle} className="message-box">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" name="content" onChange={handleChange} value={content} autoComplete="off" placeholder="Type your message"></input>
                        {readError ? <p className="text-danger">{readError}</p> : null}
                        <div className="input-group-append">
                            <button className="btn btn-success mt-0" type="submit">Send</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
