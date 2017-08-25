import {takeLatest} from 'redux-saga/effects'
import groups from './groups/reducers'
import users from './users/reducers'
import error from './errors/reducers'

import * as usersServices from './users/sagas'

export const reducers = {
		groups,
		users,
		error,
}

function* rootSagas () {
		yield [
				takeLatest('fetch_users', usersServices.fetch),
		]
}

export default rootSagas
