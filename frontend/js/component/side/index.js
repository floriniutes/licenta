import React, {Component} from 'react';
import './index.css';
import Menu from "../menu/index";
import Logo from "../common/logo/index";

export default class Side extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className='project-side-menu'>
                <Logo/>
                <Menu/>
            </div>
        )
    }
}