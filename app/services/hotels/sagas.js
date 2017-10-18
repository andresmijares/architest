import { race, cancel, put, take, fork } from 'redux-saga/effects'
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
		cancelAction: 'BOOK_FLIGHT_CANCEL',
		successAction: 'BOOK_FLIGHT_SUCCESS',
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

const builder = (operation, state, step) => ({
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
		yield put(builder(BOOK_ROOM.name, {id: 10101}, BOOK_ROOM.steps.SELECT_DATES))

		const secondStep = yield take([steps.SELECT_PLACE, cancelAction])
		if (secondStep.type === cancelAction) {
			return yield put(cancelBookRoom)
		}
		yield put(builder(BOOK_ROOM.name, {name: 'Operation state updated'}, BOOK_ROOM.steps.SELECT_PLACE))

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

export function * cancellableFLowBookFlight () {
	const {BOOK_FLIGHT} = OPERATIONS
	yield cancellableFLow(bookFlight, BOOK_FLIGHT.name, BOOK_FLIGHT.successAction, BOOK_FLIGHT.cancelAction)
}

export function* bookFlight () {
	try {
		const {BOOK_FLIGHT} = OPERATIONS
		const {steps} = BOOK_FLIGHT

		yield put({
			type: 'start_operation',
			payload: {
				operation: BOOK_FLIGHT.name,
				step: BOOK_FLIGHT.steps.INITIAL,
				state: {},
			},
		})

		yield take(steps.SELECT_DATES)
		yield put(builder(BOOK_FLIGHT.name, {id: 10101}, BOOK_FLIGHT.steps.SELECT_DATES))

		yield take(steps.SELECT_ORIGIN)
		yield put(builder(BOOK_FLIGHT.name, {origin: 'Toronto'}, BOOK_FLIGHT.steps.SELECT_ORIGIN))

		yield take(steps.SELECT_DESTINATION)
		yield put(builder(BOOK_FLIGHT.name, {destination: 'Buenos Aires'}, BOOK_FLIGHT.steps.SELECT_DESTINATION))

		yield take(steps.FLIGHT_CONFIRMATION)

		yield put({type: BOOK_FLIGHT.successAction, payload: {}})
	} catch (error) {
		return {
			error,
		}
	}
}

export function* cancellableFLow (flow, operationName, successAction, cancelAction) {
	const task = yield fork(flow)
	const action = yield take([successAction, cancelAction])
	if (action.type === cancelAction) {
		yield cancel(task)
		return yield put({type: 'cancel_operation', payload: {operation: operationName}})
	}
	if (action.type === successAction) {
		return yield put({type: 'success_operation', payload: {operation: operationName}})
	}
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
