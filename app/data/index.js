import {splitEvery} from 'ramda'
import {groups, users} from './mocks'
export {
		groups,
		users,
}

function apiHelper (range, obj) {
				return function (sec = 0) {
						return new Promise(resolve => {
								setTimeout(() => { resolve(splitEvery(range, obj)[sec]) }, 1)
						})
				}
}

export const getUsers = apiHelper(5, users)
export const getGroups = apiHelper(3, groups)

// export function getUsers (sec = 0) {
// 		const range = 5
// 		return new Promise(resolve => {
// 				setTimeout(() => { resolve(splitEvery(range, users)[sec]) }, 1)
// 		})
// }
//
// export function getGroups (sec = 0) {
// 		const range = 5
// 		return new Promise(resolve => {
// 				setTimeout(() => { resolve(splitEvery(range, groups)[sec]) }, 1)
// 		})
// }

