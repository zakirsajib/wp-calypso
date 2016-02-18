/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';

/**
 * Internal dependencies
 */
import { DESERIALIZE } from 'state/action-types';
import reducer from './publicize/reducer';
import { publicizeSchema } from './schema';
import { isValidStateWithSchema } from 'state/utils';

// subtrees in publicize are tightly coupled and should be thrown out together
// if any part of the tree no longer fits the schema.
export function publicize( state = {}, action ) {
	switch ( action.type ) {
		case DESERIALIZE:
			if ( ! isEmpty( state ) && isValidStateWithSchema( state, publicizeSchema ) ) {
				return reducer( state, action );
			}
			return reducer( {}, action );
	}
	return reducer( state, action );
}

export default combineReducers( {
	publicize
} );
