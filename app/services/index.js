import {takeEvery, takeLatest} from 'redux-saga/effects'
import * as opsSaga from '../operations/opsSaga'
import * as hotelSagas from './hotels/sagas'

function* rootSagas () {
		yield [
				takeEvery('start_operation', opsSaga.operationHandler),
				takeLatest(hotelSagas.OPERATIONS.BOOK_ROOM.name, hotelSagas.bookRoom),
				takeLatest(hotelSagas.OPERATIONS.BOOK_FLIGHT.name, hotelSagas.cancellableFLowBookFlight),
		]
}

export default rootSagas
