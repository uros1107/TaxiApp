import React from "react";
import ReactDOM from "react-dom";
import MyRoute from './route'

ReactDOM.render(<MyRoute />, document.getElementById("root"));

var latitude = '';
var longitude = '';

// update driver's location
if (localStorage["appState"] && JSON.parse(localStorage["appState"]).user.role == 1) {
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log('lat=' + latitude)
      console.log('lng=' + longitude)
    }, errorHandler);

    if(latitude != '' || longitude != '') {
      $.ajax({
          type: "POST",
          url: "api/updatelocation",
          method:"POST",
          headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
          data: {
            latitude: latitude,
            longitude: longitude,
          },
          success: function(result){
              if(result.success == true) {
                console.log('update success')
              } else {
                console.log("update failed")
              }
          }
      });
    }
  }, 10000);
}

function errorHandler(err) {
  alert(err.message);
}
