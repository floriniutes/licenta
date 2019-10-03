import React, {Component} from 'react';
import './index.css';
import axios from 'axios';
import Button from "../common/button/index";
import {notify, serverAddress} from '../../scripts/index';
import {cookies} from "../app";

export default class Top extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      usage: this.props.usage
    }
  }

  componentDidMount() {
    if (this.props.usage !== "pagina-prezentare") {
      axios.get(serverAddress + '/user/getName/' + cookies.get('userId')).then(response => {
        this.setState({
          user: response.data[0].firstName
        }, () => {
          this.props.transferData(this.state.user)
        })
      });
      axios.get(serverAddress + '/notification/countNotifications/' + cookies.get('userId')).then(response => {
        if(response.status === 200) {
          notify('Aveți notificări noi');
          this.setState({
            countNewNotif: response.data
          })
        }
      });
    }
  }


  render() {
    return (
      <div className='project-top'>
        {this.state.usage === "pagina-prezentare" ? <div className='presentation-page-content'>
          <Button label='Autentificare' onClick={this.props.redirectLogin}/>
          <Button label='Înregistrare' onClick={this.props.redirectRegister}/>
        </div> : <div className='logged-content'>
          <p className="project-top-text">Bine ai venit, {this.state.user}</p>
          <span className="fas fa-bars burger-menu" onClick={this.props.changeMenuState}/>
          <a href='/#/main/notificari'>
              <span className="fa-layers">
                <span className="fa-layers-text fa-inverse" style={{color: 'Tomato', fontSize: '20px'}}>
                  {this.state.countNewNotif > 9 ? "+9" :
                    this.state.countNewNotif}</span>
                <i className="fas fa-bell" onClick={() => {
                  if (document.querySelector('.fa-layers-text').innerHTML) {
                    document.querySelector('.fa-layers-text').innerHTML = '';
                  }
                }
                }/>
              </span>
          </a>
        </div>
        }
      </div>
    )
  }
}