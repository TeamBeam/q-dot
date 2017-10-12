import React from 'react';
import $ from 'jquery';
import GroupSizeSelector from './GroupSizeSelector.jsx';

// the form where customers submit their information
class CustomerInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.getGroupSize = this.getGroupSize.bind(this);
    this.getFirstName = this.getFirstName.bind(this);
    this.getLastName = this.getLastName.bind(this);
    this.getMobile = this.getMobile.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.submitCustomerInfo = this.submitCustomerInfo.bind(this);
    this.state = {
      groupSize: 0,
      customerFirstName: '',
      customerLastName: '',
      customerMobile: '',
      customerEmail: '',
      currentRestaurantId: this.props.currentRestaurantId,
    };
  }

  getGroupSize(size) {
    this.setState({
      groupSize: size
    });
  }

  getFirstName(event) {
    this.setState({
      customerFirstName: event.target.value
    });
  }

  getLastName(event) {
    this.setState({
      customerLastName: event.target.value
    });
  }

  getFullName() {
    let fullName = `${this.state.customerFirstName} ${this.state.customerLastName}`;
    this.setState({
      customerFullName: fullName
    });
  }

  getMobile(event) {
    this.setState({
      customerMobile: event.target.value
    });
  }

  getEmail(event) {
    this.setState({
      customerEmail: event.target.value
    });
  }

  submitCustomerInfo() {
    let fullName = `${this.state.customerFirstName} ${this.state.customerLastName}`;
    let windowUrl = window.location.href;
    let id = windowUrl.slice(-1);

    $.ajax({
      method: 'POST',
      url: '../../queues',
      data: JSON.stringify({
        name: fullName,
        mobile: this.state.customerMobile,
        email: this.state.customerEmail,
        size: this.state.groupSize,
        restaurantId: id
      }),
      contentType: 'application/json',
      success: (data) => {
        console.log('this was a successful post request', data);
        this.props.customerInfoSubmitted(data.queueId, data.position);
        window.location.replace(`/customer/queueinfo?queueId=${data.queueId}`);
      },
      failure: (error) => {
        console.log('something went wrong with the post request', error);
      }
    });
  }

  render() {
    return (
      <div className="customer-info-input-container">
        <div className="row">
          <GroupSizeSelector getGroupSize={this.getGroupSize}/>
          <div className="row">
            <div className="input-field col s6">
              <input id="first_name" type="text" className="validate" onChange={this.getFirstName} required/>
              <label htmlFor="first_name" data-error="wrong" data-success="right">First Name</label>
            </div>
            <div className="input-field col s6">
              <input id="last_name" type="text" className="validate" onChange={this.getLastName} required/>
              <label htmlFor="last_name" data-error="wrong" data-success="right">Last Name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="telephone" type="tel" className="validate" onChange={this.getMobile} required/>
              <label htmlFor="telephone" data-error="wrong" data-success="right">Phone Number</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" onChange={this.getEmail}/>
              <label htmlFor="email" data-error="wrong" data-success="right">Email</label>
            </div>
          </div>
          <div className="row">
            <input className="waves-effect waves-light btn" type="submit" value="Add to Queue" onClick={this.submitCustomerInfo}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerInfoForm;

