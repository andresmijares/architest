import {call, put} from 'redux-saga/effects'
import {pipe, uniq, curry} from 'ramda'

export const createDictionary = (data = [], init = {}) => {
		return data.reduce((dict, i) => {
				dict[i.id] = i
				return dict
		}, init)
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
