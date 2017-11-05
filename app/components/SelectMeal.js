import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export const SelectMeal = props => {
	return (
			<div>{`Select meal Component`}</div>
	)
}

SelectMeal.propTypes = {
	SELECT_MEAL: PropTypes.object,
	step: PropTypes.string,
	steps: PropTypes.object,
	triggerAction: PropTypes.func,
	operation: PropTypes.object,
}
