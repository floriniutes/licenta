import React, {Component} from 'react';
import './index.css';
import Menu from "../menu/index";
import Logo from "../common/logo/index";

export default class BurgerMenu extends Component {

  render() {
    return(
      <div className={this.props.isRetracted ? "project-burger-menu retracted" : "project-burger-menu"}>
        <span>Bine ai venit, {this.props.userName}</span>
        <Menu isRetracted={this.props.isRetracted}/>
        <Logo/>
      </div>
    )
  }
}