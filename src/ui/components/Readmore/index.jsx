import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

class ReadMore extends Component {
	constructor(...args) {
		super(...args);

		this.state = {
			expanded: false,
			truncated: false
		};

		this.handleTruncate = this.handleTruncate.bind(this);
		this.toggleLines = this.toggleLines.bind(this);
	}

	handleTruncate(truncated) {
		if (this.state.truncated !== truncated) {
			this.setState({
				truncated
			});
		}
	}

	toggleLines(event) {
		event.preventDefault();

		this.setState({
			expanded: !this.state.expanded
		});
	}

	render() {
		const {
			children,
			more,
			less,
			lines
		} = this.props;

		const {
			expanded,
			truncated
		} = this.state;

		return (
			<div>
				<Truncate
					lines={!expanded && lines}
					ellipsis={(
						<p>... <a role="button" tabIndex="0" onClick={this.toggleLines}>{more}</a></p>
					)}
					onTruncate={this.handleTruncate}
				>
					{children}
				</Truncate>
				{!truncated && expanded && less && (
					<span> <a role="button" tabIndex="0" onClick={this.toggleLines}>{less}</a></span>
				)}
			</div>
		);
	}
}

ReadMore.defaultProps = {
	lines: 3,
	more: 'Read more',
	less: '',
};

ReadMore.propTypes = {
	children: PropTypes.node.isRequired,
	more: PropTypes.string,
	less: PropTypes.string,
	lines: PropTypes.number
};

export default ReadMore;