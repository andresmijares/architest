export const errorMiddleware = store => next => action => {
		if (action.type.substr(-6) === '_error') {
				store.dispatch({type: 'error_message_set', payload: { message: action.error }})
		}
		next(action)
}
