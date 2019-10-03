import React, {Component} from 'react';
import './index.css';
import {cookies} from '../../../app';
import Button from '../../../common/button/index';
import axios from 'axios';
import {notify, serverAddress} from "../../../../scripts/index";

export default class AppointmentGroup extends Component {

  constructor(props) {
    super(props);
    this.cancelAllAppointmentsByDate = this.cancelAllAppointmentsByDate.bind(this);
    this.state = {
      isHidden: false
    }
  }

  cancelAllAppointmentsByDate = async () => {

    let getName = await axios.get(serverAddress + '/user/getName/' + cookies.get('userId'));
    let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;

    axios.put(serverAddress + '/consultation/reschedulePatients', {date: this.props.date, medicId: cookies.get('userId')});

    this.setState({
      isHidden: true
    });

    location.reload();

    notify('Consultațiile au fost amânate cu succes');
  };

  render() {
    return (
      <div>
        {this.state.isHidden === false ?
          <div className='project-appointment-group'>
            <div className='project-appointment-group-details' onClick={this.props.renderAppointments}>
              {this.props.date}
            </div>
            <Button tipMessage="Anulați programările din această zi" tipFor='cancel-button' className='fas fa-times button-cancel' onClick={this.cancelAllAppointmentsByDate}/>
          </div> : null}
      </div>
    )
  }
}