/**
 * Internal dependencies
 */
import config from 'config';
import userFactory from 'lib/user';;
import { navigation, siteSelection } from 'my-sites/controller';
import { singleSite, multiSite, loggedOut, details } from './controller';

const user = userFactory();

const isLoggedIn = !! user.get();
const routes = isLoggedIn
	? {
		'/design': [ multiSite, navigation, siteSelection ],
		'/design/:site_id': [ singleSite, navigation, siteSelection ],
		'/design/type/:tier': [ multiSite, navigation, siteSelection ],
		'/design/type/:tier/:site_id': [ singleSite, navigation, siteSelection ],
	}
	: {
		'/design': [ loggedOut ],
		'/design/type/:tier': [ loggedOut ]
	};

export default function( router ) {
	console.log( 'route' );
	if ( config.isEnabled( 'manage/themes' ) ) {
		// Does iterating over Object.keys preserve order? If it doesn't, use lodash's mapValues
		Object.keys( routes ).forEach( route => {
			router( route, ...routes[ route ] );
		} )
	}
	if ( config.isEnabled( 'manage/themes/details' ) ) {
		router( '/themes/:slug/:site_id?', details );
	}
};
