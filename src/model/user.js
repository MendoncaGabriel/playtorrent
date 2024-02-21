//importe mongoose
const mongoose = require('mongoose')

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	comments: [
		{
		pageId: {
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