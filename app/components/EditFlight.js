import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export const EditFlight = props => {
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
