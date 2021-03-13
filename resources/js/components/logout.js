import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import toastr from 'toastr';

export default function logout() { 
  var requestOptions = {
    method: 'POST',  
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
  };
  
  fetch("/api/logout", requestOptions)
    .then(response => response.text())
    .then(result => {
      let appState = {
        isLoggedIn: false,
        user: {}
      };
      localStorage["appState"] = JSON.stringify(appState);
      localStorage.clear()
      location.reload()
    })
    .catch(error => {
      toastr.error('Failed')
      console.log('error', error)
    });

  // $.ajax({
  //     method: "POST",
  //     url: "api/setonline",
  //     data: {
  //       set_online: false
  //     },
  //     success: function(result){
  //         console.log('success')
  //     },
  //     error: function(error) {
  //       console.log(error)
  //     }
  // });

  return <Redirect to='/' />
}
