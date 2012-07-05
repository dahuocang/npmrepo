
function logger(){
	
	this. red='\u001b[31m';
	this.blue='\u001b[34m';
	this. green='\u001b[32m';
	this. reset='\u001b[0m';
	this. yellow='\u001b[33m';
};

logger.prototype.debug=function(msg)
{
	console.log(this.blue+"debug in "+arguments.callee.caller.name+" : "+msg+this.reset);
};
logger.prototype.error=function(msg)
{
	console.log(this.red+"error in "+arguments.callee.caller.name+" : "+msg+this.reset);
};
logger.prototype.info=function(msg)
{
	console.log(this.green+"info in "+arguments.callee.caller.name+" : "+msg+this.reset);
};
logger.prototype.warn=function(msg)
{
	console.log(this.yellow+"warnning in "+arguments.callee.caller.name+" : "+msg+this.reset);
};
module.exports.getLogger=function()
{
  return new logger();	
};
