/**
 * External Dependencies
 */
import tinymce from 'tinymce/tinymce';
import i18n from 'lib/mixins/i18n';
import React, { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
/**
 * Internal Dependencies
 */
import ContactFormDialog from './dialog';
import {
	loadForm,
	addDefaultField,
	removeField,
	clearForm,
	updateToSettings,
	updateSubjectSettings,
	updateField
} from 'state/ui/editor/contact-form/actions';
import { serialize, deserialize } from './shortcode-utils';

const wpcomContactForm = editor => {
	let node;
	const store = editor.getParam( 'redux_store' );

	editor.on( 'init', () => {
		node = editor.getContainer().appendChild(
			document.createElement( 'div' )
		);
	} );

	editor.on( 'remove', () => {
		unmountComponentAtNode( node );
		node.parentNode.removeChild( node );
		node = null;
	} );

	editor.addCommand( 'wpcomContactForm', content => {
		if ( content ) {
			store.dispatch( loadForm( deserialize( content ) ) );
		} else {
			store.dispatch( clearForm() );
		}

		function renderModal( visibility = 'show', activeTab = 'fields' ) {
			render(
				createElement( Provider, { store },
					createElement( ContactFormDialog, {
						showDialog: visibility === 'show',
						activeTab,
						onChangeTabs( tab ) {
							renderModal( 'show', tab );
						},
						onUpdateToSettings( to ) {
							store.dispatch( updateToSettings( to ) );
						},
						onUpdateSubjectSettings( subject ) {
							store.dispatch( updateSubjectSettings( subject ) );
						},
						onAddNewField() {
							store.dispatch( addDefaultField() )
						},
						onUpdateField( index, field ) {
							store.dispatch( updateField( index, field ) );
						},
						onRemoveField( index ) {
							store.dispatch( removeField( index ) );
						},
						onClose() {
							store.dispatch( clearForm() );
							editor.focus();
							renderModal( 'hide' );
						},
						onSave() {
							const state = store.getState();
							editor.execCommand( 'mceInsertContent', false, serialize( state.ui.editor.contactForm ) );
						}
					} )
				),
				node
			);
		};

		renderModal();
	} );

	editor.addButton( 'wpcom_add_contact_form', {
		classes: 'btn wpcom-button contact-form',
		title: i18n.translate( 'Add Contact Form' ),
		cmd: 'wpcomContactForm',
		onPostRender() {
			this.innerHtml( renderToStaticMarkup(
				<button type="button" role="presentation">
					{ this.translate( 'Add Contact Form' ) }
				</button>
			) );
		}
	} );
};

export default () => {
	tinymce.PluginManager.add( 'wpcom/contactform', wpcomContactForm );
}
