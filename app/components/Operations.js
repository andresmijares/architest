import { React, PropTypes } from 'react'
import { equals } from 'ramda'

export const Hotels = props => {
	const {dispatch, OPERATIONS} = props
	const triggerOperation = (operation, payload) => dispatch({type: 'start_operation', payload: {operation}})
	const triggerStep = (step, payload) => dispatch({type: 'operation_step', payload: {step}})
	const cancelOperation = (operation, payload) => dispatch({type: 'cancel_operation', payload: {operation}})
	return (
		<div className='container'>
			<div>
				{`Start ${OPERATIONS.CREATE_SHIFT.name}`}
				<button onClick={() => triggerOperation(OPERATIONS.CREATE_SHIFT.name)}>{OPERATIONS.CREATE_SHIFT.name}</button>
			</div>
			<div>
				{`Step 1 ${steps.SELECT_GROUP}`}
				<button onClick={() => triggerStep(steps.SELECT_GROUP)}>{steps.SELECT_GROUP}</button>
			</div>
			<div>
				{`Step 2 ${steps.SET_INFO}`}
				<button onClick={() => triggerStep(steps.SET_INFO)}>{steps.SET_INFO}</button>
			</div>
			<div>
				{`Cancel ${OPERATIONS.CREATE_SHIFT.cancelAction}`}
				<button
					onClick={() => cancelOperation(OPERATIONS.CREATE_SHIFT.cancelAction)}>{OPERATIONS.CREATE_SHIFT.cancelAction}</button>
			</div>
		</div>

	)
}

Hotels.propTypes = {
	dispatch: PropTypes.func,
	OPERATIONS: PropTypes.object,
}
