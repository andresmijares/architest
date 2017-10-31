import 'babel-polyfill'
/* Support for IE11 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
import { OPERATIONS } from './services/hotels/sagas'
import { or, equals, isEmpty } from 'ramda'
import { Hotels } from './components/Hotels'
import { Flights } from './components/Flights'
import { FlowTreeGraph } from './graph/tree'

/*
 * If given more time, this should be separated into different
 * views instead a monolithic component
 * */
class App extends React.PureComponent {
	render () {
		const {dispatch} = this.props
		const {BOOK_FLIGHT} = OPERATIONS
		const triggerAction = (type, payload) => {
			dispatch({type, payload})
		}
		const flightComponent = <Flights
			BOOK_FLIGHT={BOOK_FLIGHT}
			steps={BOOK_FLIGHT.steps}
			locations={this.props.locations}
			succeed={!isEmpty(this.props.succeed)}
			failed={!isEmpty(this.props.failed)}
			step={or(this.props.bookFlightOperation.step, '')}
			operation={this.props.bookFlightOperation}
			triggerAction={triggerAction}/>
		return (
			<div>
				{flightComponent}
				<FlowTreeGraph step={or(this.props.bookFlightOperation.step, '')} steps={BOOK_FLIGHT.steps}/>
			</div>
		)
	}
}

const mapStateToProps = ({operations}) => {
	const bookFlightOperation = or(operations.inProgress[OPERATIONS.BOOK_FLIGHT.name], {})
	const succeed = or(operations.succeed[OPERATIONS.BOOK_FLIGHT.name], {})
	const failed = or(operations.failed[OPERATIONS.BOOK_FLIGHT.name], {})
	const bookRoomOperation = or(operations.inProgress[OPERATIONS.BOOK_ROOM.name], {})
	const locations = equals(bookFlightOperation.step, OPERATIONS.BOOK_FLIGHT.steps.SELECT_ORIGIN) ? bookFlightOperation.state.locations : []
	return {
		locations,
		bookFlightOperation,
		bookRoomOperation,
		succeed,
		failed,
	}
}

const AppWithState = connect(mapStateToProps)(App)

const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			<AppWithState />
		</Provider>,
		document.getElementById('app')
	)
}

App.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bookRoomOperation: PropTypes.object,
	bookFlightOperation: PropTypes.object,
	operation: PropTypes.object,
	locations: PropTypes.any,
	succeed: PropTypes.object,
	failed: PropTypes.object,
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)

/**
 const hotelsComponent = <Hotels
 BOOK_ROOM={BOOK_ROOM}
 steps={BOOK_ROOM.steps}
 step={or(this.props.bookRoomOperation.step, '')}
 operation={this.props.bookRoomOperation}
 triggerAction={triggerAction}/>
 **/
