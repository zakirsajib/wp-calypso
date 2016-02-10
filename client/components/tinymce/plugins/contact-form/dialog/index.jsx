/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import EmptyContent from 'components/empty-content';
import Dialog from 'components/dialog';
import SectionNav from 'components/section-nav';
import SectionNavTabs from 'components/section-nav/tabs';
import SectionNavTabItem from 'components/section-nav/item';
import FormButton from 'components/forms/form-button';
import FormSettings from './settings';
import Field from './field';
import { getLabelForTab } from './locales';

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
		onAdd: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired
	},

	renderFieldList() {
		if ( this.props.contactForm.fields.length > 0 ) {
			return (
				<div className="editor-contact-form-modal__form-fields">
					{ this.props.contactForm.fields.map( ( field, index ) => {
						const { label, type, options, required } = field;
						return (
							<Field
								key={ index }
								{ ...{ label, type, options, required } }
								onRemove={ this.props.onRemove.bind( this, index ) }
								onUpdate={ newField => this.props.onUpdateField( index, newField ) } />
						);
					} ) }
				</div>
			);
		}

		return <EmptyContent
			title={ null }
			line={ this.translate( 'An empty form is useless. Go ahead and add some fields!' ) }
			action={ this.translate( 'Add New Field' ) }
			actionCallback={ this.props.onAdd }
			isCompact={ true } />
	},

	render() {
		const addNewFieldButton = (
			<div className="editor-contact-form-modal__secondary-actions">
				<FormButton
					key="add"
					isPrimary={ false }
					onClick={ this.props.onAdd } >
					{ this.translate( 'Add New Field' ) }
				</FormButton>
			</div>
		);
		let actionButtons = [
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
			actionButtons = [ addNewFieldButton, ...actionButtons ];
		}

		const { contactForm: { to, subject }, onUpdateToSettings, onUpdateSubjectSettings } = this.props;
		const tabs = [ 'fields', 'settings' ];

		const content = this.props.activeTab === 'fields'
			? this.renderFieldList()
			: <FormSettings { ...{ to, subject, onUpdateToSettings, onUpdateSubjectSettings } } />;

		return (
			<Dialog
				isVisible={ this.props.showDialog }
				onClose={ this.props.onClose }
				buttons={ actionButtons }
				additionalClassNames="editor-contact-form-modal" >
				<SectionNav selectedText="Form Fields">
					<SectionNavTabs>
						{ tabs.map( tab => (
							<SectionNavTabItem
								key={ 'contact-form-' + tab }
								selected={ this.props.activeTab === tab }
								count={ tab === 'fields' ? this.props.contactForm.fields.length : null }
								onClick={ this.props.onChangeTabs.bind( null, tab ) } >
								{ getLabelForTab( tab ) }
							</SectionNavTabItem>
						) ) }
					</SectionNavTabs>
				</SectionNav>
				{ content }
			</Dialog>
		);
	}
} );

export default connect( state => {
	return { contactForm: state.ui.editor.contactForm };
} )( ContactFormDialog );
