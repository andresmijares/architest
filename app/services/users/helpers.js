import {pipe, curry, isNil, difference} from 'ramda'
import {assignId, mergeAndUniq} from '../helpers'

const checkIfItBringsAGroup = (user) => {
		if (user.groups.length > 0) {
				return user
		}
		throw new Error('User needs to be associated at least with one group')
}

const checkIfInState = (a, state) => a.every(i => state.indexOf(i) !== -1)

const checkIfGroupIsValid = curry((state, user) => {
		if (checkIfInState(user.groups, state)) {
				return user
		} else if (state.length < 1) {
				return user /* for testing only... offline capability maybe ? */
		}
		if (difference(user.groups, state).length > 0) {
				throw new Error(`You tried to create an user assigned to following invalid groups ids ${difference(user.groups, state).join(' ,')}`)
		} else {
				throw new Error('One of more groups associated do not exists.')
		}
})

const ensureGroupsIdsAreIntegers = (user) => {
		const groups = user.groups || []
		return Object.assign({}, user, {
				groups: groups.map(id => parseInt(id)),
		})
}

const validateAttributes = (user) => {
			/* the rules are hardcoded but they should not, a config file would be good... #yolo */
			const rules = ['name']
			const check = rules.every(rule => {
      return user[rule]
			})
			if (check) {
				return user
			} else {
					/* with more time we can make a different logic to return which prop is missing */
    throw new Error('Some validation missing.')
			}
}

export const addGroupToUser = (arr, id) =>
		mergeAndUniq(arr, [parseInt(id)]).sort()

export const removeGroupFromUser = (arr, id) =>
		arr.filter(groupId => groupId !== id).sort()

/*
	groupsList: Array of the groups that user had
	state: current groups state
	user: user ID
*/
export const updateGroupsWithoutUser = (userGroups, state, user) =>
		userGroups
		.filter(g => !isNil(state[g].users))
		.reduce((all, group) => {
				all[group].users = all[group].users.filter(g => g !== parseInt(user))
				return all
		}, Object.assign({}, state))

/* More validation can be added in the future */
const userValidator = (state) => {
		return pipe(
				/* validate rules (attributes) */
				validateAttributes,
				/* validate groups */
				ensureGroupsIdsAreIntegers, /* sometime due to UI management they can be strings (coming from object keys) */
				checkIfItBringsAGroup,
				checkIfGroupIsValid(state),
				/* all went good, assign an id */
				assignId,
		)
}

/* Since a few nice validations are against the state to protect the store
* we pre-add the state for convenience in the future
* this make testing way easier cause we can mock the state in the shape we want to.
* */
export const curriedValidator = curry(userValidator)
