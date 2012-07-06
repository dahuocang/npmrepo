
function mongolog(dburl,dbcollection)
{
	this.dburl=dburl;
	this.dbcollection=dbcollection;
	this.db=require('mongojs').connect(this.dburl,[this.dbcollection]);
}
module.exports.getMongoLogger=function(dburl,dbcollection)
{
  return new mongolog(dburl,dbcollection);
};

mongolog.prototype.log=function(date,level,caller,msg)
{
	this.db[this.dbcollection].save({date:date,level:level,caller:caller,msg:msg},function(error,saved){
		if(error||!saved)throw error;
		else{console.log('saved');}
		
	});
};
mongolog.prototype.findLogByLevel=function(level,callback)
{

   this.db[this.dbcollection].find({level:level},function(err,result){
	
	if(err)throw err;
	else
		{
		console.log(result);
		}
})	;
};
