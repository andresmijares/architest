function error (state = false, {type, payload}) {
		switch (type) {
				case 'error_message_set' :
						return payload['message']
				case 'error_message_dismiss' :
						return false
				default:
						return state
		}
}

export default error
