import React, { Component } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { translate } from "react-i18next";

@translate('translations')
export default class extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			popoverOpen: false
		};
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen
		});
	}

	render() {
		const { t, id, item } = this.props;
		return (
			<span>
        <Button className="mr-1" color="secondary" id={'Popover-' + id} onClick={this.toggle}>
          {t(item.text)}
        </Button>
        <Popover placement={this.props.item.placement} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>{item.title}</PopoverHeader>
          <PopoverBody>{item.body}</PopoverBody>
        </Popover>
      </span>
		);
	}
}