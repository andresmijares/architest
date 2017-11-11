import {takeEvery} from 'redux-saga/effects'
import * as opsSaga from '../operations/opsSaga'
import {fligthOperations} from '../services/flights/publicOperations'

function* rootSagas () {
		yield [
				takeEvery('start_operation', opsSaga.operationHandler),
				...fligthOperations,
		]
}

export default rootSagas
