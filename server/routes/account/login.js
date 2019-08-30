// const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

module.exports = (app, db) =>
{
	app.post('/account/login',
		[
			check('username')
				.not().isEmpty()
				.isLength({ min: 5 })
				.trim()
				.escape(),
			check('password')
				.not().isEmpty()
				.isLength({ min: 8 }),
		], (req, res) =>
		{
			const errors = validationResult(req);
			if(!errors.isEmpty())
			{
				return res.status(403).json(
					{
						'Error':
					{
						'Code': 403,
						'Messages': errors.array(),
					},
					});
			}
		}
	);
};