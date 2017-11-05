import {takeEvery, takeLatest} from 'redux-saga/effects'
import * as opsSaga from '../operations/opsSaga'
import * as flightSagas from './flights/sagas'

function* rootSagas () {
		yield [
				takeEvery('start_operation', opsSaga.operationHandler),
				takeLatest(flightSagas.OPERATIONS.BOOK_FLIGHT.name, flightSagas.bookFlightOperation),
				takeLatest(flightSagas.OPERATIONS.FLIGHT_EDITION.name, flightSagas.flightEditionOperation),
		]
}

export default rootSagas
