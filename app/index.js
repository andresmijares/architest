import 'babel-polyfill'
/* Support for IE11 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
import { OPERATIONS } from './services/flights/sagas'
import { or, equals, isEmpty } from 'ramda'
import { Flights } from './components/Flights'
import { FlightEdition } from './components/FlightEdition'
import { FlowTreeGraph } from './graph/tree'

/*
 * If given more time, this should be separated into different
 * views instead a monolithic component
 * */
class App extends React.PureComponent {
	render () {
		const {dispatch} = this.props
		const {BOOK_FLIGHT, FLIGHT_EDITION} = OPERATIONS
		const triggerAction = (type, payload) => {
			dispatch({type, payload})
		}
		const flightComponent = <Flights
			BOOK_FLIGHT={BOOK_FLIGHT}
			steps={BOOK_FLIGHT.steps}
			locations={this.props.bookFlight.locations}
			succeed={!isEmpty(this.props.bookFlight.succeed)}
			failed={!isEmpty(this.props.bookFlight.failed)}
			step={or(this.props.bookFlight.bookFlightOperation.step, '')}
			operation={this.props.bookFlight.bookFlightOperation}
			triggerAction={triggerAction}/>

		const flightEdition = <FlightEdition
			FLIGHT_EDITION={FLIGHT_EDITION}
			step={or(this.props.flightEdition.flightEditionOperation.step, '')}
			operation={this.props.flightEdition.flightEditionOperation}
			steps={FLIGHT_EDITION.steps}
			triggerAction={triggerAction}/>

		// <FlowTreeGraph step={or(this.props.bookFlight.bookFlightOperation.step, '')} steps={BOOK_FLIGHT.steps}/>
		return (
			<div>
				{flightEdition}
			</div>
		)
	}
}

const mapStateToProps = ({operations}) => {
	const bookFlightOperation = or(operations.inProgress[OPERATIONS.BOOK_FLIGHT.name], {})
	const succeed = or(operations.succeed[OPERATIONS.BOOK_FLIGHT.name], {})
	const failed = or(operations.failed[OPERATIONS.BOOK_FLIGHT.name], {})
	const locations = equals(bookFlightOperation.step, OPERATIONS.BOOK_FLIGHT.steps.SELECT_ORIGIN) ? bookFlightOperation.state.locations : []
	return {
		bookFlight: {
			locations,
			bookFlightOperation,
			succeed,
			failed,
		},
		flightEdition: {
			flightEditionOperation: or(operations.inProgress[OPERATIONS.FLIGHT_EDITION.name], {}),
		},
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
	bookFlight: PropTypes.shape({
		bookFlightOperation: PropTypes.object,
		locations: PropTypes.any,
		succeed: PropTypes.object,
		failed: PropTypes.object,
	}),
	flightEdition: PropTypes.shape({
		flightEditionOperation: PropTypes.object,
	}),

}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)
