import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class Spinner extends React.Component {
  render() {
    return (
      <div className="text-center" style={{margin: "220px 0px"}}>
        <CircularProgress color="secondary" />
          <p style={{fontSize: 16}}>Driver Searching...</p>
      </div>
    );
  }
}
