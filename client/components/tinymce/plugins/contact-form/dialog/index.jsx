/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import FormButton from 'components/forms/form-button';
import FormSettings from './settings';
import Navigation from './navigation';
import FieldList from './field-list';

const ContactFormDialog = React.createClass( {
	displayName: 'ContactFormDialog',

	propTypes: {
		activeTab: PropTypes.oneOf( ['fields', 'settings'] ).isRequired,
		showDialog: PropTypes.bool.isRequired,
		contactForm: PropTypes.shape( {
			to: PropTypes.string,
			subject: PropTypes.string,
			fields: PropTypes.array.isRequired
		} ).isRequired,
		onChangeTabs: PropTypes.func.isRequired,
		onUpdateToSettings: PropTypes.func.isRequired,
		onUpdateSubjectSettings: PropTypes.func.isRequired,
		onUpdateField: PropTypes.func.isRequired,
		onAddNewField: PropTypes.func.isRequired,
		onRemoveField: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired
	},

	getActionButtons() {
		const actionButtons = [
			<FormButton
				key="save"
				onClick={ this.props.onSave } >
				{ this.translate( 'Save' ) }
			</FormButton>,
			<FormButton
				key="cancel"
				isPrimary={ false }
				onClick={ this.props.onClose } >
				{ this.translate( 'Cancel' ) }
			</FormButton>
		];

		if ( this.props.activeTab === 'fields' ) {
			return [
				<div className="editor-contact-form-modal__secondary-actions">
					<FormButton
						key="add"
						isPrimary={ false }
						onClick={ this.props.onAddNewField } >
						{ this.translate( 'Add New Field' ) }
					</FormButton>
				</div>,
				...actionButtons
			];
		}

		return actionButtons;
	},

	render() {
		const {
			activeTab,
			contactForm: { to, subject, fields },
			onChangeTabs,
			onUpdateToSettings,
			onUpdateSubjectSettings,
			onAddNewField,
			onUpdateField,
			onRemoveField
		} = this.props;

		const content = this.props.activeTab === 'fields'
			? <FieldList { ...{ fields, onAddNewField, onRemoveField, onUpdateField } } />
			: <FormSettings { ...{ to, subject, onUpdateToSettings, onUpdateSubjectSettings } } />;

		return (
			<Dialog
				isVisible={ this.props.showDialog }
				onClose={ this.props.onClose }
				buttons={ this.getActionButtons() }
				additionalClassNames="editor-contact-form-modal" >
				<Navigation { ...{ activeTab, onChangeTabs, fieldCount: fields.length } } />
				{ content }
			</Dialog>
		);
	}
} );

export default connect( state => {
	return { contactForm: state.ui.editor.contactForm };
} )( ContactFormDialog );
