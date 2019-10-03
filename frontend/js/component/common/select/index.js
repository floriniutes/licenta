import React, {Component} from 'react';
import './index.css';
import Select from 'react-select';


export default class Selector extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      [this.props.name]: this.props.value
    }
  }

  handleChange(event) {
    this.props.extract(this.props.name, event.value, this.props.id);
  }

  getOptions() {
    let list = [];
    if( this.props.options ) {
      this.props.options.map(item => (
        list.push({
          value: item.value,
          label: item.label
        })
      ));
    }

    return list;
  }

  render() {
    return (
      <div className='project-select-wrapper'>
        <label>{this.props.label}</label>
        <Select id={this.props.id}
                classname='select-input'
                name={this.props.name}
                onChange={this.handleChange}
                options={this.getOptions()}
        />
      </div>
    )
  }
}
