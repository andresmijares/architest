import React from 'react'
import {equals, isNil} from 'ramda'

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

export default Groups

const DetailPresentation = ({group, users, groups, title, removeGroupFromUser, deleteGroup}) => {
		const {data} = users
		const id = group.id
		const names = groups.data[id]['users'] || []
		return (
				<div className='app__detail'>
						<h2 className='app__title'>{title}</h2>
					{names.length > 0 ? showUsers(data, group, names, removeGroupFromUser) : showDeleteGroup(deleteGroup, group)}
					{/* Drag and drop for users */}
				</div>
		)
}

function showDeleteGroup (deleteGroup, group) {
		return <button onClick={(e) => { deleteGroup(e, group) }}>{`Delete Group`}</button>
}

function showUsers (data, group, names, removeGroupFromUser) {
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
		return class lifecycle extends React.PureComponent {
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
}

export const DetailGroup = lifecycle(DetailPresentation)
