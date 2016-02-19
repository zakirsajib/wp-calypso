/**
 * External dependencies
 */
import { expect } from 'chai';
import { fromJS } from 'immutable';

/**
 * Internal dependencies
 */
import {
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import reducer, { initialState } from '../reducer';

describe( 'themes-list reducer', () => {
	describe( 'persistence', () => {
		it( 'does not persist data', () => {
			const jsObject = Object.freeze( {
				list: [ 'one', 'two', 'three' ],
				nextId: 2,
				query: {
					search: 'hello',
					perPage: 20,
					page: 1,
					tier: 'all',
					id: 5
				},
				queryState: {
					isLastPage: true,
					isFetchingNextPage: false
				},
				active: 0
			} );
			const state = fromJS( jsObject );
			const persistedState = reducer( state, { type: SERIALIZE } );
			expect( persistedState ).to.eql( initialState );
		} );
		it( 'does not load persisted data', () => {
			const jsObject = Object.freeze( {
				list: [ 'one', 'two', 'three' ],
				nextId: 2,
				query: {
					search: 'hello',
					perPage: 20,
					page: 1,
					tier: 'all',
					id: 5
				},
				queryState: {
					isLastPage: true,
					isFetchingNextPage: false
				},
				active: 0
			} );
			const state = reducer( jsObject, { type: DESERIALIZE } );
			expect( state ).to.eql( initialState );
		} );
	} );
} );
