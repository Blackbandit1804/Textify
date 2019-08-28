require('dotenv').config();

const bodyparser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const express = require('express');
const glob = require('glob');
const helmet = require('helmet');
const Logger = require('./utils/logger');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const db = require('./models');

const connectInterval = setInterval(ConnectToDB, 1000);

function ConnectToDB()
{
	db.sequelize.authenticate()
		.then(() =>
		{
			Logger.log('Database connection successfull');
			db.sequelize.sync();
			clearInterval(connectInterval);
		})
		.catch((err) => Logger.log(`There was an error connecting to the database. Err: ${err.message}`));
}

const app = express();

const port = process.env.PORT || 8181;

app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(expressSanitizer());

app.use(session(
	{
		secret: require('crypto').randomBytes(64).toString('hex'),
		resave: false,
		saveUninitialized: true,
		expires: new Date(Date.now() + (1000 * 60 * 15)),
	}
));

app.use((req, res, next) =>
{
	const userIP = req.header('x-forwarded-for') || req.connection.remoteAddress;
	Logger.log(`[${userIP}/${req.method}] Navigating to ${req.path}`, 'debug');
	next();
});

Logger.log('Invoking routes - Start', 'debug');
glob.sync('./routes/**/*.js').forEach(file =>
{
	const filename = path.resolve(file);
	Logger.log(filename, 'debug');
	app.use(require(filename));
});
Logger.log('Invoking routes - End', 'debug');

app.all('*', (req, res) =>
{
	return res.status(404).json(
		{
			'Error':
			{
				'Code': 404,
				'Message': 'Seite nicht gefunden',
			},
		});
});

app.listen(port, () =>
{
	Logger.log(`Server started on port ${port}`);
});