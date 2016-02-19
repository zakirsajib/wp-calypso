/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
* Internal dependencies
**/
import Main from 'components/main';
import SiteURLEntry from './site-url-entry';
import PickAPlan from './pick-a-plan';
import LoginOrSignup from './login-or-signup';

export default React.createClass( {
	displayName: 'JetpackConnect',

	propTypes: {
		steps: PropTypes.number
	},

	getDefaultProps() {
		return {
			steps: 4
		}
	},

	render() {
		return (
			<Main className="jetpack-connect__main">
				<SiteURLEntry step={ 1 } steps={ 3 } />
				<LoginOrSignup step={ 2 } steps={ 3 }/>
				<PickAPlan step={ 3 } steps={ 3 }/>
			</Main>
		);
	}
} );
