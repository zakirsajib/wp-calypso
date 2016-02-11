/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import SectionHeader from 'components/section-header';
import Card from 'components/card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';

export default React.createClass( {
	displayName: 'ContactFormDialogFormSettings',

	propTypes: {
		to: PropTypes.string,
		subject: PropTypes.string,
		onUpdateToSettings: PropTypes.func.isRequired,
		onUpdateSubjectSettings: PropTypes.func.isRequired
	},

	onUpdateToSettings( event ) {
		this.props.onUpdateToSettings( event.target.value );
	},

	onUpdateSubjectSettings( event ) {
		this.props.onUpdateSubjectSettings( event.target.value );
	},

	render() {
		return (
			<div className="editor-contact-form-modal__form-settings">
				<SectionHeader label={ this.translate( 'Contact Form Notification Settings' ) } />
				<Card>
					<p>
						{ this.translate( 'If you don’t make any changes here, feedback will be sent to the author of the page/post and the subject will be the name of this page/post.' ) }
					</p>

					<FormFieldset>
						<FormLabel>{ this.translate( 'Enter your email address' ) }</FormLabel>
						<FormTextInput value={ this.props.to } onChange={ this.onUpdateToSettings } />
						<FormSettingExplanation>{ this.translate( 'You can enter multiple email addresses in the Email address field, and separate them with commas.' +
							' A notification email will then be sent to each email address.' ) }</FormSettingExplanation>
					</FormFieldset>

					<FormFieldset>
						<FormLabel>{ this.translate( 'What should the subject line be?' ) }</FormLabel>
						<FormTextInput value={ this.props.subject } onChange={ this.onUpdateSubjectSettings } />
					</FormFieldset>
				</Card>
			</div>
		);
	}
} );
