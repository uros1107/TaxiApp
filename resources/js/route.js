import React, {Component} from "react";
// import { Route, Switch, BrowserRouter} from "react-router-dom";
import { BrowserRouter as Router, Route} from 'react-router-dom'


// Guest
import Register from "./components/register";
import ChooseRegister from "./components/chooseregister";
import Login from "./components/login";
import PhoneVerify from "./components/phoneverify";
import CardInput from "./components/cardInput";
import CarInformation from "./components/carinformation";
import ForgotPassword from "./components/forgotpassword";
import Terms from "./components/guest/terms";
import Policy from "./components/guest/policy";
import CancelPolicy from "./components/guest/cancelpolicy";
import ContactUs from "./components/guest/contactus";
import AboutUs from "./components/guest/aboutus";
import Service from "./components/guest/service";
import Home from "./components/home";
import PhoneNumberInput from "./components/phonenumberinput";

//chat
import PassengerChat from "./components/chat/passengerchat";
import DriverChat from "./components/chat/driverchat";
// import AdminChat from "./components/adminchat";

// Passenger
import Booking from "./components/passenger/booking";
import MyBooking from "./components/passenger/mybooking";
import DriverSearch from "./components/passenger/driversearch";
import Profile from "./components/passenger/profile";
import ToDriver from "./components/passenger/todriver";
import PassengerNotification from "./components/passenger/notification";
import RideHistory from "./components/passenger/ridehistory";


// Driver
import Vehicle from "./components/driver/vehicle";
import Rating from "./components/driver/rating";
import DriverNotification from "./components/driver/notification";
import Earning from "./components/driver/earning";
import Withdrawal from "./components/driver/withdrawal";


// Admin
import DriverManage from "./components/admin/drivermanage";
import PassengerManage from "./components/admin/custommanage";
import WithdrawalManage from "./components/admin/withdrawalmanage";
import WithdrawView from "./components/admin/withdrawview";
import RideManage from "./components/admin/ridemanage";
import RideEdit from "./components/admin/rideedit";
import RidePay from "./components/admin/ridepay";
import Income from "./components/admin/income";
import CustomEdit from "./components/admin/customedit";
import CustomHistory from "./components/admin/customhistory";
import AddCustom from "./components/admin/addcustom";
import AddDriver from "./components/admin/adddriver";
import DriverView from "./components/admin/driverview";
import DriverHistory from "./components/admin/driverhistory";
import DriverEdit from "./components/admin/driveredit";
import AdminNotification from "./components/admin/notification";
import AdminNotificationDetail from "./components/admin/notificationdetail";
import Setting from "./components/admin/setting";


import Logout from "./components/logout";

export class MyRoute extends Component {
  render() {
    return (
      <Router> 
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/chooseregister" component={ChooseRegister} />
          <Route path="/phoneverify" component={PhoneVerify} />
          <Route path="/carinformation" component={CarInformation} />
          <Route path="/google" component={PhoneNumberInput} />
          <Route path="/facebook" component={PhoneNumberInput} />
          <Route path="/instagram" component={PhoneNumberInput} />
          <Route path="/twitter" component={PhoneNumberInput} />
          <Route path="/youtube" component={PhoneNumberInput} />
          <Route path="/linkedin" component={PhoneNumberInput} />
          <Route path="/cardInput" component={CardInput} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/terms" component={Terms} />
          <Route path="/policy" component={Policy} />
          <Route path="/cancelpolicy" component={CancelPolicy} />
          <Route path="/contactus" component={ContactUs} />
          <Route path="/aboutus" component={AboutUs} />
          <Route path="/service" component={Service} />
          <Route path="/policy" component={Policy} />
          <Route path="/logout" component={Logout} />

          {/* chat route */}
          <Route path="/passengerchat" component={PassengerChat} />
          <Route path="/driverchat" component={DriverChat} />

          {/* for driver */}
          <Route path="/vehicle" component={Vehicle} />
          <Route path="/rating" component={Rating} />
          <Route path="/driverNotification" component={DriverNotification} />
          <Route path="/earning" component={Earning} />
          <Route path="/withdrawal" component={Withdrawal} />
          <Route path="/driverprofile" component={Profile} />
          <Route path="/mypickup" component={MyBooking} />

          {/* for passenger */}
          <Route path="/passengerNotification" component={PassengerNotification} />
          <Route path="/ridehistory" component={RideHistory} />
          <Route path="/todriver" component={ToDriver} />
          <Route path="/booking" component={Booking} />
          <Route path="/mybooking" component={MyBooking} />
          <Route path="/driversearch" component={DriverSearch} />
          <Route path="/profile" component={Profile} />

          {/* for admin */}
          <Route path="/drivermanage" component={DriverManage} />
          <Route path="/custommanage" component={PassengerManage} />
          <Route path="/ridemanage" component={RideManage} />
          <Route path="/rideedit" component={RideEdit} />
          <Route path="/ridepay" component={RidePay} />
          <Route path="/addcustom" component={AddCustom} />
          <Route path="/addDriver" component={AddDriver} />
          <Route path="/driverview" component={DriverView} />
          <Route path="/customedit" component={CustomEdit} />
          <Route path="/customhistory" component={CustomHistory} />
          <Route path="/driverhistory" component={DriverHistory} />
          <Route path="/driveredit" component={DriverEdit} />
          <Route path="/adminNotification" component={AdminNotification} />
          <Route path="/adminNotificationDetail" component={AdminNotificationDetail} />
          <Route path="/withdrawalmanage" component={WithdrawalManage} />
          <Route path="/withdrawview" component={WithdrawView} />
          <Route path="/income" component={Income} />
          <Route path="/setting" component={Setting} />
      </Router>
    );
  }
}

export default MyRoute;
