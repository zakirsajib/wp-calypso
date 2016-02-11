/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import EmptyContent from 'components/empty-content';
import Field from './field';

export default React.createClass( {
	displayName: 'ContactFormDialogFieldList',

	propTypes: {
		fields: PropTypes.array.isRequired,
		onAddNewField: PropTypes.func.isRequired,
		onUpdateField: PropTypes.func.isRequired,
		onRemoveField: PropTypes.func.isRequired
	},

	render() {
		if ( this.props.fields.length > 0 ) {
			return (
				<div className="editor-contact-form-modal__form-fields">
					{ this.props.fields.map( ( field, index ) => {
						const { label, type, options, required } = field;
						return (
							<Field
								key={ index }
								{ ...{ label, type, options, required } }
								onRemove={ () => this.props.onRemoveField( index ) }
								onUpdate={ newField => this.props.onUpdateField( index, newField ) } />
						);
					} ) }
				</div>
			);
		}

		return <EmptyContent
			title={ null }
			line={ this.translate( 'An empty form is no fun!. Go ahead and add some fields!' ) }
			action={ this.translate( 'Add New Field' ) }
			actionCallback={ this.props.onAddNewField }
			isCompact={ true } />
	}
} );
