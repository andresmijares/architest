import {or, path} from 'ramda'
import { OPERATIONS } from '../services/flights/sagas'

export const getOperationInfo = (operationName, state, context = []) => {
	const opPath = [...context, operationName]
	const operation = or(path(opPath, state.inProgress), {})
	return {
		operation,
		succeed: or(path(opPath, state.succeed), false),
		failed: or(path(opPath, state.failed), false),
		step: or(operation.step, ''),
		steps: or(OPERATIONS[operationName].steps, {}),
		actions: or(OPERATIONS[operationName].actions, {}),
	}
}

export const triggerAction = (dispatch) => (type, payload) => {
	dispatch({type, payload})
}
