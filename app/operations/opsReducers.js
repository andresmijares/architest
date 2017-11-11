import { filter, equals, assocPath, dissocPath, isEmpty, path, or } from 'ramda'
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

const stateObject = {
	inProgress: {},
	failed: {},
	succeed: {},
}
const initialState = {
	...stateObject,
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

const pathOrObject = (route, state) => or(path(route, state), {})

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
			const baseOperation = isEmpty(payload.context)
			if (!baseOperation) {
				return {
					...state,
					inProgress: assocPath(
						[...payload.context],
						{
							...pathOrObject(['inProgress', ...payload.context], state),
							children: {
								...pathOrObject(['inProgress', ...payload.context, 'children'], state),
								...stateObject,
								inProgress: {
									...pathOrObject([...payload.context, 'children', 'inProgress'], state),
									[payload.operation]: {state: payload.state, step: payload.step},
								},
							},
						}, state.inProgress),
				}
			} else {
				return {
					...state,
					inProgress: assocPath(
						[payload.operation],
						{state: payload.state, step: payload.step},
						state.inProgress),
				}
			}
		}

		case 'update_operation_state' : {
			const baseOperation = isEmpty(payload.context)
			if (!baseOperation) {
				return {
					...state,
					inProgress: assocPath(
						[...payload.context],
						{
							...pathOrObject(['inProgress', ...payload.context], state),
							children: {
								...pathOrObject(['inProgress', ...payload.context, 'children'], state),
								inProgress: {
									...pathOrObject([...payload.context, 'children', 'inProgress'], state),
									[payload.operation]: {state: payload.state, step: payload.step},
								},
							},
						},
						state.inProgress),
				}
			} else {
				return {
					...state,
					inProgress: assocPath(
						[payload.operation],
						{state: payload.state, step: payload.step},
						state.inProgress),
				}
			}
		}

		case 'failure_operation': {
			const baseOperation = isEmpty(payload.context)
			if (!isEmpty(baseOperation)) {
				return {
					...state,
					inProgress: assocPath(
						[...payload.context],
						{
							...pathOrObject(['inProgress', ...payload.context], state),
							children: {
								...pathOrObject(['inProgress', ...payload.context, 'children'], state),
								inProgress: dissocPath(['inProgress', ...payload.context, 'children', payload.operation], state),
								failed: {
									...pathOrObject(['inProgress', ...payload.context, 'children', 'failed'], state),
									[payload.operation]: path(['inProgress', ...payload.context, 'children', payload.operation], state),
								},
							},
						},
						state.inProgress),
				}
			} else {
				return {
					...state,
					inProgress: dissocPath([payload.operation], state.inProgress),
					succeed: assocPath(
						[payload.operation],
						{state: payload.state},
						state.succeed),
				}
			}
		}

		case 'cancel_operation': {
			return {
				...state,
				inProgress: dissocPath([...payload.context, payload.operation], state.inProgress),
			}
		}

		case 'success_operation': {
			const baseOperation = isEmpty(payload.context)
			if (!isEmpty(baseOperation)) {
				return {
					...state,
					inProgress: assocPath(
						[...payload.context],
						{
							...pathOrObject(['inProgress', ...payload.context], state),
							children: {
								...pathOrObject(['inProgress', ...payload.context, 'children'], state),
								inProgress: dissocPath(['inProgress', ...payload.context, 'children', payload.operation], state),
								succeed: {
									...pathOrObject(['inProgress', ...payload.context, 'children', 'succeed'], state),
									[payload.operation]: path(['inProgress', ...payload.context, 'children', payload.operation], state),
								},
							},
						},
						state.inProgress),
				}
			} else {
				return {
					...state,
					inProgress: dissocPath([payload.operation], state.inProgress),
					succeed: assocPath(
						[payload.operation],
						{state: payload.state},
						state.succeed),
				}
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
	// stack: stackReducers,
	operations: operationsReducers,
}
