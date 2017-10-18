import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

export const Hotels = props => {
	const {BOOK_ROOM, triggerAction, steps, step, operation} = props
	return (
		<div>
			<div className='commands'>
				<div>
					{`Start ${BOOK_ROOM.name}`}
					<button onClick={() => triggerAction(BOOK_ROOM.name, {})}>{BOOK_ROOM.name}</button>
				</div>
				{
					equals(step, steps.INITIAL) &&
					<div>
						<div>
							{`Step ${steps.SELECT_DATES}`}
							<button onClick={() => triggerAction(steps.SELECT_DATES, {})}>{steps.SELECT_DATES}</button>
						</div>
						<div>
							{`${BOOK_ROOM.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_ROOM.cancelAction, {})}>{BOOK_ROOM.cancelAction}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.SELECT_DATES) &&
					<div>
						<div>
							{`Step ${steps.SELECT_PLACE}`}
							<button onClick={() => triggerAction(steps.SELECT_PLACE, {})}>{steps.SELECT_PLACE}</button>
						</div>
						<div>
							{`${BOOK_ROOM.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_ROOM.cancelAction, {})}>{BOOK_ROOM.cancelAction}</button>
						</div>
					</div>
				}
				{
					equals(step, steps.SELECT_PLACE) &&
					<div>
						<div>
							{`${steps.ROOM_CONFIRMATION}`}
							<button onClick={() => triggerAction(steps.ROOM_CONFIRMATION, {})}>{steps.ROOM_CONFIRMATION}</button>
						</div>
						<div>
							{`${BOOK_ROOM.cancelAction}`}
							<button onClick={() => triggerAction(BOOK_ROOM.cancelAction, {})}>{BOOK_ROOM.cancelAction}</button>
						</div>
					</div>
				}
			</div>
			<div className='operation'>
				<div>
					{ operation &&
					<div>
						{JSON.stringify(operation.state)}
					</div>}
				</div>
			</div>
		</div>
	)
}

Hotels.propTypes = {
	BOOK_ROOM: PropTypes.object,
	triggerAction: PropTypes.func,
	steps: PropTypes.object,
	step: PropTypes.string,
	operation: PropTypes.object,
}
