import {pipe, curry, has} from 'ramda'
import {assignId, mergeAndUniq} from '../helpers'

const checkIfItBringsAGroup = (user) => {
		if (user.groups.length > 0) {
				return user
		}
		throw new Error('User needs to be associated at least with one group')
}

const checkIfGroupIsValid = curry((state, user) => {
		if (has(user.groups, state)) {
				return user
		} else if (state.length < 1) {
				return user /* for testing only... offline capability maybe ? */
		}
		throw new Error('One of more groups associated do not exists.')
})

const validateAttributes = (user) => {
			/* the rules are hardcoded but they should not, a config file would be good... #yolo */
			const rules = ['name', 'lastName', 'email']
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
		arr.filter(groupId => groupId !== parseInt(id)).sort()

/* More validation can be added in the future */
const userValidator = (state) => {
		return pipe(
				/* validate rules (attributes) */
				validateAttributes,
				/* validate groups */
				checkIfItBringsAGroup,
				checkIfGroupIsValid(state),
				/* all went good, assign an id */
				assignId,
		)
}

export const curriedValidator = curry(userValidator)
