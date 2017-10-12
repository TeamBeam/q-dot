import React from 'react';
import CustomerList from './CustomerList.jsx';
import StatusSwitch from './StatusSwitch.jsx';
import AddToQueue from './AddToQueue.jsx';
import Nav from './Nav.jsx';
import ManagerAudit from './ManagerAudit.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
import Modal from 'react-modal';

const modalStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(204, 204, 204, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '300px',
    right                      : '300px',
    bottom                     : '100px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
}

class ManagerApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      queues: undefined,
      restaurantInfo: {},
      input: "",
      // messages: props.messages ? props.messages : ""
      messages: [],
      modalIsOpen: false
    };

    // socket initialize
    this.socket = io();

    // dynamically update queue
    this.socket.on('update', () => {
      this.reloadData();
    });

    this.socket.on('chat message', (message) => {

      let oldMessages = this.state.messages;
      this.setState({messages: oldMessages.concat(message)});
    })

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleMessageEvent = this.handleMessageEvent.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.reloadData();
  }

  openModal() {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  };

  hideModal() {
    this.setState({
      modalIsOpen: false
    });
  };

  handleMessageEvent(){
     this.socket.on('chat message', (inboundMessage) => {
      //  let oldMessages = this.state.messages;
      //  this.setState({messages: oldMessages.concat(inboundMessage)});
       //this.props.newMessage({user: 'test_user', message: inboundMessage})
       console.log('handleMessage', inboundMessage)
    })
  }

  handleOnChange(ev) {
     this.setState({ input: ev.target.value })
   }

  handleOnSubmit(ev) {
    ev.preventDefault()
    this.socket.emit('chat message', { name: this.state.restaurantInfo.name, message: this.state.input })

    this.setState({ input: '' })
   }

  switchStatus() {
    $.ajax({
      url: '/restaurants?restaurantId=1&status=' + (this.state.restaurantInfo.status === 'Open' ? 'Closed' : 'Open'),
      method: 'PATCH',
      success: (data) => {
        console.log(data);
        this.reloadData();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  notiCustomer(queueId) {
    console.log(`noti sended to queueId: ${queueId}`);
    this.socket.emit('noti customer', queueId);
  }

  addToQueue(customer) {
    console.log('here to add', customer);
    customer.restaurantId = 1;
    $.ajax({
      method: 'POST',
      url: '/queues',
      data: JSON.stringify(customer),
      contentType: 'application/json',
      success: (data) => {
        console.log('this was a successful post request', data);
        this.reloadData();
      },
      failure: (error) => {
        console.log('something went wrong with the post request', error);
      }
    });
  }

  removeCustomer(queueId) {
    console.log(queueId);
    $.ajax({
      url: '/queues?queueId=' + queueId,
      method: 'PUT',
      success: (data) => {
        console.log(data);
        this.reloadData();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  reloadData() {
    $.ajax({
      url: '/restaurants?restaurantId=1',
      success: (data) => {
        console.log(data);
        this.setState(
          {
            restaurantInfo: data,
            queues: data.queues
          });
        // report restaurantId to server socket
        this.socket.emit('manager report', this.state.restaurantInfo.id);
        let imageURL = `url(/${data.image})`;
        $('.jumbotron-billboard').css('background', imageURL);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //add <ChatLog>

  render() {
    const messages = this.state.messages;
    const message = messages.map(item => {
      return (
        <div className='row'>
          <div >
            {`<${item.name}> : ${item.message}`}
          </div>
        </div>
      )
    });

    return (


      <div>
        <Nav check={this.openModal} status={this.state.restaurantInfo.status} switchStatus={this.switchStatus.bind(this)}/>
        <div className="jumbotron text-center jumbotron-billboard">
          <h1 id="grand-title">{this.state.restaurantInfo.name || 'Restaurant Name'}</h1>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Total groups in queue</h2>
              <div id="number-in-queue">{this.state.restaurantInfo.queues ? this.state.restaurantInfo.queues.length : '0'}</div>
              <h2>Approximate Wait Time</h2>
              <div id="number-in-queue">{this.state.restaurantInfo.total_wait}</div>
              <ManagerAudit />
            </div>
            <div className="col-md-6">
              <CustomerList queues={this.state.queues} addCustomer={this.addToQueue.bind(this)} removeCustomer={this.removeCustomer.bind(this)} notiCustomer={this.notiCustomer.bind(this)}/>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.hideModal}
            style={modalStyles}
          >
          <div >
            {message}
          </div>
            <br/>
            <div className="input-group" style={{"position": "absolute", "bottom": "0", "width": "90%"}}>
            <input type="text" className="form-control" placeholder="chat..." aria-label="chat..." onChange={this.handleOnChange} value={this.state.input}/>
            <span className="input-group-btn">
            <button className="btn btn-outline-primary" type="button" onClick={this.handleOnSubmit}>Send</button>
            <button className="btn btn-outline-primary" type="button" onClick={this.hideModal}>Close</button>
            </span>

          </div>


          </Modal>
        </div>





      </div>
    );
  }
}

// const Chatbox = (props) => {
//   <div className="panel panel-default">
//     {props.message}
//     <div className="input-group">
//     <input type="text" className="form-control" placeholder="chat..." aria-label="chat..." onChange={this.handleOnChange} value={this.state.input}/>
//     <span className="input-group-btn">
//     <button className="btn btn-outline-primary" type="button" onClick={this.handleOnSubmit}>Send!</button>
//     </span>
//     </div>
//   </div>
// }

// <nav className="navbar navbar-fixed-bottom">
//         <div className="container">
//
//             <li className="nav-item">
//               <button className="nav-link" href="#">Chat</button>
//             </li>
//
//                   <div >
//                   {message}
//                   <div className="input-group">
//                   <input type="text" className="form-control" placeholder="chat..." aria-label="chat..." onChange={this.handleOnChange} value={this.state.input}/>
//                   <span className="input-group-btn">
//                   <button className="btn btn-outline-primary" type="button" onClick={this.handleOnSubmit}>Send!</button>
//                   </span>
//                   </div>
//                   </div>
//
//
//         </div>
// </nav>


export default ManagerApp;
