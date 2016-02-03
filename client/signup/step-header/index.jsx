/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import { preventWidows } from 'lib/formatting';
import Button from 'components/button';

module.exports = React.createClass( {
	displayName: 'StepHeader',

	propTypes: {
		headerText: PropTypes.string,
		subHeaderText: PropTypes.string,
		showJetpackButton: PropTypes.bool
	},

	render: function() {
		return (
			<header className="step-header">
				<h1 className="step-header__title">{ preventWidows( this.props.headerText, 2 ) }</h1>
				<p className="step-header__subtitle">{ preventWidows( this.props.subHeaderText, 2 ) }</p>
				<Button compact href="/jetpack/connect">{ this.translate( 'Or host your own site with Jetpack' ) }</Button>
			</header>
		);
	}
} );
