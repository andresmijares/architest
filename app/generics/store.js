import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import opsReducers from '../operations/opsReducers'
import flightSagas from '../services/flights/publicOperations'
const sagaMiddleware = createSagaMiddleware()

const store = createStore(combineReducers({...opsReducers}), compose(
		applyMiddleware(sagaMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

sagaMiddleware.run(flightSagas)

window.store = store
export default store
