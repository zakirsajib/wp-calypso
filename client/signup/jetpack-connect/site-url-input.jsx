import React, { PropTypes } from 'react';


import Card from 'components/card';
import FormTextInput from 'components/forms/form-text-input';
import FormLabel from 'components/forms/form-label';
import Gridicon from 'components/gridicon';
import Button from 'components/button';
const pluginURL = '/wp-admin/plugin-install.php?tab=plugin-information&plugin=jetpack';

export default React.createClass( {
	displayName: 'JetpackConnectSiteURLInput',

	getInitialState() {
		return {
			value: null,
			buttonEnabled: false
		}
	},

	goToPluginInstall() {
		window.location = this.state.value + pluginURL;
	},

	handleChange( event ) {
		this.setState( {
			value: event.target.value
		} );

		if( this.state.value != null ) {
			this.setState( {
				buttonEnabled: true
			} );
		}
	},

	render() {
		return (
			<Card className="jetpack-connect__site-url-input-container">
				<div className="site-address-container">
					<FormLabel>{ this.translate( 'Site Address' ) }</FormLabel>
					<Gridicon
						size={ 24 }
						icon="globe" />
					<FormTextInput
						value={ this.state.value }
						onChange={ this.handleChange }
						placeholder={ this.translate( 'http://www.yoursite.com' ) } />
				</div>
				<Button
					primary
					disabled={ !Boolean( this.state.value ) }
					onClick={ this.goToPluginInstall }>{ this.translate( 'Install Now!' ) }</Button>
			</Card>

		);
	}

} );
