import {or, path, when, isEmpty, always} from 'ramda'
import { OPERATIONS } from '../services/flights/sagas'
import {getRoute} from '../operations/opsReducers'

export const getOperationInfo = (operationName, state, context = []) => {
	const contextObject = when(isEmpty, always({
		inProgress: {},
		failed: {},
		succeed: {},
	}))(path(getRoute(context), state))
	return {
		operation: or(contextObject.inProgress[operationName], {}),
		succeed: or(contextObject.succeed[operationName], false),
		failed: or(contextObject.failed[operationName], false),
		step: or(or(contextObject.inProgress[operationName], {}).step, ''),
		steps: or(OPERATIONS[operationName].steps, {}),
		actions: or(OPERATIONS[operationName].actions, {}),
	}
}

export const triggerAction = (dispatch) => (type, payload) => {
	dispatch({type, payload})
}
