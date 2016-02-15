/**
 * External dependencies
 */
import moment from 'moment';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import warn from 'lib/warn';
import { getLocalForage } from 'lib/localforage';

/**
 * Module variables
 */
const localforage = getLocalForage();
const debug = debugFactory( 'calypso:sync-handler:cache' );
const RECORDS_LIST_KEY = 'records-list';
// set record lifetime to 2 days
const LIFETIME = 1000 * 60 * 60 * 24 * 2;

export class CacheInvalidation {
	getAll( fn = () => {} ) {
		return localforage.getItem( RECORDS_LIST_KEY, fn );
	}

	/**
	 * Add the given `key` into the cache-invalidation object
	 * adding at the same a marktime (now).
	 * If the pair key-mark already exists it will be updated.
	 *
	 * @param {String} key - record key
	 * @return {Promise} promise
	 */
	addItem( key, fn = () => {} ) {
		return this.filterByKey( key, ( err, records = [] ) => {
			debug( 'adding %o', key );

			// add the fresh item into history list
			records.unshift( { key, mark: new Date() } );
			return localforage.setItem( RECORDS_LIST_KEY, records, fn );
		},
		err => {
			fn( err );
		} );
	}

	removeItem( key, fn = () => {} ) {
		return this.filterByKey().then(
			key, records => {
				debug( 'adding %o', key );
				return localforage.setItem( RECORDS_LIST_KEY, records, fn );
			},
			err => {
				fn( err );
			}
		);
	}

	/**
	 * retrieve all records filter by the given key
	 *
	 * @param {String} key - compare records with this key
	 * @param {Function} [fn] - callback function
	 * @return {Promise} promise
	 */
	filterByKey( key, fn = () => {} ) {
		let changed = false;
		return this.getAll().then( records => {
			if ( ! records || ! records.length ) {
				debug( 'No records stored' );
				return fn( null, [] );
			}

			// filter records by the given key
			records = records.filter( item => {
				if ( item.key === key ) {
					debug( '%o exists. Removing ...', key );
					changed = true;
				}
				return item.key !== key;
			} );

			return fn( null, records, changed );
		} );
	}

	/**
	 * Calling this method all records will be removed.
	 * It's a cleaning method and it should be used to re-sync the whole data.
	 */
	clean( fn = () => {} ) {
		localforage.keys( ( err, keys ) => {
			if ( err ) {
				return fn( err );
			}

			keys.forEach( ( key ) => {
				if ( ! ( /^sync-record-\w+$/.test( key ) ) ) {
					return debug( '%o isn\'t a record', key );
				}

				localforage.removeItem( key ).then( () => {
					debug( '%o has been removed', key );
				}, removeErr => {
					if ( removeErr ) {
						return warn( removeErr );
					}
				} );
			} );

			localforage.removeItem( RECORDS_LIST_KEY ).then( () => {
				debug( '%o has been removed', RECORDS_LIST_KEY );
			}, removeListErr => {
				if ( removeListErr ) {
					return warn( removeListErr );
				}
			} );
		} );
	}

	/**
	 * Prune old records depending of the given lifetime
	 *
	 * @param {Number} lifetime - [records] lifetime ( in milliseconds )
	 */
	pruneRecordsFrom( lifetime = LIFETIME ) {
		debug( 'start to prune records older than %sms', lifetime );
		let updateRecords = false;

		this.getAll()
		.then( records => {
			if ( ! records || ! records.length ) {
				return debug( 'Records not found' );
			}

			records = records.filter( item => {
				let reference = +new Date() - lifetime;
				let timeago = moment( item.mark ).from();
				if ( +item.mark < reference ) {
					debug( '%o is too old (%s). Removing ...', item.key, timeago );
					localforage.removeItem( item.key );
					updateRecords = true;
					return false;
				}

				return true;
			} );

			if ( updateRecords ) {
				debug( 'updating cache-invalidation data' );
				return localforage.setItem( RECORDS_LIST_KEY, records );
			}
		} );
	}
}
