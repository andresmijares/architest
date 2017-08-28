import React from 'react'
import PropTypes from 'prop-types'
import {equals, isNil} from 'ramda'
import { Draggable } from 'react-drag-and-drop'

const User = ({user, changeUser, removeUser}) => <Draggable type='users' data={user.id} >
	<li className='user__item' onClick={(e) => changeUser(e, user)}>{user['name']}
		<span
			role='button'
			onClick={(e) => removeUser(e, user)}
			className='user__delete'>{`delete`}</span></li></Draggable>

User.propTypes = {
	user: PropTypes.object.isRequired,
		changeUser: PropTypes.func.isRequired,
		removeUser: PropTypes.func.isRequired,
}

class List extends React.PureComponent {
		shouldComponentUpdate (nextProps) {
				return !equals(nextProps.users.ids.length, this.props.users.ids.length)
		}
		change (e, user) {
				e.stopPropagation()
				this.props.change({user})
		}
		render () {
				const {users} = this.props
				const {data, ids} = users
				return (<div className='app__detail'>
								<h1 className='app__title'>{this.props.title} <button className='user__create' onClick={this.props.toggle}>{`create user`}</button></h1>
								<ul className='user__list'>
								{ids.map((u, i) => {
										return <User key={i} changeUser={this.change.bind(this)} user={data[u]}
										removeUser={this.props.removeUser} />
								})}
				</ul>
				</div>
			)
		}
}

export default List

export const DetailUser = ({user, groups, title, removeGroupFromUser}) => {
		const {data} = groups
		return (
						<div className='app__detail'>
								<h2 className='app__title'>{title}</h2>
								{isNil(user) ? deletedUser() : hasUser(user, data, removeGroupFromUser)}
						</div>
		)
}

function hasUser (user, data, removeGroupFromUser) {
		return (<div>
				<p>{`Name: ${user.name}`}</p>
				<p>{`Groups: `}</p>
				{user.groups.length > 0 ? showGroups(user, removeGroupFromUser, data) : `No groups to show.`}
		</div>)
}

function deletedUser () {
		return (<p style={{color: 'red'}}>{`This user does not exists or has been deleted recently.`}</p>)
}

function showGroups (user, removeGroupFromUser, data) {
		return (<ul>
				{user.groups.map((g, i) => <li key={i}>
						{data[g].name}
						<span className='user__delete' onClick={(e) => { removeGroupFromUser(user, data[g]) }}>{`delete`}</span>
					</li>)}
			</ul>
		)
}

List.propTypes = {
		change: PropTypes.func.isRequired,
		toggle: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		users: PropTypes.object.isRequired,
		removeUser: PropTypes.func.isRequired,
}

DetailUser.propTypes = {
		user: PropTypes.object.isRequired,
		title: PropTypes.string.isRequired,
		removeGroupFromUser: PropTypes.func.isRequired,
		groups: PropTypes.object.isRequired,
}

