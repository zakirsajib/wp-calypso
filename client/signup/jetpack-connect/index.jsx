/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
* Internal dependencies
**/
import userModule from 'lib/user';
const user = userModule();
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

	userIsLoggedIn() {
		return Boolean( user.get() );
	},

	determineNumberOfSteps() {
		let steps = 1;

		if( this.userIsLoggedIn() ){
			steps = 2;
		} else {
			steps = 3;
		}
		return steps;
	},

	render() {
		return (
			<Main className="jetpack-connect__main">
				<SiteURLEntry step={ 1 } steps={ this.determineNumberOfSteps() } />
				<LoginOrSignup step={ 2 } steps={ this.determineNumberOfSteps() }/>
				<PickAPlan step={ 3 } steps={ this.determineNumberOfSteps() }/>
			</Main>
		);
	}
} );
