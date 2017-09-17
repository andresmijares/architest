import {getUsers} from 'data'
import {sagaGenerator, normalize, removeManager} from '../helpers'
import {put, select, fork} from 'redux-saga/effects'
import {matchWithGroups} from '../groups/sagas'
import {curriedValidator as userValidator, addGroupToUser, removeGroupFromUser, updateGroupsWithoutUser} from './helpers'

export const fetch = sagaGenerator('users', 'fetch', getUsers)

/*
* The same pattern will apply for all the services (sagas)
* We bring the current state to the process,
* We make all the modifications we need,
* We change the state.
* --
* Every operation is a pure function so we can test em as a whole.
* We do not test Implementation Details only states based on IO.
* Each service should be very descriptive at the eye.
* */
export function* create ({user}) {
		try {
				yield put({type: 'create_users_start'})
				/* Re-validate if it has at least one group assigned
				* This is also validated in the UI but since we don't have a real Backend here
				* It doesn't hurt to double check,
				* Let's assume that all the groups are in the state... otherwise with more time
				* we could easily make a post request to validate if the group exists
				* */
				const groups = yield select(({groups}) => groups.ids)
				const userValidated = userValidator(groups)(user)
				// const userValidated = userValidator(groups)
				// const validateWithError = pipe(
				// 		userValidated,
				// 		throwIfInvalid, /* side effect goes here */
				// )(user)

				/* Ensure we update the groups as well */
				yield fork(matchWithGroups, user)
				/* if we get here, all good! */
				yield put({
						type: 'create_users_success',
						payload: normalize([userValidated]),
					})
		} catch (error) {
				yield put({type: 'create_users_error', error: error.message})
		}
}

export function* remove ({user}) {
		try {
				yield put({type: 'remove_users_start'})
				const {id, groups} = user

				const state = yield select(({users}) => users)
				const listUpdated = removeManager(state, id)

				/* Remove from user from groups lists */
				yield fork(removeUserFromGroups, groups, id)

				yield put({
						type: 'remove_users_success',
						payload: normalize(Object.values(listUpdated)),
				})
		} catch (error) {
				yield put({type: 'remove_users_error', error: error.message})
		}
}

export function* assignGroup ({user, group}) {
		try {
				yield put({type: 'assignGroup_users_start'})
				const {data} = yield select(({users}) => users)
				const userWithGroup = data[user.id]
				userWithGroup['groups'] = addGroupToUser(userWithGroup['groups'], group['id'])
				/* Ensure we update the groups as well */
				yield fork(matchWithGroups, user)
				yield put({type: 'assignGroup_users_success', payload: normalize([userWithGroup])})
		} catch (error) {
				yield put({type: 'assignGroup_users_error', error: error.message})
		}
}

/* receives a user, find the current state of this user
* modifies the state with the group info
* place it again into the state
* */
export function* removeGroup ({user, group}) {
		try {
				yield put({type: 'removeGroup_users_start'})
				const {data} = yield select(({users}) => users)
				const userWithGroup = Object.assign({}, data[user.id]) /* ensure we preserve this information */

				userWithGroup['groups'] = removeGroupFromUser(userWithGroup['groups'], group.id)

				/* Remove the user from groups lists associated with this user */
				yield fork(removeUserFromGroups, user.groups, user.id)

				/* finish placing the state */
				yield put({type: 'removeGroup_users_success', payload: normalize([userWithGroup])})
		} catch (error) {
				yield put({type: 'removeGroup_users_error', error: error.message})
		}
}
/* groupsList -> a list of groups associated with a user
 * user -> user object
* */
function* removeUserFromGroups (groupsList, user) {
		yield put({type: 'removeUserFromGroups_users_start'})
		const {data} = yield select(({groups}) => groups)
		/* check if the group has users assigned */
		const groupsUpdatedWithoutRemovedUser = updateGroupsWithoutUser(groupsList, data, user)

		yield put({type: 'removeUserFromGroups_users_success', payload: normalize(Object.values(groupsUpdatedWithoutRemovedUser))})
}

