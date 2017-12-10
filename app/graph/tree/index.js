import React from 'react'
import PropTypes from 'prop-types'
import Tree from 'react-tree-graph'
import { head, tail, isEmpty } from 'ramda'
import 'react-tree-graph/dist/style.css'
import './style.css'

const data = {
	name: 'Parent',
	children: [{
		name: 'Child One',
		children: [{
			name: 'Child Two',
		}],
	}],
}

const buildData = (steps, currentStep) => {
	return !isEmpty(tail(steps)) ? {
		name: head(steps),
		className: head(steps) === currentStep ? 'green-node' : 'red-node',
		children: [buildData(tail(steps), currentStep)],
	} : {
		name: head(steps),
		className: head(steps) === currentStep ? 'green-node' : 'red-node',
	}
}

export const FlowTreeGraph = (props) => {
	const {step, steps} = props
	return (
	<div className='custom-container'>
		<Tree
			data={buildData(Object.values(steps), step)}
			height={800}
			width={800}/>
	</div>)
}

FlowTreeGraph.propTypes = {
	step: PropTypes.string,
	steps: PropTypes.object,
}
