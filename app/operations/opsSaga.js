import { call, cancel, put, take, fork } from 'redux-saga/effects'

export function* operationFLow (flow, operationName, actions, steps, context = []) {
	yield put({type: 'start_operation', payload: {operation: operationName, step: steps.INITIAL, state: {}, context}})
	const task = yield fork(flow, context)
	const action = yield take([actions.success, actions.cancel, actions.failure])
	if (action.type === actions.success) {
		yield put({type: 'success_operation', payload: {context, operation: operationName}})
		if (actions.successHandled) {
			yield take(actions.successHandled)
			return yield put({type: 'clean_success_operation', payload: {context, operation: operationName}})
		} else return
	}

	if (action.type === actions.failure) {
		yield put({type: 'failure_operation', payload: {context, operation: operationName, error: action.payload.error}})
		yield take(actions.failureHandled)
		return yield put({type: 'clean_failure_operation', payload: {context, operation: operationName}})
	}

	if (action.type === actions.cancel) {
		yield cancel(task)
		return yield put({type: 'cancel_operation', payload: {context, operation: operationName}})
	}
}

export const builder = (operation, context = []) => (step, state) => {
	return {
		type: 'update_operation_state',
		payload: {
			context,
			operation,
			state,
			step,
		},
	}
}
