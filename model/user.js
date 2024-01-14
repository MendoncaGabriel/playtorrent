//importe mongoose
const mongoose = require('mongoose')

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false,
		default: ''
	},
	password: {
		type: String,
		required: true
	},
	comments: [
		{
		  idPage: {
			type: String,
			required: true
		  },
		  idComment: {
			type: String,
			required: true
		  }
		}
	]

})

module.exports = User