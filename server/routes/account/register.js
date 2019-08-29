// const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post('/account/register',
	[
		check('username')
			.not().isEmpty()
			.isLength({ min: 5 })
			.trim()
			.escape(),
		check('password')
			.not().isEmpty()
			.isLength({ min: 8 }),
		check('password-retype')
			.not().isEmpty()
			.isLength({ min: 8 })
			.custom((value, { req }) =>
			{
				if (value !== req.body.password)
				{
					// trow error if passwords do not match
					throw new Error('The given passwords don\'t match');
				}
				else
				{
					return value;
				}
			}),
	], (req, res) =>
	{
		const errors = validationResult(req);
		if(!errors.isEmpty())
		{
			return res.status(400).json(
				{
					'Error':
					{
						'Code': 400,
						'Messages': errors.array(),
					},
				});
		}
	}
);

module.exports = router;