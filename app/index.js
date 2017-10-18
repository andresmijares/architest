import 'babel-polyfill'
/* Support for IE11 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
import { OPERATIONS } from './services/hotels/sagas'
import { or } from 'ramda'
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
			const {BOOK_ROOM, BOOK_FLIGHT} = OPERATIONS
		const {operation} = this.props
		const {step} = or(operation, {})
		const triggerAction = (type, payload) => dispatch({type, payload})
		return (
			<div>
			<Hotels
				BOOK_ROOM={BOOK_ROOM}
				steps={BOOK_ROOM.steps}
				step={or(this.props.bookRoomOperation.step, '')}
				operation={this.props.bookRoomOperation}
				triggerAction={triggerAction}/>
				<Flights
					BOOK_FLIGHT={BOOK_FLIGHT}
					steps={BOOK_FLIGHT.steps}
					step={or(this.props.bookFlightOperation.step, '')}
					operation={this.props.bookFlightOperation}
					triggerAction={triggerAction}/>
				<FlowTreeGraph step={or(this.props.bookFlightOperation.step, '')} steps={BOOK_FLIGHT.steps}/>
			</div>
		)
	}
}

const mapStateToProps = ({operations}) => {
	return {
		inProgress: operations.inProgress,
		bookRoomOperation: or(operations.inProgress[OPERATIONS.BOOK_ROOM.name], {}),
		bookFlightOperation: or(operations.inProgress[OPERATIONS.BOOK_FLIGHT.name], {}),
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
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)
