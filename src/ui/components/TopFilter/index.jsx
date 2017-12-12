import React from 'react'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import {
  Field
} from "redux-form";

import './index.css'

class TopFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: ""
    };
  }

  onSelectFilter = (id, selected) => {
    const {onSelected} = this.props;
    this.setState({
      active: id
    });

    onSelected(id, selected);
  }

  render() {
    const {categories} = this.props;

    return (
      <div className="top-filter">
        <div className="top-filter-menu top-filter-menu-fixed">
          <div className="top-filter-menu-container px-4">{
            categories && categories.map((item, i) => {
              let obj = Object.assign(item);
              obj.multiple = obj.type === "radio" ? 0 : (obj.type === "checkbox" ? 1 : obj.multiple);
              return (
                <TopFilterMenuItem key={i} item={obj} active={this.state.active === obj.id} onSelected={this.onSelectFilter} isLast={i === categories.length - 1 ? 1 : 0}/>
              );
            })
          }
          </div>
        </div>
        <div className="top-filter-menu top-filter-menu-faked">
          <div className="top-filter-menu-container">abc</div>
        </div>
      </div>
    )
  }
}

class TopFilterMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      selected: props.item && props.item.selected ? [props.item.selected] : []
    };
  }

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  onSelectFilter = (value, checked) => {
    const {onSelected, item} = this.props;
    const {id, multiple} = item;

    var arr = [];

    if (checked) {
      if (multiple)  arr = this.state.selected.concat(value);
      else arr = [value];
    } else {
      if (multiple) arr = this.state.selected.filter(el => el !== value);
      else arr = [];
    }
    this.setState({selected: arr});
    onSelected(id, arr);

    this.toggle();
  }

  renderField = (field) => {
    const {item} = this.props;
    const {type, values} = item;
    const { selected } = this.state;

    if (!values) return null;

    return values.map((el, index) => {
      const {name, value} = el;
      return (
        <li key={index}>
          <input
            {...field.input}
            onChange={ e => {
              this.onSelectFilter(value, e.target.checked);
              field.input.onChange(value);
            }}
            type={type}
            checked={selected.indexOf(value) >= 0}
          />
          &nbsp;{" "}
          <label htmlFor={name + index}>
            {name}
          </label>
        </li>
      );
    })
  }

  render() {
    const {item, isLast, active} = this.props;
    const {id, type, values, title, showResult} = item;
    const { selected } = this.state;

    if (type === "label") {
      return [
        <span key="1" className="color-cg-074">
          {title}
        </span>,
        !isLast && <span key="2" className="top-filter-label-separate color-cg-074">-</span>
      ];
    }

    let selectArr = [];
    values.map(el => {
      if (selected.indexOf(el.value) >= 0) selectArr.push(el.name);
      return false;
    });

    return (
      <span className={active ? "top-filter-menu-item selected" : "top-filter-menu-item"} role="button"
            id={"top-filter-popover-" + id} onClick={this.toggle}>
        {showResult && selectArr.length > 0 ? selectArr.join(',') : title}
        {(type === 'checkbox' || type === 'radio') && <i className="fa fa-angle-down ml-1"/>}
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={"top-filter-popover-" + id}
          toggle={this.toggle}
        >
          <PopoverHeader>{title}</PopoverHeader>
          <PopoverBody>
            <div className="w-100">
              <ul className="list-unstyled">
                <Field
                  name={id}
                  component={this.renderField}
                />
              </ul>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

export default TopFilter;