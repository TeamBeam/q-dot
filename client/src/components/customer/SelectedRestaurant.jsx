import React from 'react';
import RestaurantLogoBanner from './RestaurantLogoBanner.jsx';
import CustomerInfoForm from './CustomerInfoForm.jsx';
import QueueInfo from './QueueInfo.jsx';
import RestaurantInformation from './RestaurantInformation.jsx';
import { Link } from 'react-router-dom';

class SelectedRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.customerInfoSubmitted = this.customerInfoSubmitted.bind(this);
    this.state = {
      currentRestaurant: {queues: []},
      infoSubmitted: false,
      queueId: 0,
      queuePosition: 0,
      ready: false
    };
  }

  componentDidMount() {
    this.getRestaurant();
  }

  getRestaurant() {
    let windowUrl = window.location.href;
    let id = windowUrl.slice(-1);

    $.ajax({
      method: 'GET',
      url: `/restaurants?restaurantId=${id}`,
      success: (data) => {
        console.log('successfully grabbed current restaurant data', data);
        this.setState({ currentRestaurant: data });
      },
      failure: (error) => {
        console.log('failed to grab current restaurant data', error);
      }
    });
  }

  customerInfoSubmitted(id, position) {
    this.setState({
      infoSubmitted: true,
      queueId: id,
      queuePosition: position
    });
  }

  render() {
    const restaurantImg = {
      backgroundImage: `url(../${this.state.currentRestaurant.image})`
    };

    return (
      <div className="selected-restaurant">
        <RestaurantLogoBanner style={restaurantImg} />
        <RestaurantInformation restaurant={this.state.currentRestaurant}/>
        <CustomerInfoForm customerInfoSubmitted={this.customerInfoSubmitted} />

        <span style={{'margin': '-140px 0 0 375px'}} className="waves-effect waves-light btn" onClick={() =>
          window.open(this.state.currentRestaurant.menu, '_blank')
        }> Menu </span>
      </div>
    );
  }
}

export default SelectedRestaurant;