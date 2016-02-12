/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import omit from 'lodash/object/omit';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import FieldHeader from './field-header';
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormCheckbox from 'components/forms/form-checkbox';
import SelectDropdown from 'components/select-dropdown';
import DropdownItem from 'components/select-dropdown/item';
import TokenField from 'components/token-field';
import { getLabelForFieldType } from './locales';

export default React.createClass( {
	displayName: 'ContactFormDialogField',

	mixins: [ PureRenderMixin ],

	propTypes: {
		label: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		options: PropTypes.string,
		required: PropTypes.bool,
		onUpdate: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired
	},

	renderOptions() {
		if ( this.props.type === 'radio' || this.props.type === 'dropdown' ) {
			let { options } = this.props;
			if ( options && typeof options === 'string' ) {
				options = options.split( ',' );
			}

			return (
				<FormFieldset>
					<FormLabel>{ this.translate( 'Options' ) }</FormLabel>
					<TokenField
						value={ options || [] }
						onChange={ tokens => this.props.onUpdate( { options: tokens.join() } ) }/>
				</FormFieldset>
			);
		}

		return null;
	},

	render() {
		const fieldTypes = [ 'name', 'email', 'checkbox', 'dropdown', 'radio', 'text', 'textarea', 'website' ];
		const remove = <Gridicon icon="trash" onClick={ this.props.onRemove } className="editor-contact-form-modal__remove" />;
		return (
			<FoldableCard
				header={ <FieldHeader { ...omit( this.props, [ 'onRemove', 'onUpdate' ] ) } /> }
				icon={ 'pencil' }
				summary={ remove }
				expandedSummary={ remove } >
				<FormFieldset>
					<FormLabel>{ this.translate( 'Field Label' ) }</FormLabel>
					<FormTextInput value={ this.props.label } onChange={ event => this.props.onUpdate( { label: event.target.value } ) } />
				</FormFieldset>

				<FormFieldset>
					<FormLabel>{ this.translate( 'Field Type' ) }</FormLabel>
					<SelectDropdown selectedText={ getLabelForFieldType( this.props.type ) }>
						{ fieldTypes.map( fieldType => (
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
