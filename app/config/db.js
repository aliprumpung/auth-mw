const pg = require('pg');
const pg_ = new pg.Client(process.env.DATABASE_URL);
pg_.connect();
exports.insertTo = (tbl,fieldName,val)=>{
// var str = ['nama','alamat','notelp','email']; 
// var strVal = ['Joni','Jalan','0813144','higha@ahoo.com']; 
// var ins = db.insertTo('user',str,strVal);

	var str = '',strVal = '\'';

  for(var i=0;i<fieldName.length;i++){
  	
  	if (i < fieldName.length - 1){
  	 str+= fieldName[i] + ',';
  	}
  
  }
   for(var i=0;i<val.length;i++){
  	
  	if (i < val.length - 1){
  	 strVal += val[i] + '\',\'';
  	}else{
  	 strVal += val[i] +'\''
  	}
  
  }
  
  var q = `insert into ${tbl}(${fieldName}) values(${strVal});`;
  return q;
}



exports.insertTo_json = (tbl,myObject)=>{ 
// var obj = { nama: '1', alamat: '2', notelp: '3'};
// items.sort(); // sort the array of keys
// items.forEach((item)=> {s += item + '=' + obj[item];});
var items = Object.keys(myObject);
var i=0, jsonkey ='', jsonval ='\'';

 items.forEach((item)=> {
	if (i < Object.keys(myObject).length -1){
	jsonkey += item + ',';
	jsonval += myObject[item] + '\',\'';
	}else{
		jsonkey += item;
		jsonval += myObject[item] +'\'';
	}
	i++;
 	
 });
 var q = `insert into ${tbl} (${jsonkey}) values (${jsonval});`;
 //will return insert into user (nama,alamat,notelp) values ('1','2','3')
  return q;
}





exports.createTbl_fromjson = (obj)=>{

/*var obj ={
  facebook: {
    id: 'SERIAL primary key',
    token: 'text',
    email: 'text',
    name: 'text'
  },
  Google: {
    id: 'SERIAL primary key',
    token: 'text',
    email: 'text',
    name: 'text'
  }
}*/

var a='';
var items = Object.keys(obj);
 items.forEach((item)=> {
var create_table = this.createTbl_json_(item,obj[item]); 
a += create_table +'<br>'; 
 });
return a;
/*
will return result
CREATE TABLE facebook (id SERIAL primary key,token text,email text,name text);
CREATE TABLE Google (id SERIAL primary key,token text,email text,name text);
*/

}


exports.createTbl_json_ = (tbl,myObject)=>{ 
var items = Object.keys(myObject);
var i=0, jsonkey ='', jsonval ='\'';

 items.forEach((item)=> {
  if (i < Object.keys(myObject).length -1){
  jsonkey += item + ' ' + myObject[item] + ',';
  
  }else{
  jsonkey += item + ' ' + myObject[item];
  }
  i++;
  
 });
 var q = `CREATE TABLE ${tbl} (${jsonkey});`;
  return q;
}

exports.createTable = (tbl)=>{

pg_.query(`create table ${tbl}`);

}