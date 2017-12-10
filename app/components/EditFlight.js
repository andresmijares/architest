import React from 'react'
import PropTypes from 'prop-types'
import { OPERATIONS } from '../services/flights/sagas'
import './style.css'

export const EditFlight = props => {
	const {EDIT_FLIGHT_DATE} = OPERATIONS
	// SELECT_NEW_DATE: 'SELECT_NEW_DATE',
	// EDIT_DATE_CONFIRMATION: 'EDIT_FLIGHT_DATE_CONFIRMATION',
	return (
			<div>{`Edit flight Component`}</div>
	)
}

EditFlight.propTypes = {
	SELECT_MEAL: PropTypes.object,
	step: PropTypes.string,
	steps: PropTypes.object,
	triggerAction: PropTypes.func,
	operation: PropTypes.object,
}
