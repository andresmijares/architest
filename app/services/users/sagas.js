import {getUsers} from 'data'
import {sagaGenerator} from '../helpers'

/*
* This is not an atomic service,
* it's meant it does destroy the state but add/update and persist records
* This come handy when we need to use pagination
* */

/* params {
		@ Int => Indicate a sequence to support pagination in case it's available
 */

export const fetch = sagaGenerator('users', 'fetch', getUsers)

// export function* fetch ({sec}) {
// 		try {
// 				yield put({type: 'fetch_users_start'})
// 				const users = yield call(getUsers, sec)
// 				/* place it on the state */
// 				yield put({type: 'fetch_users_success', payload: normalize(users)})
// 		} catch (error) {
// 				yield put({type: 'fetch_users_error', error})
// 		}
// }
