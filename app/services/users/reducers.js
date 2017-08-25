import { combineReducers } from 'redux'
import {merge} from 'ramda'
import {mergeAndUniq} from '../helpers'

function data (state = {}, {type, payload}) {
		switch (type) {
				case 'fetch_users_success' :
						return merge(state, payload.data)
				default:
						return state
		}
}

function ids (state = [], {type, payload}) {
		switch (type) {
				case 'fetch_users_success' :
						return mergeAndUniq(payload.ids, state)
				default:
						return state
		}
}

function loading (state = false, action) {
		switch (action.type) {
				case 'fetch_users' :
						return true
				case 'fetch_users_error' :
				case 'fetch_users_success' :
						return false
				default:
						return state
		}
}

export default combineReducers({
		data,
		ids,
		loading,
})
