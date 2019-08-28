// const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post('/account/login',
	[
		check('username')
			.not().isEmpty().withMessage('Der Benutzername darf nicht leer sein')
			.isLength({ min: 5 }).withMessage('Der Benutzername muss mindestens 5 Zeichen haben')
			.trim().withMessage('Der Benutzername darf keine Leerzeichen enthalten')
			.escape().withMessage('Der Benutzername darf keine Sonderzeichen enthalten'),
		check('password')
			.not().isEmpty().withMessage('Das Passwort darf nicht leer sein')
			.isLength({ min: 8 }).withMessage('Das Passwort muss mindestens 8 stellen haben'),
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