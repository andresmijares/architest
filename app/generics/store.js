import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSagas, {reducers} from '../services'
import {errorMiddleware} from 'services/errors/errorMiddleware'
const sagaMiddleware = createSagaMiddleware()

const store = createStore(combineReducers({...reducers}), compose(
		applyMiddleware(sagaMiddleware, errorMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

sagaMiddleware.run(rootSagas)

export default store
