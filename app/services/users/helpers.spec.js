import * as helpers from './helpers'
import {removeManager, normalize} from '../helpers'

let user = {
		name: 'Andres',
		lastName: 'Mijares',
		email: 'andresmijares',
		groups: [1],
}

describe('User Service', () => {
		it('Should create a validated user', () => {
				const state = []
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				expect(output).toMatchObject({'name': user.name, 'lastName': user.lastName, 'groups': user.groups})
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
				expect(output).toMatchObject({'name': user.name, 'lastName': user.lastName, 'groups': user.groups})
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
		it('Should remove a group to a user', () => {
				const state = []
				const groupId = '1'
				const curried = helpers.curriedValidator(state)
				const output = curried(user)
				output.groups = helpers.removeGroupFromUser(output['groups'], groupId)
				expect(output.groups).toHaveLength(0)
		})
})
