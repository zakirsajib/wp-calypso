import i18n from 'lib/mixins/i18n'

const labels = {
	name: () => i18n.translate( 'Name' ),
	email: () => i18n.translate( 'Email Address' ),
	checkbox: () => i18n.translate( 'Checkbox' ),
	select: () => i18n.translate( 'Dropdown' ),
	radio: () => i18n.translate( 'Radio' ),
	text: () => i18n.translate( 'Text' ),
	textarea: () => i18n.translate( 'Text Area' ),
	url: () => i18n.translate( 'Web Address' )
}

export default function ( type ) {
	return type in labels
		? labels[type].call()
		: null;
}
