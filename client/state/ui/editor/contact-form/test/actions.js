/**
 * External dependencies
 */
import { assert } from 'chai';

/**
 * Internal dependencies
 */
import { CONTACT_FORM_DEFAULT } from '../constants';
import {
	EDITOR_CONTACT_FORM_LOAD_FORM,
	EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD,
	EDITOR_CONTACT_FORM_REMOVE_FIELD,
	EDITOR_CONTACT_FORM_CLEAR_FORM,
	EDITOR_CONTACT_FORM_UPDATE_FIELD,
	EDITOR_CONTACT_FORM_UPDATE_SETTINGS
} from 'state/action-types';
import { loadForm, addDefaultField, removeField, clearForm, updateField, updateSettings } from '../actions';

describe( 'actions', () => {
	it( 'should return an action object to signal the initialization of the store', () => {
		const action = loadForm( CONTACT_FORM_DEFAULT );

		assert.deepEqual( action, {
			type: EDITOR_CONTACT_FORM_LOAD_FORM,
			contactForm: CONTACT_FORM_DEFAULT
		} );
	} );

	it( 'should return an action object to signal the creation of a new default field', () => {
		const action = addDefaultField();

		assert.deepEqual( action, { type: EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD } );
	} );

	it( 'should return an action object to signal the removal of a field by index', () => {
		const action = removeField( 1 );

		assert.deepEqual( action, {
			type: EDITOR_CONTACT_FORM_REMOVE_FIELD,
			index: 1
		} );
	} );

	it( 'should return an action object to signal the removal of the contact form data', () => {
		const action = clearForm();

		assert.deepEqual( action, { type: EDITOR_CONTACT_FORM_CLEAR_FORM } );
	} );

	it( 'should return an action object to signal the update of a field by index', () => {
		const action = updateField( 1, { label: 'Name', type: 'text', required: true } );

		assert.deepEqual( action, {
			type: EDITOR_CONTACT_FORM_UPDATE_FIELD,
			index: 1,
			field: { label: 'Name', type: 'text', required: true }
		} );
	} );

	it( 'should return an action object to signal the update of the form settings', () => {
		const action = updateSettings( { to: 'user@example.com', subject: 'this is the subject' } );

		assert.deepEqual( action, {
			type: EDITOR_CONTACT_FORM_UPDATE_SETTINGS,
			settings: {
				to: 'user@example.com',
				subject: 'this is the subject'
			}
		} );
	} );
} );
