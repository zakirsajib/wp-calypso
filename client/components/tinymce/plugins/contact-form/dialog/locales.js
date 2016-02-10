import i18n from 'lib/mixins/i18n'

export const typesLabels = {
	name: () => i18n.translate( 'Name' ),
	email: () => i18n.translate( 'Email Address' ),
	checkbox: () => i18n.translate( 'Checkbox' ),
	dropdown: () => i18n.translate( 'Dropdown' ),
	radio: () => i18n.translate( 'Radio' ),
	text: () => i18n.translate( 'Text' ),
	textarea: () => i18n.translate( 'Text Area' ),
	website: () => i18n.translate( 'Web Address' )
}

export const getLabelForFieldType = fieldType => fieldType in typesLabels
	? typesLabels[fieldType].call()
	: null;

export const tabLabels = {
	fields: () => i18n.translate( 'Form Fields' ),
	settings: () => i18n.translate( 'Settings' )
}

export const getLabelForTab = tab => tab in tabLabels
	? tabLabels[tab].call()
	: null;
