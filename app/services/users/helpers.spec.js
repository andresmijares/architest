import * as helpers from './helpers'
import {removeManager, normalize} from '../helpers'

let user = {
		name: 'Andres',
		email: 'andresmijares',
		groups: [1, 2],
}

function createUser (state) {
		return function (user) {
				return helpers.curriedValidator(state)(user)
		}
}

function removeUser (state) {
		return function (userId) {
				let nextState = normalize(state)
				return removeManager(nextState, userId)
		}
}

/* Test asserts pure functions IO
* This helps to do integration tests way faster than testing the redux store action dispatches
* this way we can keep all the business logic separated from the state manager
* and orchestrated by redux-saga
* */
describe('User Service', () => {
		it('Should create a validated user', () => {
				const state = [1, 2]
				const output = createUser(state)(user)
				expect(output).toMatchObject({'name': user.name, 'groups': user.groups})
		})
		it('Should Throw if not valid or missing name', () => {
				const unvalidUser = Object.assign({}, {groups: [1]})
				const state = []
				const output = createUser(state)
				expect(function () {
						output(unvalidUser)
				}).toThrowError('Some validation missing.')
		})
		it('Should Throw if not valid', () => {
				const unvalidUser = Object.assign({}, user, {groups: []})
				const state = []
				const output = createUser(state)
				expect(function () {
						output(unvalidUser)
				}).toThrowError('User needs to be associated at least with one group')
		})
		it('Should Throw if one group is not valid', () => {
				const invalid = Object.assign({}, user)
				const state = [1]
				const output = createUser(state)
				expect(function () {
						output(invalid)
				}).toThrowError(`You tried to create an user assigned to following invalid groups ids 2`)
		})
		it('Should Throw if not valid', () => {
				const unvalidUser = Object.assign({}, user, {groups: []})
				const state = []
				const output = createUser(state)
				expect(function () {
						output(unvalidUser)
				}).toThrowError('User needs to be associated at least with one group')
		})
		it('Should remove a user', () => {
				const state = []
				const output = createUser(state)(user)
				const id = output['id']
				expect(output).toMatchObject({'name': user.name, 'groups': user.groups})
				const removedUser = removeUser([output])(id)
				expect(removedUser).toEqual({})
		})
		it('Should assign a group to a user', () => {
				const state = []
				const groupId = '3'
				const output = createUser(state)(user)
				output.groups = helpers.addGroupToUser(output['groups'], groupId)
				expect(output.groups).toContain(3)
		})
		it('Should remove a group from a user', () => {
				const state = []
				const groupId = 1
				const output = createUser(state)(user)
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
				let userCreatedState = createUser(state)(user)
				userCreatedState = normalize([userCreatedState])
				/* it already has group with id 1 */
				/* remove the user */
				removeUser([userCreatedState])(1)
				/* remove groups */
				expect(mockGroup[1].users).toEqual([1, 2, 3])
				const groupWithOutUser = helpers.updateGroupsWithoutUser(user.groups, mockGroup, 1)
				expect(groupWithOutUser[1].users).toEqual([2, 3])
				expect(groupWithOutUser[2].users).toEqual([])
		})
})
