import React, { PropTypes } from 'react';

import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import ConnectHeader from './connect-header';

export default React.createClass( {
	displayName: 'JetpackConnectSiteURLEntry',

	propTypes: {
		step: PropTypes.number,
		steps: PropTypes.number
	},

	render() {
		return (
			<div className="jetpack-connect__site-url-entry-container">
				<ConnectHeader
					label={ this.translate( 'Install Jetpack' ) }
					{...this.props }/>

			</div>
		);
	}
} );
