import { combineReducers } from 'redux'
import {merge} from 'ramda'
import {mergeAndUniq} from '../helpers'
/*
* This also shares the same patter with the users reducers..
* given more time, a good refactor can be done to create a factory that avoids this code repetition
* if proven both cases can be coupled.
*/
function data (state = {}, {type, payload}) {
		switch (type) {
				case 'fetch_users_success' :
						return merge(state, payload.data)
				case 'create_users_success' :
						return merge(state, payload.data)
				case 'remove_users_success' :
						return payload.data
				case 'assignGroup_users_success' :
						return merge(state, payload.data)
				case 'removeGroup_users_success' :
						return merge(state, payload.data)
				default:
						return state
		}
}

function ids (state = [], {type, payload}) {
		switch (type) {
				case 'fetch_users_success' :
						return mergeAndUniq(payload.ids, state)
				case 'create_users_success' :
						return mergeAndUniq(state, payload.ids)
				case 'remove_users_success' :
						return payload.ids
				case 'assignGroup_users_success' :
						return mergeAndUniq(state, payload.ids)
				case 'removeGroup_users_success' :
						return mergeAndUniq(state, payload.ids)
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
