import { call, cancel, put, take, fork } from 'redux-saga/effects'
import { isNil } from 'ramda'

export const OPERATIONS = {
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

const cancelOperation = (operation) => ({
	type: 'cancel_operation',
	payload: {operation},
})

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
