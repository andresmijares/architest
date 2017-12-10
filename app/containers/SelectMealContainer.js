import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { OPERATIONS } from '../services/flights/sagas'
import {getOperationInfo, triggerAction} from '../containers/helpers'
import SelectMeal from '../components/SelectMeal'

class SelectMealContainer extends React.PureComponent {
	render () {
		const {dispatch} = this.props
		return (
			<SelectMeal triggerAction={triggerAction(dispatch)} {...this.props.mealSelection}/>
		)
	}
}

SelectMealContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	context: PropTypes.array,
	mealSelection: PropTypes.object,
}

const mapStateToProps = ({operations}, props) => {
	return {
		mealSelection: {
			...getOperationInfo(OPERATIONS.SELECT_FLIGHT_MEAL.name, operations, props.context),
		},
	}
}

export default connect(mapStateToProps)(SelectMealContainer)
