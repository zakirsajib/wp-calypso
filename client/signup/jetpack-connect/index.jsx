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
			<Main>
				<SiteURLEntry step={ 0 } />
				<LoginOrSignup step={ 1 }/>
				<PickAPlan step={ 2 }/>
			</Main>
		);
	}
} );
