import { filter, equals, assocPath, dissocPath } from 'ramda'
import { uuid } from './helpers'

export const OPERATIONS = {
	CREATE_SHIFT: {
		name: 'CREATE_SHIFT',
		steps: {
			SELECT_GROUP: 'SELECT_GROUP',
			SET_INFO: 'SET_INFO',
		},
		cancelAction: 'CREATE_SHIFT_CANCEL',
	},
	REMOVE_SHIFTS: 'REMOVE_SHIFTS',
	ASSIGN_SPECIALIST: 'ASSIGN_SPECIALIST',
	REMOVE_SPECIALIST: 'REMOVE_SPECIALISTS',
}

const initialState = {
	inProgress: {},
	failed: {},
	succeed: {},
	unexpectedReducerErrors: [],
}

const stackState = {
	stack: [],
	stackState: initialState,
}

function stackReducers (state = stackState, action) {
	const {type, payload} = action
	switch (type) {
		/**
		 *  Add operation to operation stack.
		 */
		case 'stack_operation' :
			return {
				...state,
				stack: [
					...state.stack,
					{
						uuid: uuid(),
						type: payload.type,
						info: payload.info,
					},
				],
			}

		/**
		 *  Remove operation from operation stack.
		 */
		case 'un_stack_operation' :
			return {
				...state,
				stack: filter((e) => equals(e.uuid, payload.uuid)),
			}
		default:
			return state
	}
}

/**
 * UPDATE STEP?!
 * @param state
 * @param action
 * @return {*}
 */
function operationsReducers (state = initialState, action) {
	const {type, payload} = action
	switch (type) {
		case 'start_operation' : {
			return {
				...state,
				inProgress: assocPath(
					[...payload.context, payload.operation],
					{state: payload.state, step: payload.step},
					state.inProgress),
			}
		}

		case 'update_operation_state' :
			return {
				...state,
				inProgress: assocPath(
					[...payload.context, payload.operation],
					{state: payload.state, step: payload.step},
					state.inProgress),
			}

		case 'failure_operation' : {
			return {
				...state,
				inProgress: dissocPath([...payload.context, payload.operation], state.inProgress),
				failed: assocPath(
						[...payload.context, payload.operation],
						{error: payload.error},
						state.failed),
			}
		}

		case 'cancel_operation': {
			return {
				...state,
				inProgress: dissocPath([...payload.context, payload.operation], state.inProgress),
			}
		}

		case 'success_operation': {
			return {
				...state,
				inProgress: dissocPath([...payload.context, payload.operation], state.inProgress),
				succeed: assocPath(
					[...payload.context, payload.operation],
					{state: payload.state},
					state.succeed),
			}
		}

		case 'clean_failure_operation' :
			return {
				...state,
				failed: dissocPath([...payload.context, payload.operation], state.failed),
			}

		case 'clean_success_operation' :
			return {
				...state,
				succeed: dissocPath([...payload.context, payload.operation], state.inProgress),
			}

		default:
			return state
	}
}

export default {
	stack: stackReducers,
	operations: operationsReducers,
}
