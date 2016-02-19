import React, { PropTypes } from 'react';

import FormTextInput from 'components/forms/form-text-input';
import FormLabel from 'components/forms/form-label';
import Gridicon from 'components/gridicon';
import Button from 'components/button';

export default React.createClass( {
	displayName: 'JetpackConnectSiteURLInput',

	render() {
		return (
			<div className="jetpack-connect__site-url-input-container">
				<div className="site-address-container">
					<FormLabel>{ this.translate( 'Site Address' ) }</FormLabel>
					<Gridicon size={ 24 } icon="globe" />
					<FormTextInput placeholder={ this.translate( 'e.g. http://www.yoursite.com' ) } />
				</div>
				<Button primary>{ this.translate( 'Install Now!' ) }</Button>
			</div>

		);
	}

} );
