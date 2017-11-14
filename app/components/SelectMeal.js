import React from 'react'
import PropTypes from 'prop-types'
import {equals, isEmpty} from 'ramda'
import './style.css'

const SelectMeal = props => {
	const {operation, actions, step, steps, triggerAction, succeed} = props
	const {SELECT_FLIGHT_MEAL,	SELECT_FLIGHT_MEAL_CONFIRMATION} = steps
	return (
		<div className='select-flight-meal mug'>
			{
				equals(step, SELECT_FLIGHT_MEAL) &&
				<div>
					<div>
						<button onClick={() => triggerAction(SELECT_FLIGHT_MEAL, {})}>{SELECT_FLIGHT_MEAL}</button>
					</div>
				</div>
			}
			{
				equals(step, SELECT_FLIGHT_MEAL_CONFIRMATION) &&
				<div>
					<div>
						<button onClick={() => triggerAction(SELECT_FLIGHT_MEAL_CONFIRMATION, {})}>{SELECT_FLIGHT_MEAL_CONFIRMATION}</button>
					</div>
				</div>
			}
			{
				succeed &&
				<div>
					<div>{'CONGRATULATIONS'}</div>
					<button onClick={() => triggerAction(actions.successHandled, {})}>{'Thanks Awesome MEAL!!!!!!'}</button>
				</div>
			}
			{ !isEmpty(operation) &&
			<div className='cancel'>
				<button onClick={() => triggerAction(actions.cancel, {})}>{actions.cancel}</button>
			</div>
			}
		</div>
	)
}

SelectMeal.propTypes = {
	actions: PropTypes.object,
	step: PropTypes.string,
	steps: PropTypes.object,
	operation: PropTypes.object,
	succeed: PropTypes.bool,
	triggerAction: PropTypes.func,
}

export default SelectMeal

