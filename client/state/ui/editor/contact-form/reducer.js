/**
 * External dependencies
 */
import cloneDeep from 'lodash/lang/cloneDeep';
import merge from 'lodash/object/merge';

/**
 * Internal dependencies
 */
import {
	EDITOR_CONTACT_FORM_LOAD_FORM,
	EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD,
	EDITOR_CONTACT_FORM_REMOVE_FIELD,
	EDITOR_CONTACT_FORM_CLEAR_FORM,
	EDITOR_CONTACT_FORM_UPDATE_FIELD,
	EDITOR_CONTACT_FORM_UPDATE_SETTINGS
} from 'state/action-types';
import { CONTACT_FORM_DEFAULT, CONTACT_FORM_DEFAULT_NEW_FIELD } from './constants';

const initialState = cloneDeep( CONTACT_FORM_DEFAULT );

export default function( state = initialState, action ) {
	const { index, field, settings } = action;

	switch ( action.type ) {
		case EDITOR_CONTACT_FORM_LOAD_FORM:
			state = cloneDeep( action.contactForm );
			break;
		case EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD:
			state = Object.assign( {}, state, {
				fields: [ ...state.fields, CONTACT_FORM_DEFAULT_NEW_FIELD ]
			} );
			break;
		case EDITOR_CONTACT_FORM_REMOVE_FIELD: {
			state = cloneDeep( state );
			state.fields.splice( index, 1 );
			break;
		}
		case EDITOR_CONTACT_FORM_CLEAR_FORM:
			state = cloneDeep( CONTACT_FORM_DEFAULT );
			break;
		case EDITOR_CONTACT_FORM_UPDATE_FIELD:
			state = cloneDeep( state );
			state.fields[index] = Object.assign( {}, state.fields[index], field );
			break;
		case EDITOR_CONTACT_FORM_UPDATE_SETTINGS:
			state = merge( {}, state, settings );
			break;
	}

	return state;
}
