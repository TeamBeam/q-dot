import React from 'react';

const RestaurantInformation = (props) => {
  let groupsText; // change text following group length indicator to be grammatically correct
  props.restaurant.queues.length === 1 ? groupsText = 'group queued' : groupsText = 'groups queued';

  let statusCircle;
  const openStatusCircle = {
    background: '#4FD135'
  };
  const closedStatusCircle = {
    background: '#C01717'
  };

  let waitTime = <div className="restaurant-wait-time"><i className="tiny material-icons">access_time</i> {props.restaurant.total_wait - props.restaurant.average_wait} mins</div>;
  props.restaurant.status === 'Closed' ? statusCircle = closedStatusCircle : statusCircle = openStatusCircle;
  props.restaurant.status === 'Closed' ? waitTime = undefined : waitTime;

  return (
    <div className="restaurant-info-container">
      <div className="restaurant-info">
        <div className="restaurant-name">{props.restaurant.name}</div>
        <div className="restaurant-queue-info">
          <div className="restaurant-queue-count">{props.restaurant.queues.length} {groupsText} {waitTime}</div>
          <div className="restaurant-queue-status"><span className="status-circle" style={statusCircle}/>{props.restaurant.status}</div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInformation;