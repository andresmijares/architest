import { call, cancel, put, take, fork } from 'redux-saga/effects'
import { isNil } from 'ramda'

export const OPERATIONS = {
	BOOK_ROOM: {
		name: 'BOOK_ROOM',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_DATES: 'SELECT_DATES',
			SELECT_PLACE: 'SELECT_PLACE',
			ROOM_CONFIRMATION: 'ROOM_CONFIRMATION',
		},
		cancelAction: 'BOOK_ROOM_CANCEL',
	},
	BOOK_FLIGHT: {
		name: 'BOOK_FLIGHT',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_DATES: 'SELECT_DATES',
			SELECT_ORIGIN: 'SELECT_ORIGIN',
			SELECT_DESTINATION: 'SELECT_DESTINATION',
			FLIGHT_CONFIRMATION: 'FLIGHT_CONFIRMATION',
		},
		actions: {
			cancel: 'BOOK_FLIGHT_CANCEL',
			success: 'BOOK_FLIGHT_SUCCESS',
			failure: 'BOOK_FLIGHT_FAILURE',
			failureHandled: 'BOOK_FLIGHT_FAILURE_HANDLED',
			successHandled: 'BOOK_FLIGHT_SUCCESS_HANDLED',
		},
	},
	ROOM_EDITION: {
		name: 'ROOM_EDITION',
		steps: {
			INITIAL: 'INITIAL',
			ASSIGNATION: 'ASSIGNATION',
			AMENITIES: 'AMENITIES',
		},
		cancelAction: 'ROOM_EDITION_CANCEL',
		successAction: 'ROOM_EDITION_SUCCESS',
	},
}

const builder = (operation) => (step, state) => ({
	type: 'update_operation_state',
	payload: {
		operation,
		state,
		step,
	},
})

const cancelOperation = (operation) => ({
	type: 'cancel_operation',
	payload: {operation},
})

export function* bookRoom () {
	try {
		const {BOOK_ROOM} = OPERATIONS
		const {cancelAction, steps} = BOOK_ROOM
		const cancelBookRoom = cancelOperation(BOOK_ROOM.name)
		const updateState = builder(BOOK_ROOM.name)

		yield put({
			type: 'start_operation',
			payload: {
				operation: BOOK_ROOM.name,
				step: BOOK_ROOM.steps.INITIAL,
				state: {},
			},
		})

		const firstStep = yield take([steps.SELECT_DATES, cancelAction])
		if (firstStep.type === cancelAction) {
			return yield put(cancelBookRoom)
		}
		yield put(updateState(BOOK_ROOM.steps.SELECT_DATES, {id: 10101}))

		const secondStep = yield take([steps.SELECT_PLACE, cancelAction])
		if (secondStep.type === cancelAction) {
			return yield put(cancelBookRoom)
		}
		yield put(updateState(BOOK_ROOM.steps.SELECT_PLACE, {name: 'Operation state updated'}))

		const completionStep = yield take([steps.ROOM_CONFIRMATION, cancelAction])
		if (!isNil(completionStep.cancel)) {
			return yield put(cancelBookRoom)
		}
		yield put({type: 'success_operation', payload: {operation: BOOK_ROOM.name}})
	} catch (error) {
		return {
			error,
		}
	}
}

const LocationService = {
	// getLocations: () => ({res: ['Awesome Places', 'Awesome Locations']}),
	getLocations: () => ({error: ['Something Happened :(']}),
}

export function* bookFlight () {
	try {
		const {BOOK_FLIGHT} = OPERATIONS
		const {steps} = BOOK_FLIGHT
		const updateState = builder(BOOK_FLIGHT.name)

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_DATES, {}))
		yield take(steps.SELECT_DATES)

		const locations = yield call(LocationService.getLocations)
		if (locations.error) {
			return yield put({type: BOOK_FLIGHT.actions.failure, payload: {error: locations.error}})
		}

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_ORIGIN, {locations: locations.res}))
		yield take(steps.SELECT_ORIGIN)

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_DESTINATION, {origin: 'Toronto'}))
		yield take(steps.SELECT_DESTINATION)

		yield put(updateState(BOOK_FLIGHT.steps.FLIGHT_CONFIRMATION, {destination: 'Buenos Aires'}))
		yield take(steps.FLIGHT_CONFIRMATION)

		yield put({type: BOOK_FLIGHT.actions.success, payload: {}})
	} catch (error) {
			yield put({type: OPERATIONS.BOOK_FLIGHT.actions.failure, payload: {error: 'UNHANDLED ERROR !!!!'}})
	}
}

export function* cancellableFLow (flow, operationName, actions, steps) {
	yield put({type: 'start_operation', payload: {operation: operationName, step: steps.INITIAL, state: {}}})
	const task = yield fork(flow)
	const action = yield take([actions.success, actions.cancel, actions.failure])
	if (action.type === actions.success) {
		yield put({type: 'success_operation', payload: {operation: operationName}})
		if (actions.successHandled) {
			yield take(actions.successHandled)
			return yield put({type: 'clean_success_operation', payload: {operation: operationName}})
		} else return
	}

	if (action.type === actions.failure) {
		yield put({type: 'failure_operation', payload: {operation: operationName, error: action.payload.error}})
		yield take(actions.failureHandled)
		return yield put({type: 'clean_failure_operation', payload: {operation: operationName}})
	}

	if (action.type === actions.cancel) {
		yield cancel(task)
		return yield put({type: 'cancel_operation', payload: {operation: operationName}})
	}
}

export function * cancellableFLowBookFlight () {
	const {BOOK_FLIGHT} = OPERATIONS
	yield cancellableFLow(bookFlight, BOOK_FLIGHT.name, BOOK_FLIGHT.actions, BOOK_FLIGHT.steps)
}
/**
 * Edit book supports, guest assignation and room amenities
 * @return {*}
 */
export function* editHotel () {
	try {
		const {ROOM_EDITION} = OPERATIONS
		const cancelBookRoom = cancelOperation(ROOM_EDITION.name)

		yield put({
			type: 'start_operation',
			payload: {
				operation: ROOM_EDITION.name,
				step: ROOM_EDITION.steps.INITIAL,
			},
		})

		while (true) {
			const action = (step, action) => take([
				ROOM_EDITION.successAction,
				ROOM_EDITION.cancelAction,
				ROOM_EDITION.steps.ASSIGNATION,
				ROOM_EDITION.steps.AMENITIES])

			if (action.type === ROOM_EDITION.steps.ASSIGNATION) {
				yield put({type: 'success_operation', payload: {operation: ROOM_EDITION.name}})
			}

			if (action.type === ROOM_EDITION.steps.AMENITIES) {
				yield put({type: 'success_operation', payload: {operation: ROOM_EDITION.name}})
			}

			if (action.type === ROOM_EDITION.cancelAction) {
				return yield put(cancelBookRoom)
			}

			if (action.type === ROOM_EDITION.successAction) {
				return yield put({type: 'success_operation', payload: {operation: ROOM_EDITION.name}})
			}
		}
	} catch (error) {
		return {
			error,
		}
	}
}
