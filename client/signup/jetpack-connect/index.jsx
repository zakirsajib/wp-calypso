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
				<SiteURLEntry
					step={ 1 }
					steps={ this.props.steps } />
				<LoginOrSignup
					step={ 2 }
					steps={ this.props.steps } />
				<PickAPlan
					step={ 3 }
					steps={ this.props.steps }/>
			</Main>
		);
	}
} );
