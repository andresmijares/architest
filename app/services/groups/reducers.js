import { combineReducers } from 'redux'
import {merge} from 'ramda'
import {mergeAndUniq} from '../helpers'

function data (state = {}, {type, payload}) {
		switch (type) {
				case 'fetch_groups_success' :
				case 'create_groups_success' :
				case 'matchWithUsers_groups_success' :
				case 'removeUserFromGroups_users_success' :
						return merge(state, payload.data)
				case 'remove_groups_success' :
						return payload.data
				default:
						return state
		}
}

function ids (state = [], {type, payload}) {
		switch (type) {
				case 'fetch_groups_success' :
				case 'create_groups_success' :
				case 'matchWithUsers_groups_success' :
				case 'removeUserFromGroups_users_success' :
						return mergeAndUniq(payload.ids, state)
				case 'remove_groups_success' :
						return payload.ids
				default:
						return state
		}
}

function loading (state = false, {type}) {
		switch (type) {
				case 'fetch_groups' :
						return true
				case 'fetch_groups_error' :
				case 'fetch_groups_success' :
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
