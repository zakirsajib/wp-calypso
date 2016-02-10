/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-pure-render/mixin';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import FieldHeader from './field-header';
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormButton from 'components/forms/form-button';
import FormCheckbox from 'components/forms/form-checkbox';
import SelectDropdown from 'components/select-dropdown';
import DropdownItem from 'components/select-dropdown/item';
import TokenField from 'components/token-field';
import { CONTACT_FORM_FIELD_TYPES } from './constants';
import { getLabelForFieldType } from './locales';

export default React.createClass( {
	displayName: 'ContactFormDialogField',

	mixins: [ PureRenderMixin ],

	propTypes: {
		label: PropTypes.string.isRequired,
		type: PropTypes.oneOf( CONTACT_FORM_FIELD_TYPES ).isRequired,
		options: PropTypes.arrayOf( PropTypes.string ),
		required: PropTypes.bool,
		onUpdate: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired
	},

	renderOptions() {
		if ( this.props.type === 'radio' || this.props.type === 'dropdown' ) {
			return (
				<FormFieldset>
					<FormLabel>{ this.translate( 'Options' ) }</FormLabel>
					<TokenField
						value={ this.props.options }
						onChange={ tokens => this.props.onUpdate( { options: tokens } ) }/>
				</FormFieldset>
			);
		}

		return null;
	},

	render() {
		const remove = <FormButton onClick={ this.props.onRemove }><Gridicon icon="trash" /></FormButton>;
		return (
			<FoldableCard
				header={ <FieldHeader name={ this.props.label } /> }
				summary={ remove }
				expandedSummary={ remove } >

				<FormFieldset>
					<FormLabel>{ this.translate( 'Field Name' ) }</FormLabel>
					<FormTextInput value={ this.props.label } onChange={ event => this.props.onUpdate( { label: event.target.value } ) } />
					<FormSettingExplanation>{ this.translate( 'Name of the field as it will appear when you receive an email.' ) }</FormSettingExplanation>
				</FormFieldset>

				<FormFieldset>
					<FormLabel>Field Type</FormLabel>
					<SelectDropdown selectedText={ getLabelForFieldType( this.props.type ) }>
						{ CONTACT_FORM_FIELD_TYPES.map( fieldType => (
							<DropdownItem
								key={ 'field-type-' + fieldType }
								selected={ this.props.type === fieldType }
								onClick={ () => this.props.onUpdate( { type: fieldType } ) }>
								{ getLabelForFieldType( fieldType ) }
							</DropdownItem>
						) ) }
					</SelectDropdown>
				</FormFieldset>

				<FormFieldset>
					<FormLabel>
						<FormCheckbox
							checked={ this.props.required }
							onChange={ () => this.props.onUpdate( { required: !this.props.required } ) } />
						{ this.translate( 'Required' ) }
					</FormLabel>
				</FormFieldset>

				{ this.renderOptions() }

			</FoldableCard>
		);
	}
} );
