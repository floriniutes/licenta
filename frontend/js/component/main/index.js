import React, {Component} from "react";
import Switch from "react-router-dom/es/Switch";
import Route from "react-router-dom/es/Route";
import Top from "../top/index";
import Side from "../side/index";
import Tiles from "../common/tiles/index";
import Content from "../content/index";
import "./index.css";
import BurgerMenu from "../burgerMenu/index";
import axios from 'axios';
import {serverAddress} from "../../scripts/index";
import {cookies} from '../app';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.changeState = this.changeState.bind(this);
    this.transerData = this.transerData.bind(this);
    this.state = {
      burgerRetracted: true,
      userName: null
    }
  }

  transerData(user) {
    this.setState({
      userName: user
    })
  }

  changeState() {
    let toggle = this.state.burgerRetracted;
    this.setState({
      burgerRetracted: !toggle
    })
  }

  checkUser = async () => {
    let token = cookies.get('token');
    let userId = cookies.get('userId');
    let isDoctor = cookies.get('isDoctor') ? true : false;
    let isAssistant = cookies.get('isAssistant') ? true : false;
    let data = await axios.post(serverAddress + '/user/checkUser', {token: token, id: userId, isDoctor: isDoctor, isAssistant: isAssistant});
    if (data.status === 201) {
      cookies.remove('userId');
      cookies.remove('token');
      cookies.remove('isDoctor');
      cookies.remove('isAssitant');
      window.location.hash = '/pagina-prezentare';
      //window.location.reload();
    }
  };

  render() {
    this.checkUser();
    return (
      <div className="project-main">
        <div className='project-side-wrapper'>
          <Side/>
        </div>
        <div className='project-top-content-wrapper'>
          <Top changeMenuState={this.changeState} transferData={this.transerData}/>
          <BurgerMenu
            userName={this.state.userName}
            isRetracted={this.state.burgerRetracted}
            changeMenuState={this.changeState}
          />
          <div className='project-content-wrapper'>
            <Switch>
              <Route path='/main/:content' component={Content}/>
              <Route path='/main' component={()=> {return <Tiles isDoctor={false}/>}}/>
            </Switch>
          </div>
        </div>
      </div>

    )
  }
}