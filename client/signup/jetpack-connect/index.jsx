/**
 * External dependencies
 */
import React from 'react';

/**
* Internal dependencies
**/
import Main from 'components/main';
import Card from 'components/card';
import FormTextInput from 'components/forms/form-text-input';

export default React.createClass( {
	displayName: 'JetpackConnect',

	render: function() {
		return (
			<Main>
				<Card>Jetpack Connect</Card>
			</Main>
		);
	}
} );
