import * as helpers from './helpers'
import {users} from 'data'
import {merge} from 'ramda'

const first = {
		1: {
				name: 'Andres Mijares',
				id: 1,
				groups: [1, 2],
		},
		2: {
				name: 'Grace Mijares',
				id: 2,
				groups: [1],
		},
		3: {
				name: 'Karen Serfaty',
				id: 3,
				groups: [2],
		},
}
const second = {
		4: {
				name: 'Grace Mijares',
						id: 4,
				groups: [1],
		},
		5: {
				name: 'Karen Serfaty',
						id: 5,
				groups: [2],
		},
		6: {
				name: 'Grace Mijares',
						id: 6,
				groups: [1],
		},
}

describe('Service Generics Helpers', () => {
		describe('Reducers Helpers / Normalizers', () => {
				it('should create a dictionary given a collection based on ID', () => {
						const input = users.slice(0, 3)
						const output = helpers.createDictionary(input)
						expect(output).toEqual(first)
				})
				it('should persist data when called with an init value', () => {
						const one = users.slice(0, 3)
						const two = users.slice(3, 6)
						const prev = helpers.createDictionary(one)
						const output = helpers.createDictionary(two, prev)
						const expected = merge(first, second)
						expect(output).toEqual(expected)
				})
				it('should keep unique values when merge 2 arrays', () => {
						const output = helpers.mergeAndUniq([1, 2, 3], [2, 4, 6, 5])
						const expected = [1, 2, 3, 4, 5, 6]
						expect(output.sort()).toEqual(expected)
				})
				it('should normalize a collection', () => {
						const output = helpers.normalize(users.slice(0, 3))
						const expected = Object.assign({}, {
								data: first,
								ids: Object.keys(first),
						})
						expect(output).toEqual(expected)
				})
		})
})
