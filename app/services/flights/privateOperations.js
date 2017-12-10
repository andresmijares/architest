import {dateEdition, mealSelection, OPERATIONS} from './sagas'
import {operationFLow} from '../../operations/opsSaga'

export function * dateEditionOperation (context) {
	const {EDIT_FLIGHT_DATE} = OPERATIONS
	yield operationFLow(dateEdition, EDIT_FLIGHT_DATE.name, EDIT_FLIGHT_DATE.actions, EDIT_FLIGHT_DATE.steps, context)
}

export function * mealSelectionOperation (context) {
	const {SELECT_FLIGHT_MEAL} = OPERATIONS
	yield operationFLow(mealSelection, SELECT_FLIGHT_MEAL.name, SELECT_FLIGHT_MEAL.actions, SELECT_FLIGHT_MEAL.steps, context)
}
