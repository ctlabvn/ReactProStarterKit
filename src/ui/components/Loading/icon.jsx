import React, { PureComponent } from 'react'

export default class extends PureComponent {
	render() {
		return (
			<div className="col d-flex justify-content-center align-content-start py-4">
				<div>
					<i className="fa fa-refresh fa-spin fa-3x fa-fw" />
				</div>
			</div>
		)
	}
}