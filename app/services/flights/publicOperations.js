import { bookFlight, editFlight, OPERATIONS } from './sagas'
import { takeLatest } from 'redux-saga/effects'
import { operationFLow } from '../../operations/opsSaga'

export function * bookFlightOperation () {
	const {BOOK_FLIGHT} = OPERATIONS
	yield operationFLow(bookFlight, BOOK_FLIGHT.name, BOOK_FLIGHT.actions, BOOK_FLIGHT.steps)
}
export function * flightEditionOperation () {
	const {FLIGHT_EDITION} = OPERATIONS
	yield operationFLow(editFlight, FLIGHT_EDITION.name, FLIGHT_EDITION.actions, FLIGHT_EDITION.steps)
}

function* publicSagas () {
	yield [
		takeLatest(OPERATIONS.BOOK_FLIGHT.name, bookFlightOperation),
		takeLatest(OPERATIONS.FLIGHT_EDITION.name, flightEditionOperation),
	]
}

export default publicSagas
