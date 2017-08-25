import {getGroups} from 'data'
import {sagaGenerator} from '../helpers'

/*
	* This is not an atomic service,
	* it's meant it does destroy the state but add/update and persist records
	* This come handy when we need to use pagination
	* */

/* params {
	@ Int => Indicate a sequence to support pagination in case it's available
	*/
export const fetch = sagaGenerator('groups', 'fetch', getGroups)

// export function* fetch ({sec}) {
// 		try {
// 				yield put({type: 'fetch_groups_start'})
// 				const users = yield call(getGroups, sec)
// 				/* place it on the state */
// 				yield put({type: 'fetch_groups_success', payload: normalize(users)})
// 		} catch (error) {
// 				yield put({type: 'fetch_groups_error', error})
// 		}
// }

