require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars  = require('express-handlebars');
const route = require('./routes');
const app = express();
const port = 3000;


// view engine setup
app.engine('.hbs', 
	handlebars({
		extname: '.hbs',
		helpers:{
			section: function(name, options){
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			},
			isBigger: function(a,b){
				return a > b;
			},
			sum: function(a,b){
				return a +b;
			}
		}
	
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Middleware

//Dùng để in mấy cái connect lên terminal 
//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

route(app);

app.listen(process.env.PORT || port, () => {
	console.log(`Example app listening at http://localhost:${process.env.PORT || port}`);
});
