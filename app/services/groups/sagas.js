import {getGroups} from 'data'
import {sagaGenerator, normalize, removeManager} from '../helpers'
import {put, select} from 'redux-saga/effects'
import {validateGroup} from './helpers'

export const fetch = sagaGenerator('groups', 'fetch', getGroups)

export function* create ({group}) {
		try {
				yield put({type: 'create_groups_start'})
				const groupValidated = validateGroup(group)
				/* if we get here, all good! */
				yield put({
						type: 'create_groups_success',
						payload: normalize([groupValidated]),
				})
		} catch (error) {
				yield put({type: 'create_groups_error', error: error.message})
		}
}

export function* remove ({group}) {
		try {
				yield put({type: 'remove_groups_start'})
				const {id} = group
				const state = yield select(({groups}) => groups)
				const listUpdated = removeManager(state, id)
				yield put({
						type: 'remove_groups_success',
						payload: normalize(Object.values(listUpdated)),
				})
		} catch (error) {
				yield put({type: 'remove_groups_error', error: error.message})
		}
}
