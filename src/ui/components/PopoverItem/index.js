import React, { Component } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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
		const { id, item } = this.props;
		return (
			<span>
        <Button className="mr-1" color="secondary" id={'Popover-' + id} onClick={this.toggle}>
          {item.text}
        </Button>
        <Popover placement={this.props.item.placement} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>{item.title}</PopoverHeader>
          <PopoverBody dangerouslySetInnerHTML={{__html:item.body}}></PopoverBody>
        </Popover>
      </span>
		);
	}
}