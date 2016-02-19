import React, { PropTypes } from 'react';

import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import FlowProgressIndicator from '../flow-progress-indicator';

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

				<h1 className="step-header__title">{ this.props.label }</h1>
				<p className="step-header__subtitle">{ this.setSubHeaderText }</p>
			</div>
		);
	}
} );
