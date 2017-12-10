import React from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty } from 'ramda'
import './style.css'

export const Flights = props => {
	const {BOOK_FLIGHT, triggerAction, steps, step, operation, locations, succeed, failed} = props
	const {SELECT_DATES, SELECT_ORIGIN, SELECT_DESTINATION, FLIGHT_CONFIRMATION} = steps
	const inProgress = !isEmpty(operation)
	return (
		<div>
			<div className='commands'>
				{ !inProgress &&
				<div>
					{`Start ${BOOK_FLIGHT.name}`}
					<button onClick={() => triggerAction(BOOK_FLIGHT.name, {})}>{BOOK_FLIGHT.name}</button>
				</div>
				}
				{
					equals(step, SELECT_DATES) &&
					<div>
			[			<div>
							{`Step ${SELECT_DATES}`}
							<button onClick={() => triggerAction(SELECT_DATES, {})}>{SELECT_DATES}</button>
						</div>
					</div>
				}
				{
					equals(step, SELECT_ORIGIN) &&
					<div>
						<div>
							{`Step ${SELECT_ORIGIN}`}
							<button onClick={() => triggerAction(SELECT_ORIGIN, {})}>{SELECT_ORIGIN}</button>
						</div>
						{
							locations.map((loc, key) =>
								<div key={key}>
									<p>{loc}</p>
									<input type='checkbox'/>
								</div>)
						}
					</div>
				}
				{
					equals(step, SELECT_DESTINATION) &&
					<div>
						<div>
							{`${SELECT_DESTINATION}`}
							<button onClick={() => triggerAction(SELECT_DESTINATION, {})}>{SELECT_DESTINATION}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.FLIGHT_CONFIRMATION) &&
					<div>
						<div>
							{`${FLIGHT_CONFIRMATION}`}
							<button onClick={() => triggerAction(FLIGHT_CONFIRMATION, {})}>{FLIGHT_CONFIRMATION}</button>
						</div>
					</div>
				}
				{ inProgress &&
				<div className='cancel'>
					{`${BOOK_FLIGHT.actions.cancel}`}
					<button onClick={() => triggerAction(BOOK_FLIGHT.actions.cancel, {})}>{BOOK_FLIGHT.actions.cancel}</button>
				</div>
				}
			</div>
			<div className='operation'>
				{ operation && inProgress &&
				<div>
					<div>{`Step: ${operation.step}`}</div>
					<div>{`State: ${JSON.stringify(operation.state)}`}</div>
				</div>
				}
			</div>
			{
				succeed &&
				<div>
					<div>{'CONGRATULATIONS'}</div>
					<button onClick={() => triggerAction(BOOK_FLIGHT.actions.successHandled, {})}>{'Thanks Awesome APP!'}</button>
				</div>
			}

			{
				failed &&
				<div>
					<div>{'SOMETHING WENT WRONG'}</div>
					<button onClick={() => triggerAction(BOOK_FLIGHT.actions.failureHandled, {})}>{'Im disappointed'}</button>
				</div>
			}
		</div>
	)
}

Flights.propTypes = {
	BOOK_FLIGHT: PropTypes.object,
	triggerAction: PropTypes.func,
	steps: PropTypes.object,
	step: PropTypes.string,
	operation: PropTypes.object,
	locations: PropTypes.any,
	succeed: PropTypes.bool,
	failed: PropTypes.bool,
}
