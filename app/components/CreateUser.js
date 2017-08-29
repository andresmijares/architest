import React from 'react'
import PropTypes from 'prop-types'

const rules = ['name', 'groups']
const validate = (form) => {
		return rules.every(r => {
				if (typeof form[r] === 'object') {
						return Object.keys(form[r]).length > 0
				}
				return !!form[r]
		})
}

const CreateUser = ({handleForm, handleCheckbox, form, groups, submit, reset}) => {
		// console.log(form)
		return (<div className='app__detail'>
				<form>
						<h1 className='app__title'>{`Create User`}</h1>
						<div className='form-group'>
								<label htmlFor='name'>{`Name`}</label>
								<input type='text' onChange={handleForm} className='form-control'
									id='name' placeholder='Name' value={form['name'] || ''}
									name='name' />
						</div>
						<div className='form-group'>
							<label htmlFor='name'>{`Groups`} </label>
								<div className='checkbox'>
										{groups.ids.map((id, i) => {
												return <label key={i} style={{marginRight: '10px'}}>
												<input onChange={handleCheckbox(id)} type='checkbox' value={id}
															checked={form['groups'][id] || false} />
														{groups.data[id].name}
												</label>
										})}
								</div>
								{Object.keys(form['groups']).length === 0 && <label style={{color: 'red'}}>{` Select at least one group`}</label>}
						</div>
						<div className='form-group'>
								<button type='submit' className='btn btn-default' disabled={!validate(form)}
									onClick={submit}>{`Submit`}</button>
								<button type='submit' className='btn btn-default'
								onClick={reset}>{`Reset`}</button>
						</div>
				</form>
		</div>)
}

CreateUser.propTypes = {
		handleForm: PropTypes.func.isRequired,
		handleCheckbox: PropTypes.func.isRequired,
		form: PropTypes.object.isRequired,
		submit: PropTypes.func.isRequired,
		reset: PropTypes.func.isRequired,
		groups: PropTypes.object.isRequired,
}

export default CreateUser
