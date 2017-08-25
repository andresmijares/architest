import { combineReducers } from 'redux'

function data (state = {}, action) {
		switch (action.type) {
				default:
						return state
		}
}

function ids (state = [], action) {
		switch (action.type) {
				default:
						return state
		}
}

function loading (state = false, action) {
		switch (action.type) {
				default:
						return state
		}
}

export default combineReducers({
		data,
		ids,
		loading,
})
