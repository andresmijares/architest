import 'babel-polyfill'
/* Support for IE11 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
import { OPERATIONS } from './services/flights/sagas'
import { or, equals } from 'ramda'
import { Flights } from './components/Flights'
import { FlightEdition } from './components/FlightEdition'
import {getOperationInfo, triggerAction} from './containers/helpers'
import { FlowTreeGraph } from './graph/tree'

/*
 * If given more time, this should be separated into different
 * views instead a monolithic component
 * */
class App extends React.PureComponent {
	render () {
		const {dispatch} = this.props
		const {BOOK_FLIGHT, FLIGHT_EDITION} = OPERATIONS
		const flightComponent = <Flights
			BOOK_FLIGHT={BOOK_FLIGHT}
			{...this.props.bookFlight}
			triggerAction={triggerAction(dispatch)}/>

		const flightEdition = <FlightEdition
			FLIGHT_EDITION={FLIGHT_EDITION}
			{...this.props.flightEdition}
			triggerAction={triggerAction(dispatch)}/>

		//{flightComponent}
		return (
			<div>
				{flightEdition}
				<FlowTreeGraph step={or(this.props.bookFlight.step, '')} steps={BOOK_FLIGHT.steps}/>
			</div>
		)
	}
}

const mapStateToProps = ({operations}) => {
	const bookFlightOperation = or(or(operations.inProgress, {})[OPERATIONS.BOOK_FLIGHT.name], {})
	return {
		bookFlight: {
			...getOperationInfo(OPERATIONS.BOOK_FLIGHT.name, operations),
			locations: equals(bookFlightOperation.step, OPERATIONS.BOOK_FLIGHT.steps.SELECT_ORIGIN) ? bookFlightOperation.state.locations : [],
		},
		flightEdition: {
			...getOperationInfo(OPERATIONS.FLIGHT_EDITION.name, operations),
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
		operation: PropTypes.object,
		locations: PropTypes.any,
		succeed: PropTypes.object,
		failed: PropTypes.object,
		step: PropTypes.string,
		steps: PropTypes.string,
	}),
	flightEdition: PropTypes.shape({
		operation: PropTypes.object,
		succeed: PropTypes.object,
		failed: PropTypes.object,
		step: PropTypes.string,
		steps: PropTypes.string,
	}),

}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)
