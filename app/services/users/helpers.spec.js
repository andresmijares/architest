import * as helpers from './helpers'

let user = {
		name: 'Andres',
		lastName: 'Mijares',
		email: 'andresmijares',
		groups: ['1'],
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
})
