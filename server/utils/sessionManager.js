const Logger = require('../utils/logger');

class SessionManager
{
	/**
	 * Creates an instance of the session manager
	 * @param  {object} db Database handle
	 * @param  {string} token User-Token
	 */
	constructor(db, token)
	{
		this.db = db;
		this.token = token;
		this.sessionData = undefined;
	}
	/**
	 * Checks if the session exists
	 * @returns {boolean} Returns true if the session exists
	 */
	async checkSession()
	{
		this.sessionData = this.db.sessions.findOne(
			{
				where:
				{
					token: this.token,
				},
			})
			.then(sessionData =>
			{
				if(!sessionData)
					return false;
				return true;
			})
			.catch(err =>
			{
				Logger.log(err, 'error');
				return false;
			});
	}
	/**
	 * Returns the current session object for later use
	 * @returns {object} Session SQL-Object
	 */
	getCurrentSessionObject()
	{
		return this.sessionData;
	}

	/**
	 * Updates the user session
	 * @returns {boolean} Returns true if update was successfull
	 */
	async updateSession()
	{
		const validUntil = new Date(Date.now() + (30 * 60 * 1000));
		this.sessionData.update(
			{
				validUntil: validUntil,
			})
			.then(() =>
			{
				return true;
			})
			.catch(err =>
			{
				Logger.log(err, 'error');
				return false;
			});
		return false;
	}
}

module.exports = SessionManager;