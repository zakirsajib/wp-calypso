/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import getLabel from './locales';

export default React.createClass( {
	displayName: 'ContactFormDialogFieldHeader',

	propTypes: {
		label: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		options: PropTypes.string,
		required: PropTypes.bool,
	},

	getLegend() {
		if ( this.props.options && typeof this.props.options === 'string' ) {
			const count = this.props.options.split( ',' ).length;

			return this.translate(
				'%(required)s %(type)s with %(numOption)d option',
				'%(required)s %(type)s with %(numOption)d options', {
					count,
					args: {
						required: this.props.required ? this.translate( 'Required' ) : this.translate( 'Optional' ),
						type: getLabel( this.props.type ),
						numOption: count
					}
				} );
		}

		return this.translate( '%(required)s %(type)s', {
			args: {
				required: this.props.required ? this.translate( 'Required' ) : this.translate( 'Optional' ),
				type: getLabel( this.props.type )
			}
		} );
	},

	render() {
		return (
			<div>
				<div>{ this.props.label }</div>
				<div><small>{ this.getLegend() }</small></div>
			</div>
		);
	}
} );
