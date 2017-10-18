
export function uuid () {
	let i
	let random
	let uuid = ''
	for (i = 0; i < 8; i++) {
		random = Math.random() * 16 | 0
		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
	}
	return uuid
}
