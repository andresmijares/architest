import {takeLatest} from 'redux-saga/effects'
import groups from './groups/reducers'
import users from './users/reducers'
import error from './errors/reducers'

import * as usersServices from './users/sagas'
import * as groupsServices from './groups/sagas'

export const reducers = {
		groups,
		users,
		error,
}

function* rootSagas () {
		yield [
				takeLatest('fetch_users', usersServices.fetch),
				takeLatest('create_users', usersServices.create),
				takeLatest('remove_users', usersServices.remove),
				takeLatest('assignGroup_users', usersServices.assignGroup),
				takeLatest('removeGroup_users', usersServices.removeGroup),
				takeLatest('fetch_groups', groupsServices.fetch),
				takeLatest('create_groups', groupsServices.create),
				takeLatest('remove_groups', groupsServices.remove),
		]
}

export default rootSagas
