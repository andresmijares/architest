import React from 'react'
import PropTypes from 'prop-types'
import {equals} from 'ramda'
import { Droppable } from 'react-drag-and-drop'

class Groups extends React.PureComponent {
		shouldComponentUpdate (nextProps) {
				return !equals(nextProps.groups.ids.length, this.props.groups.ids.length)
		}
		change (group) {
				this.props.change({group})
		}
		render () {
				const {groups} = this.props
				const {data, ids} = groups
				return (
						<div className='app__detail'>
								<h1 className='app__title'>{this.props.title}</h1>
										<ul className='group__list'>
												{ids.map((g, i) => {
														return <li className='user__item' key={i} onClick={(e) => this.change(data[g])}>{data[g]['name']}</li>
												})}
										</ul>
						</div>
				)
		}
}

Groups.propTypes = {
		change: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		groups: PropTypes.object.isRequired,
}

export default Groups

const DetailPresentation = ({group, users, groups, title, removeGroupFromUser, deleteGroup, onDrop}) => {
		const {data} = users
		const id = group.id
		const names = groups.data[id]['users'] || []
		return (
				<div className='app__detail'>
						<h2 className='app__title'>{title}</h2>
					{names.length > 0 ? showUsers(data, group, names, removeGroupFromUser) : showDeleteGroup(deleteGroup, group)}
					<Droppable types={['users']} onDrop={onDrop(group)}><div className='user__drag-drop'>{`Drop user here to assign to this group`}</div></Droppable>
				</div>
		)
}

DetailPresentation.propTypes = {
		group: PropTypes.object.isRequired,
		groups: PropTypes.object.isRequired,
		users: PropTypes.object.isRequired,
		title: PropTypes.string.isRequired,
		removeGroupFromUser: PropTypes.func.isRequired,
		deleteGroup: PropTypes.func.isRequired,
		onDrop: PropTypes.func.isRequired,
}

function showDeleteGroup (deleteGroup, group) {
		return <button onClick={(e) => { deleteGroup(e, group) }}>{`Delete Group`}</button>
}

function showUsers (data, names, group, removeGroupFromUser) {
		return (<div>
				<p>{`Users: `}</p>
				<ul>
				{names.map((u, i) =>
						<li key={i}>
							{`${data[u].name}`}
							<span className='user__delete' onClick={(e) => { removeGroupFromUser(data[u], group) }}>{`delete`}</span>
					</li>)}
				</ul>
		</div>)
}

/* Match users to group */
const lifecycle = (Component) => {
		class lifecycle extends React.PureComponent {
				componentWillMount () {
						/* runs the first time */
						this.props.dispatch({type: 'matchWithUsers_groups', group: this.props.group})
				}
				componentWillReceiveProps (nextProps) {
						/* check if the operation returned a new value to the list of users per group */
						if (!equals(this.props.group['users'], nextProps.group['users'])) {
								this.props.dispatch({type: 'matchWithUsers_groups', group: nextProps.group})
						}
				}
				render () {
						return <Component {...this.props} />
				}
		}

		lifecycle.propTypes = {
				dispatch: PropTypes.func.isRequired,
				groups: PropTypes.object.isRequired,
				group: PropTypes.object.isRequired,
		}

		return lifecycle
}

export const DetailGroup = lifecycle(DetailPresentation)
