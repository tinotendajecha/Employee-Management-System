require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin-routes/admin-routes')
const employeeRouter = require('./routes/employee-routes/employee-routes')

var app = express();

const connectDb = require('./database/db')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(notFound);
// app.use(errorHandler);


app.use('/api/v1', indexRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/employee', employeeRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.send('error' + err);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);

})

connectDb()


module.exports = app;
