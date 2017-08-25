import {splitEvery} from 'ramda'

export function getUsers (sec = 0) {
		const range = 5
		return new Promise(resolve => {
				setTimeout(() => { resolve(splitEvery(range, users)[sec]) }, 1)
		})
}

export function getGroups () {
		return new Promise(resolve => {
				setTimeout(() => { resolve(groups) }, 1)
		})
}

var users = [
		{
				name: 'Andres Mijares',
				id: 1,
				groups: [1, 2],
		},
		{
				name: 'Grace Mijares',
				id: 2,
				groups: [1],
		},
		{
				name: 'Karen Serfaty',
				id: 3,
				groups: [2],
		},
		{
				name: 'Grace Mijares',
				id: 4,
				groups: [1],
		},
		{
				name: 'Karen Serfaty',
				id: 5,
				groups: [2],
		},
		{
				name: 'Grace Mijares',
				id: 6,
				groups: [1],
		},
		{
				name: 'Karen Serfaty',
				id: 7,
				groups: [2],
		},
		{
				name: 'Karen Serfaty',
				id: 8,
				groups: [2],
		},
		{
				name: 'Grace Mijares',
				id: 9,
				groups: [1],
		},
		{
				name: 'Karen Serfaty',
				id: 10,
				groups: [2],
		},
		{
				name: 'Karen Serfaty',
				id: 11,
				groups: [2],
		},
		{
				name: 'Grace Mijares',
				id: 12,
				groups: [1],
		},
		{
				name: 'Karen Serfaty',
				id: 13,
				groups: [2],
		},
]

var groups = [
		{
				name: 'Pizza',
				id: 1,
		},
		{
				name: 'Beer',
				id: 2,
		},
]
