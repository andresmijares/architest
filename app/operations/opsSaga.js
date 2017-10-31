import {OPERATIONS} from './opsReducers'
import { put, select, race, takeEvery } from 'redux-saga/effects'
import { isNil } from 'ramda'

export function* operationHandler () {
	yield takeEvery('start_operation', function* handler (action) {
		if (action.payload.operation === OPERATIONS.CREATE_SHIFT.name) {
			const {error, data, cancelled} = yield createShiftHandler(action)
			if (!isNil(cancelled)) {
				yield put({
					type: 'cancel_operation',
					payload: action.payload,
				})
			}
			if (!isNil(error)) {
				yield put({
					type: 'failed_operation',
					payload: {
						...action.payload,
						error,
					},
				})
			} else {
				yield put({
					type: 'UPDATE_APP_STORE_OR_DO_THINGS',
					payload: data,
				})
				yield put({
					type: 'success_operation',
					payload: action.payload,
				})
			}
		}
	})
}

export function* returnAction (action) {
	return yield action
}

export function* handleStep (step) {
	while (true) {
		const cancel = yield takeEvery('operation_step', returnAction)
		if (cancel.payload !== undefined && cancel.payload.step === step) {
			return yield cancel
		}
	}
}

export function* cancelHandler (type) {
	while (true) {
		const cancel = yield takeEvery('cancel_operation', returnAction)
		if (cancel.payload.operation === type) {
			return yield cancel
		}
	}
}

function* createShiftHandler () {
	try {
		const {steps, cancelAction} = OPERATIONS.CREATE_SHIFT
		let stepResult = yield race({
			task: yield handleStep(steps.SELECT_GROUP, returnAction),
			cancel: yield cancelHandler(cancelAction),
		})

		if (stepResult.type === cancelAction) {
			return {
				cancelled: {},
			}
		}
		stepResult = yield race({
			task: yield handleStep(steps.SET_INFO, returnAction),
			cancel: yield cancelHandler(cancelAction),
		})
		if (stepResult.type === cancelAction) {
			return {
				cancelled: {},
			}
		}
		return {data: 'RESPONSE'}
	} catch (e) {
		return {
			error: {
				type: 'UNHANDLED HANDLER ERROR',
				info: e,
			},
		}
	}
}
