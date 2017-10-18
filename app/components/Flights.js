import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

export const Flights = props => {
	const {BOOK_FLIGHT, triggerAction, steps, step, operation} = props
	console.log(step)
	return (
		<div>
			<div className='commands'>
				<div>
					{`Start ${BOOK_FLIGHT.name}`}
					<button onClick={() => triggerAction(BOOK_FLIGHT.name, {})}>{BOOK_FLIGHT.name}</button>
				</div>
				{
					equals(step, steps.INITIAL) &&
					<div>
						<div>
							{`Step ${steps.SELECT_DATES}`}
							<button onClick={() => triggerAction(steps.SELECT_DATES, {})}>{steps.SELECT_DATES}</button>
						</div>
						<div>
							{`${BOOK_FLIGHT.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_FLIGHT.cancelAction, {})}>{BOOK_FLIGHT.cancelAction}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.SELECT_DATES) &&
					<div>
						<div>
							{`Step ${steps.SELECT_ORIGIN}`}
							<button onClick={() => triggerAction(steps.SELECT_ORIGIN, {})}>{steps.SELECT_ORIGIN}</button>
						</div>
						<div>
							{`${BOOK_FLIGHT.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_FLIGHT.cancelAction, {})}>{BOOK_FLIGHT.cancelAction}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.SELECT_ORIGIN) &&
					<div>
						<div>
							{`${steps.SELECT_DESTINATION}`}
							<button onClick={() => triggerAction(steps.SELECT_DESTINATION, {})}>{steps.SELECT_DESTINATION}</button>
						</div>
						<div>
							{`${BOOK_FLIGHT.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_FLIGHT.cancelAction, {})}>{BOOK_FLIGHT.cancelAction}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.SELECT_DESTINATION) &&
					<div>
						<div>
							{`${steps.FLIGHT_CONFIRMATION}`}
							<button onClick={() => triggerAction(steps.FLIGHT_CONFIRMATION, {})}>{steps.FLIGHT_CONFIRMATION}</button>
						</div>
						<div>
							{`${BOOK_FLIGHT.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_FLIGHT.cancelAction, {})}>{BOOK_FLIGHT.cancelAction}</button>
						</div>
					</div>
				}
			</div>
			<div className='operation'>
				<div>
					{ operation &&
					<div>
						{JSON.stringify(operation.state)}
					</div>}
				</div>
			</div>
		</div>
	)
}

Flights.propTypes = {
	BOOK_FLIGHT: PropTypes.object,
	triggerAction: PropTypes.func,
	steps: PropTypes.object,
	step: PropTypes.string,
	operation: PropTypes.object,
}
