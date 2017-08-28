import {call, put} from 'redux-saga/effects'
import {pipe, uniq, curry} from 'ramda'

export const createDictionary = (data = [], init = {}) => {
		return data.reduce((dict, i) => {
				dict[i.id] = i
				return dict
		}, Object.assign({}, init))
}

const assembleNormalized = (data) => {
		return {
				data,
				ids: Object.keys(data),
		}
}

const merge = curry((a, b) => a.concat(b))

export const mergeAndUniq = (a, b) => {
		return pipe(
				merge(b),
				uniq,
		)(a)
}

export const normalize = pipe(
		createDictionary,
		assembleNormalized,
)

export function sagaGenerator (service, action, callback) {
		return function* ({sec}) {
				try {
						yield put({type: `${action}_${service}_start`})
						const data = yield call(callback, sec)
						/* place it on the state */
						yield put({type: `${action}_${service}_success`, payload: normalize(data)})
				} catch (error) {
						yield put({type: `${action}_${service}_error`, error})
				}
		}
}

export const assignId = (data) => {
		return Object.assign({}, data, {id: uuid()})
}

export const removeManager = ({data, ids}, id) => {
		return ids
		.filter(userId => {
				return String(userId) !== String(id) /* avoid BE ids vs object keys dict */
		})
		.reduce((all, i) => {
				all[i] = data[i]
				return all
		}, {})
}

export function uuid () {
		let i
		let random
		let uuid = ''
		for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0
				if (i === 8 || i === 12 || i === 16 || i === 20) {
						uuid += '-'
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
		}
		return uuid
}
