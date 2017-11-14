import React from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty } from 'ramda'
import './style.css'
import {EditFlight} from './EditFlight'
import SelectMealContainer from '../containers/SelectMealContainer'

export const FlightEdition = props => {
	const {step, steps, triggerAction, operation, FLIGHT_EDITION} = props
	const {SELECT_FLIGHT, SELECT_OPERATION, EDIT_FLIGHT_DATE_OPERATION, SELECT_FLIGHT_MEAL_OPERATION} = steps
	const inProgress = !isEmpty(operation)
	return (
		<div>
			<div className='commands-container blue'>
				<div className='commands'>
				{ !inProgress &&
				<div>
					<button onClick={() => triggerAction(FLIGHT_EDITION.name, {})}>{FLIGHT_EDITION.name}</button>
				</div>
				}
				{
					equals(step, SELECT_FLIGHT) &&
					<div>
						<div>
							<button onClick={() => triggerAction(SELECT_FLIGHT, {})}>{SELECT_FLIGHT}</button>
						</div>
					</div>
				}
				{
					equals(step, SELECT_OPERATION) &&
					<div>
						<div>
							<button onClick={() => triggerAction(EDIT_FLIGHT_DATE_OPERATION, {})}>{EDIT_FLIGHT_DATE_OPERATION}</button>
							<button onClick={() => triggerAction(SELECT_FLIGHT_MEAL_OPERATION, {})}>{SELECT_FLIGHT_MEAL_OPERATION}</button>
						</div>
					</div>
				}
				{
					equals(step, EDIT_FLIGHT_DATE_OPERATION) &&
						<div>
							<EditFlight/>
						</div>
				}
				{
					equals(step, SELECT_FLIGHT_MEAL_OPERATION) &&
					<div>
						<SelectMealContainer context={[FLIGHT_EDITION.name]}/>
					</div>
				}
				{ inProgress &&
				<div className='cancel'>
					<button onClick={() => triggerAction(FLIGHT_EDITION.actions.cancel, {})}>{'Cancel flight edition'}</button>
				</div>
				}
				</div>
			</div>
			<div className='operation green'>
				{ operation && inProgress &&
				<div>
					<div>{`Step: ${operation.step}`}</div>
					<div>{`State: ${JSON.stringify(operation.state)}`}</div>
				</div>
				}
			</div>
		</div>
	)
}

FlightEdition.propTypes = {
	FLIGHT_EDITION: PropTypes.object,
	step: PropTypes.string,
	steps: PropTypes.object,
	triggerAction: PropTypes.func,
	operation: PropTypes.object,
}
