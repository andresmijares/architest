import {pipe, curry, isNil, difference, identity, ifElse, has, unless} from 'ramda'
import {assignId, mergeAndUniq} from '../helpers'

const throwErrorHere = function ({error}) {
		throw new Error(error.join(', '))
}

const throwIfInvalid = (obj) => {
		return ifElse(({error}) => error, throwErrorHere, identity)(obj)
}

const setError = curry((e, obj) => {
		return Object.assign({}, obj, {
				error: has('error', obj) ? obj.error.concat([e]) : [e],
		})
})

const checkIfItBringsAGroup = (user) => {
		return unless(({groups}) => groups.length > 0, setError('User needs to be associated at least with one group'))(user)
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
			const check = curry((rules, user) => rules.every(rule => {
      return user[rule]
			}))
		return unless(check(rules), setError('Some validation missing.'))(user)
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
				validateAttributes, /* checks the user has all the required props */
				/* validate groups */
				checkIfItBringsAGroup, /* This is sample of a Business rule that tricky users can avoid if we rely on on the UI validation */
				ensureGroupsIdsAreIntegers, /* sometime due to UI management they can be strings (coming from object keys) */
				checkIfGroupIsValid(state), /* this check if the group exists on the stage... this could be extended to the BE as well */
				/* all went good, assign an id */
				assignId,
				throwIfInvalid,
		)
}

/* Since a few nice validations are against the state to protect the store
* we pre-add the state for convenience in the future
* this make testing way easier cause we can mock the state in the shape we want to.
* */
export const curriedValidator = curry(userValidator)

