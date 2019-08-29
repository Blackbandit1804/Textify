// const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post('/account/login',
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

module.exports = router;