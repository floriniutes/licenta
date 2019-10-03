import React, {Component} from 'react';
import Notification from './notification/index';
import {serverAddress} from '../../../scripts/index';
import {cookies} from '../../app';
import axios from 'axios';


export default class NotificationList extends Component {

  constructor() {
    super();
    this.renderNotifications = this.renderNotifications.bind(this);
    this.state = {}
  }

  componentWillMount() {
    axios.get(serverAddress + '/notification/getUserNotifications/' + cookies.get('userId')).then(response => {
      this.setState({
        notifications: response.data
      }, () => {
        this.renderNotifications();
        axios.put(serverAddress + '/notification/markAsOld/' + cookies.get('userId'))
      })
    })
  }

  renderNotifications = async () => {
    let notifications = [];
    for (let i = 0; i < this.state.notifications.length; i++) {
      notifications.push(<Notification key={i}
                                       id={this.state.notifications[i].id}
                                       className={this.state.notifications[i].isNew ? 'project-notification new' : 'project-notification'}
                                       additional={this.state.notifications[i].additional}
                                       date={this.state.notifications[i].date}
                                       message={this.state.notifications[i].text}/>);
    }

    this.setState({
      notificationList: notifications
    })
  };

  render() {
    return (
      <div className='project-notification-list'>
        {this.state.notificationList}
      </div>
    )
  }
}