var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const createError = require('http-errors');
require('dotenv').config();

var Mysql = require('./helpers/Mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const db = new Mysql();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.db = db;
    next();
});

// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    next(createError(404, 'Url Not found'));
});

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || err.code || 500;
    const message = err.message || "Something went wrong.";

    res.status(statusCode).json({
        message: message
    });
});

module.exports = app;
