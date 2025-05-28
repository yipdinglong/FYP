const { createLogger, format, transports } = require('winston');
const { combine, timestamp,printf } = format;
const errorlogFormat = printf(info => {
    return `${info.timestamp} ${info.message}`;
  });
const errorlogger = createLogger({
    format: combine(timestamp({format:'YYYY-MM-DD HH:mm:ss'}),errorlogFormat),
    transports: [new transports.Console(),new transports.File({filename:'./logger/error.txt'})]
  });
  //put this in transport if you want display the attributes added into the txt file like console.log
  // new transports.Console(),

module.exports = {errorlogger}