import { flatten, omit, append, assocPath, dissocPath, isEmpty, path, or } from 'ramda'
import { uuid } from './helpers'

const stateObject = {
	inProgress: {},
	failed: {},
	succeed: {},
}

export const getRoute = (context) => {
	if (isEmpty(context)) {
		return []
	} else {
		return flatten(context.map(c => ['inProgress', c, ['children']]))
	}
}

/**
 * @param state
 * @param action
 * @return {*}
 */
function operationsReducers (state = {}, action) {
	const {type, payload} = action
	switch (type) {

		case 'start_operation' : {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					inProgress: {
						...path([...route, 'inProgress'], state),
						[operation]: {state: payload.state, step: payload.step},
					},
				},
				state)
		}

		case 'update_operation_state': {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					inProgress: {
						...path([...route, 'inProgress'], state),
						[operation]: {state: payload.state, step: payload.step},
					},
				},
				state)
		}

		case 'success_operation' : {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					inProgress: {
						...omit(operation, path([...route, 'inProgress'], state)),
					},
					succeed: {
						...path([...route, 'succeed'], state),
						[operation]: path([...route, 'inProgress', operation], state),
					},
				},
				state)
		}

		case 'failure_operation': {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					inProgress: {
						...omit(operation, path([...route, 'inProgress'], state)),
					},
					failed: {
						...path([...route, 'failed'], state),
						[operation]: path([...route, 'inProgress', operation], state),
					},
				},
				state)
		}

		case 'cancel_operation' : {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					inProgress: {
						...omit(operation, path([...route, 'inProgress'], state)),
					},
				},
				state)
		}

		case 'clean_failure_operation':
			return {
				...state,
				failed: dissocPath([...payload.context, payload.operation], state.failed),
			}

		case 'clean_success_operation': {
			const {context, operation} = payload
			const route = getRoute(context)
			return assocPath(
				[...route],
				{
					...stateObject,
					...path(route, state),
					succeed: {
						...omit(operation, path([...route, 'succeed'], state)),
					},
				},
				state)
		}

		default:
			return state
	}
}

export default {
	operations: operationsReducers,
}
