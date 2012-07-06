var dblog = require('./dblog');
var fs=require('fs');
var io = require('socket.io-client');
function Logger(type) {
	if (type == 'dblog')
		this.logger = new dblogger(arguments[1], arguments[2]);
	else if (type == 'filelog')
		this.logger = new filelogger(arguments[1]);
	else if(type=='socketlog') this.logger=new socketlogger(arguments[1]);
	else 
		this.logger = new baselogger();

	this.isDebug = true;
	this.isInfo = true;
	this.isWarn = true;
};

Logger.prototype.debug = function(msg) {
	if (this.isDebug)
		this.logger.debug(msg,arguments.callee.caller.name);

};
Logger.prototype.error = function(msg) {
	this.logger.error(msg, arguments.callee.caller.name);

};
Logger.prototype.info = function(msg) {
	this.logger.info(msg, arguments.callee.caller.name);
};
Logger.prototype.warn = function(msg) {
	this.logger.warn(msg, arguments.callee.caller.name);
};
Logger.prototype.turnOffDebug = function() {
	this.isDebug = false;
};
Logger.prototype.turnOffInfo = function() {
	this.isInfo = false;
};
Logger.prototype.turnOffWarnning = function() {
	this.isWarn = false;
};
/**
 * 
 * Log into DB
 * 
 * 
 * @param dbname
 * @param collection
 * @returns
 */
function dblogger(dbname, collection) {
	mlogger = dblog.getMongoLogger(dbname, collection);
	this.debug = function(msg, caller) {
		// mlogger.findLogByLevel('debug');
		mlogger.log(new Date(), 'debug', caller, msg);
	};
	this.info = function(msg, caller) {
		mlogger.log(new Date(), 'info', caller, msg);
	};
	this.error = function(msg, caller) {
		mlogger.log(new Date(), 'error', caller, msg);
	};
	this.warn = function(msg, caller) {
		mlogger.log(new Date(), 'warn', caller, msg);
	};
}
dblogger.prototype = new baselogger();
/**
 * Log into socket
 * 
 * @param url
 * @returns
 */
function socketlogger(url)
{
	this.socket=io.connect(url);
	this.debug=function(msg,caller)
	{
		this.socket.emit('debug',{data:new Date()+' debug in '+caller+" "+msg});
	};
	this.error=function(msg,caller)
	{
		this.socket.emit('error',{data:new Date()+' error in '+caller+" "+msg});
	};
	this.info=function(msg,caller)
	{
		this.socket.emit('info',{data:new Date()+' info in '+caller+" "+msg});
	};
	this.warn=function(msg,caller)
	{
		this.socket.emit('warn',{data:new Date()+' warnning in '+caller+" "+msg});
	};
}
socketlogger.prototype=new baselogger();

/**
 * 
 * Log into file
 * @param logpath
 * @returns
 */
function filelogger(logpath) {
	var path = require('path');
	var exec = require('child_process').exec;
	if (!path.existsSync(logpath)) {
		exec('mkdir -p ' + logpath, function(error, stdoutput, strerr) {
			{
			if(error)throw error;
			}
		});
	}
	;
	var filename = new Date().toDateString();
	this.logfile = logpath + filename;
	this.debug=function(msg,caller)
	{
		this.writeintoFile(new Date() + "debug in " + caller + " : " + msg
				+ '\n');
	};
	this.error=function(msg,caller)
	{
		this.writeintoFile(new Date() + "error in " + caller + " : " + msg
				+ '\n');
	};
	this.info=function(msg,caller)
	{
		this.writeintoFile(new Date() + "info in " + caller + " : " + msg
				+ '\n');
	};
	this.warn=function(msg,caller)
	{
		this.writeintoFile(new Date() + "warnning in " + caller + " : "
				+ msg + '\n');
	};
	this.writeintoFile=function(msg)
	{
		fs.open(this.logfile, 'a', function(error, fd) {
			if (error) {
				throw error;
			} else {
				fs.write(fd, msg, null, 'utf-8', function(err, written) {
					if (err)
						throw err;
					else {
						fs.close(fd, function(err) {
							if (err)
								throw err;
						});
					}
				});
			}
		});
	};

}
filelogger.prototype = new baselogger();
/**
 * 
 * Log into command line
 * @returns
 */
function baselogger() {
	this.red = '\u001b[31m';
	this.blue = '\u001b[34m';
	this.green = '\u001b[32m';
	this.reset = '\u001b[0m';
	this.yellow = '\u001b[33m';
	this.debug = function(msg, caller) {
		console.log(this.blue + new Date() + "debug in " + caller + " : " + msg
				+ this.reset);
	};
	this.error = function(msg, caller) {
		console.log(this.red + new Date() + "error in " + caller + " : " + msg
				+ this.reset);
	};
	this.info = function(msg, caller) {
		console.log(this.green + new Date() + "info in " + caller + " : " + msg
				+ this.reset);
	};
	this.warn = function(msg, caller) {
		console.log(this.yellow + new Date() + "warnning in " + caller + " : "
				+ msg + this.reset);
	};
}
module.exports.getLogger = function(type) {
	return new Logger(type, arguments[1], arguments[2]);
};
