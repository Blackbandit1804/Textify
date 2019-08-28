// const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post('/account/register',
	[
		check('username')
			.not().isEmpty().withMessage('Der Benutzername darf nicht leer sein')
			.isLength({ min: 5 }).withMessage('Der Benutzername muss mindestens 5 Zeichen haben')
			.trim().withMessage('Der Benutzername darf keine Leerzeichen enthalten')
			.escape().withMessage('Der Benutzername darf keine Sonderzeichen enthalten'),
		check('password')
			.not().isEmpty().withMessage('Das Passwort darf nicht leer sein')
			.isLength({ min: 8 }).withMessage('Das Passwort muss mindestens 8 stellen haben'),
		check('password-retype')
			.not().isEmpty().withMessage('Die Passwortbestätigung darf nicht leer sein')
			.isLength({ min: 8 }).withMessage('Die Passwortbestätigung muss mindestens 8 stellen haben')
			.custom((value, { req }) =>
			{
				if (value !== req.body.password)
				{
					// trow error if passwords do not match
					throw new Error('Die Passwörter stimmen nicht überein');
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