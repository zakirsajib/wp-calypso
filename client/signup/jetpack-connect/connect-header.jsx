import React, { PropTypes } from 'react';

import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import FlowProgressIndicator from '../flow-progress-indicator';
import StepHeader from '../step-header';

export default React.createClass( {
	displayName: 'JetpackConnectHeader',

	propTypes: {
		showLogo: PropTypes.bool,
		label: PropTypes.string
	},

	getDefaultProps() {
		return {
			showLogo: true,
			label: ''
		}
	},

	renderJetpackLogo() {
		return (
			<img src="/calypso/images/jetpack/jetpack-manage.svg" width={ 150 } height={ 150 } />
		);
	},

	render() {
		return (
			<div className="jetpack-connect__header-container">
				{ this.props.showLogo
				 	? this.renderJetpackLogo()
					: null }
				<div className="flow-progress-indicator">
					{ this.translate( 'Step %(stepNumber)d of %(stepTotal)d', {
						args: {
							stepNumber: this.props.step+1,
							stepTotal: this.props.steps
						}
					} ) }
				</div>
				<StepHeader { ...this.props }/>
			</div>
		);
	}
} );
