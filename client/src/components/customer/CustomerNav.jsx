import React from 'react';

// nav bar
const CustomerNav = () => (
  <div className="customer-nav-bar">
    <ul id="dropdown1" className="dropdown-content">
      <li><a href="/">home</a></li>
      <li className="divider"></li>
      <li><a href="../manager">manager</a></li>
    </ul>
    <nav>
      <div className="nav-wrapper">
        <ul className="nav-mobile hide-on-med-and-down">
          <li><a className="dropdown-button" href="#!" data-activates="dropdown1">q.<i className="material-icons right">arrow_drop_down</i></a></li>
        </ul>
      </div>
    </nav>
  </div>
);

export default CustomerNav;