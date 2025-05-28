const { createLogger, format, transports } = require('winston');
const { combine, timestamp,printf } = format;
const logFormat = printf(info => {
    return `${info.timestamp} ${info.message}`;
  });
const logger = createLogger({
    format: combine(timestamp({format:'YYYY-MM-DD HH:mm:ss'}),logFormat),
    transports: [new transports.File({filename:'./logger/Log.txt'})]
  });
  //put this in transport if you want display the attributes added into the txt file like console.log
  // new transports.Console(),

module.exports = {logger}