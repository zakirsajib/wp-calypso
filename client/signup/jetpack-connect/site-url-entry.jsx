import React, { PropTypes } from 'react';

import SiteURLInput from './site-url-input';
import ConnectHeader from './connect-header';
import LoggedOutForm from 'components/logged-out-form';
import LoggedOutFormLinks from 'components/logged-out-form/links';
import LoggedOutFormLinkItem from 'components/logged-out-form/link-item';

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
					headerText={ this.translate( 'Install Jetpack' ) }
					subHeaderText={ this.translate( 'Get WordPress.com connected to your self-hosted site.' ) }
					{ ...this.props } />

				<SiteURLInput />

				<LoggedOutFormLinks>
					<LoggedOutFormLinkItem href="http://jetpack.com">{ this.translate( 'Install Jetpack Manually' ) }</LoggedOutFormLinkItem>
					<LoggedOutFormLinkItem href="/start">{ this.translate( 'Host a site on WordPress.com' ) }</LoggedOutFormLinkItem>
				</LoggedOutFormLinks>
			</div>
		);
	}
} );
