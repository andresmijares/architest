import * as helpers from './helpers'
import {removeManager, normalize} from '../helpers'

let user = {
		name: 'Andres',
		email: 'andresmijares',
		groups: [1, 2],
}

describe('User Service', () => {
		it('Should create a validated user', () => {
				const state = []
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				expect(output).toMatchObject({'name': user.name, 'groups': user.groups})
		})
		it('Should Throw if not valid', () => {
				const unvalidUser = Object.assign({}, user, {groups: []})
				const state = []
				const curried = helpers.curriedValidator(state)
				expect(function () {
						curried(unvalidUser)
				}).toThrowError('User needs to be associated at least with one group')
		})
		it('Should remove a user', () => {
				const state = []
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				const id = output['id']
				expect(output).toMatchObject({'name': user.name, 'groups': user.groups})
				const updateState = normalize([output])
				const removedUser = removeManager(updateState, id)
				expect(removedUser).toEqual({})
		})
		it('Should add a group to a user', () => {
				const state = []
				const groupId = '3'
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				output.groups = helpers.addGroupToUser(output['groups'], groupId)
				expect(output.groups).toContain(3)
		})
		it('Should remove a group from a user', () => {
				const state = []
				const groupId = '1'
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				output.groups = helpers.removeGroupFromUser(output['groups'], groupId)
				expect(output.groups).toHaveLength(1)
		})
		it('Should remove an user from the groups assigned', () => {
				/* Create the user */
				const mockGroup = {
						1: {
								name: 'Pizza',
								id: 1,
								users: [1, 2, 3],
						},
						2: {
								name: 'Beer',
								id: 2,
								users: [1],
						},
				}
				const state = []
				const curried = helpers.curriedValidator(state)
				let userCreatedState = curried(user)
				userCreatedState = normalize([userCreatedState])
				/* it already has group with id 1 */
				/* remove the user */
				removeManager(userCreatedState, 1)
				/* remove groups */
				expect(mockGroup[1].users).toEqual([1, 2, 3])
				const groupWithOutUser = helpers.updateGroupsWithoutUser(user.groups, mockGroup, 1)
				expect(groupWithOutUser[1].users).toEqual([2, 3])
				expect(groupWithOutUser[2].users).toEqual([])
		})
})
