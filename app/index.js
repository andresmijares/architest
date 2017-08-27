import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import { Provider, connect } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
import List, {DetailUser} from 'components/List'
import Groups, {DetailGroup} from 'components/Groups'
import CreateUser from 'components/CreateUser'
import 'components/style.css'
import {isNil} from 'ramda'

class App extends React.PureComponent {
		state = {
				user: null,
				group: null,
				toggle: false,
				form: {
						groups: {},
				},
		}
		componentDidMount () {
				/* Simulates the application start */
				this.props.dispatch({type: 'fetch_groups'})
				this.props.dispatch({type: 'fetch_users'})
		}
		toggle () {
				this.setState({toggle: !this.state.toggle})
		}
		change (obj) {
				this.setState(obj)
		}
		removeGroupFromUser (user, group) {
				this.props.dispatch({
						type: 'removeGroup_users',
						group,
						user,
				})
		}
		removeUser (e, user) {
				e.stopPropagation()
				this.props.dispatch({
						type: 'remove_users',
						user,
				})
		}
		deleteGroup (e, group) {
				e.stopPropagation()
				this.props.dispatch({
						type: 'remove_groups',
						group,
				})
		}
		createUser (e) {
				e.preventDefault()
				let user = Object.assign({}, this.state.form, {
						groups: Object.keys(this.state.form.groups),
				})
				this.props.dispatch({
						type: 'create_users',
						user,
				})
		}
		handleForm (e) {
				let form = Object.assign({}, this.state.form)
				const field = e.target.name
				form[field] = e.target.value
				return this.setState({
						form: form,
				})
		}
		handleCheckbox (fieldName) {
				return (e) => {
						let form = Object.assign({}, this.state.form)
						let currentStatus = !form['groups'][fieldName]
						if (currentStatus) {
								form['groups'][fieldName] = currentStatus
						} else {
								delete form['groups'][fieldName]
						}
						form['groups'][fieldName]
						this.setState({
								form,
						})
				}
		}
		render () {
				const {users, groups, dispatch} = this.props
				return (
						<div className='container'>
								{this.props.error  && <div className='row'>
									<div className='col-md-8'>
										<div className='app__detail'>
											{`${this.props.error}`}
											<span className='user__delete' onClick={() => this.props.dispatch({type: 'error_message_dismiss'})}>{`dismiss`}</span>
										</div>
									</div>
								</div>}
								<div className='row'>
										<div className='col-md-8'>
										{this.state.toggle && <CreateUser
												handleForm={this.handleForm.bind(this)}
												handleCheckbox={this.handleCheckbox.bind(this)}
												groups={this.props.groups}
												form={this.state.form}
												submit={this.createUser.bind(this)} />}
												<List change={this.change.bind(this)}
												toggle={this.toggle.bind(this)}
												title={`Users`}
												users={users}
												removeUser={this.removeUser.bind(this)} />
										</div>
										<div className='col-md-4'>
												{!isNil(this.state.user) && <DetailUser
														user={users.data[this.state.user.id]}
														title={`User Detail`}
														removeGroupFromUser={this.removeGroupFromUser.bind(this)}
														groups={this.props.groups} />}
												{(!isNil(this.state.group) && !isNil(this.props.groups.data[this.state.group.id])) && <DetailGroup
														group={groups.data[this.state.group.id] || {}}
														title={this.state.group.name}
														groups={groups}
														dispatch={dispatch}
														deleteGroup={this.deleteGroup.bind(this)}
														removeGroupFromUser={this.removeGroupFromUser.bind(this)}
														users={users} />}
												<Groups change={this.change.bind(this)} title={`Groups`} groups={groups}/>
										</div>
								</div>
						</div>
			)
		}
}

const mapStateToProps = ({users, groups, error}) => ({
		users: {
				data: users.data,
				ids: users.ids,
		},
		groups: {
				data: groups.data,
				ids: groups.ids,
		},
		error,
})

const AppWithState = connect(mapStateToProps)(App)

const render = () => {
		ReactDOM.render(
		<Provider store={store}>
					<AppWithState />
				</Provider>,
				document.getElementById('app')
		)
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)

