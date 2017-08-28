import {assignId, mergeAndUniq} from '../helpers'
import {pipe, isNil} from 'ramda'

export const validateGroup = pipe(
		/* any other validation should be added here */
		assignId,
)

export const assingUsersToGroup = (group, users) => {
		return Object.assign({}, group, {
				users,
		})
}

export const matchWithGroupsHelper = (user, groups) => user
		.groups
		.filter((g) => !isNil(groups.data[g].users))
		.map(n => {
				return Object.assign({}, groups.data[n])
		})
		.map(f => {
				f.users = mergeAndUniq(f.users, [user.id])
				return f
		})
