import React from 'react';
import StatusSwitch from './StatusSwitch.jsx';

const Nav = (props) => {
  return (
    <nav className="navbar navbar-default justify-content-end">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">q.</a>
        </div>
        <ul className="nav navbar-nav">
          <li className="active"><a href="#">Manager Home Page</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <button className="btn btn-success navbar-btn" onClick={props.check}>Chat</button>
          <StatusSwitch status={props.status} switchStatus={props.switchStatus.bind(this)}/>
          <button className="btn btn-danger navbar-btn log-out" onClick={e => location.href = '/logout'}><i className="fa fa-sign-out fa-fw" aria-hidden="true"></i>Logout</button>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
