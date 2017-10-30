import React, { Component } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { translate } from "react-i18next";

@translate('translations')
export default class extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			popoverOpen: false,
			checkedItem: 0
		};
	}

	handleFilter = (e) => {
		this.setState({
			checkedItem: +e.currentTarget.value
		})
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen
		});
	}

	render() {
		const { t, id, item } = this.props;
		const { checkedItem } = this.state;
		return (
			<span>
        <Button className="mr-1" color="secondary" id={'Popover-' + id} onClick={this.toggle}>
          {t(item.text)}
        </Button>
        <Popover placement={item.placement} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>{item.title}</PopoverHeader>
          <PopoverBody>
	          <div className="w-100">
							<ul className="list-unstyled">
								{item.body.map((line, index) => (
									<li key={index}>
										<input id={item.name + index} name={item.name} value={index} type="radio" onChange={this.handleFilter} checked={index === checkedItem} />
										&nbsp; <label htmlFor={item.name + index}>{line}</label>
									</li>
								))}
							</ul>
						</div>
          </PopoverBody>
        </Popover>
      </span>
		);
	}
}