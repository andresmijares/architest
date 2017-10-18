import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSagas from '../services'
import opsReducers from '../operations/opsReducers'
const sagaMiddleware = createSagaMiddleware()

const store = createStore(combineReducers({...opsReducers}), compose(
		applyMiddleware(sagaMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

sagaMiddleware.run(rootSagas)

window.store = store
export default store
