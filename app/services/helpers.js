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
