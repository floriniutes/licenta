import React, {Component} from 'react';
import './index.css';
import Button from "../../../common/button/index";
import {serverAddress} from "../../../../scripts/index";
import axios from 'axios';
import {cookies} from '../../../app';

export default class Notification extends Component {

  constructor(props) {
    super(props);
    this.denyReschedule = this.denyReschedule.bind(this);
    this.acceptReschedule = this.acceptReschedule.bind(this);
    this.state = {}
  }

  denyReschedule() {
    this.setState({
      available: false
    });

    axios.put(serverAddress + '/notification/updateNotification/' + this.props.id)
  }

  acceptReschedule = async () => {

    let data = this.state.userData;
    data.userId = cookies.get('userId');

    let additionalData = JSON.parse(this.props.additional);

    let getName = await axios.get(serverAddress + '/user/getName/' + cookies.get('userId'));
    let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;
    let timeComps = data.time.split(':');
    if (timeComps[1].length === 1)
      timeComps[1] = "0" + timeComps[1];
    let info = 'Pacientul ' + formattedName + ' s-a programat pentru o consultație la secția de ' + data.section + ' pentru data de ' + data.date + ' ora ' + timeComps[0] + ":" + timeComps[1];

    axios.post(serverAddress + '/consultation/rescheduleAndAbandon', {data: data});
    axios.post(serverAddress + '/notification/create', {text: info, userId: additionalData.medicId});
    axios.put(serverAddress + '/notification/updateNotification/' + this.props.id);

    this.setState({
      available: false
    })
  };

  componentDidMount() {

    if (this.props.additional) {
      let parsedData = JSON.parse(this.props.additional);
      axios.post(serverAddress + '/consultation/rescheduleNewPerson', parsedData).then(response => {
        if (response.status === 200 && (new Date(parsedData.date) - new Date() ) > 0) {
          this.setState({
            available: true,
            userData: parsedData
          })
        } else {
          this.setState({
            available: false
          })
        }
      })
    }
  }

  render() {
    return (
      <div className="project-notification-wrapper">
        <div className={this.props.className}>
          <div className='project-notification-date'>
            {this.props.date}
          </div>
          <div className='project-notification-message'>
            {this.props.message}
          </div>
        </div>
        {this.props.additional ? this.state.available ? <div className='project-notification-buttons'>
          <Button className='fas fa-times button-refuse' tipMessage="Refuzați reprogramarea" tipFor='cancel-button' onClick={this.denyReschedule}/>
          <Button className='fas fa-check button-accept' tipMessage="Acceptați reprogramarea" tipFor='reschedule-button' onClick={this.acceptReschedule}/>
        </div> : null : null}
      </div>
    )
  }
}