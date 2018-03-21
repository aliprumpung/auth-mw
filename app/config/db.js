  require('dotenv').config();
  const pg = require('pg');
  const pg_ = new pg.Client(process.env.DATABASE_URL);
  const isEqual = require('lodash.isequal');
  pg_.connect();
 



  exports.exec_query = (opt,obj)=>{

  var a='';
  var items = Object.keys(obj);
  items.forEach((item)=> {

    if(opt === 1){
      var create_query = this.create_query(item,obj[item]); 
      a += create_query; 

    }else if(opt === 2){
      var create_query = this.insert_query(item,obj[item]); 
      a += create_query; 
    }else if(opt === 3){
      var create_query = this.update_query(item,obj[item]); 
      a += create_query; 
    }else if(opt === 4){
      var create_query = this.delete_query(item,obj[item]); 
      a += create_query; 
    }
  });
  return new Promise((resolve,reject)=>{
 
    pg_.query(a,(err,res)=>{
      if(err){
        reject(err);
      }else{
        resolve(obj);
      }
    });

  });  

    // return a;

 }


 exports.create_query = (tbl,myObject)=>{ 
  var items = Object.keys(myObject);
  var i=0, jsonkey ='', jsonval ='\'',q='';

  items.forEach((item)=> {
    if (i < Object.keys(myObject).length -1){
      jsonkey += item + ' ' + myObject[item] + ',';

    }else{
      jsonkey += item + ' ' + myObject[item];
    }
    i++;

  });

  q = `CREATE TABLE ${tbl} (${jsonkey});`;
  return q;
}





exports.insert_query = (tbl,myObject)=>{ 
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
  return q;
}



exports.update_query = (tbl,myObject)=>{ 
  var items = Object.keys(myObject);
  var i=0, jsonkey ='', jsonval ='\'',q='',key_W_AND ='';

  items.forEach((item)=> {
    if (Object.keys(myObject).length == 2){
     

    if (i == 0){
     
      jsonkey += item + `= \'${myObject[item]}\' `;

    }else
    if (item == 'where_AND'){

      key_W_AND = where_parse(myObject[item],'and');

    }else
    if (item == 'where_OR'){

      key_W_AND = where_parse(myObject[item],'or');

    }else
    if (i < Object.keys(myObject).length -2){
      jsonkey += item + ' = \'' + myObject[item] + '\', ';

    }else{
      jsonkey += item + ' = \'' + myObject[item] + '\'';
    }




    }else{

      if (i == 0){
     
      jsonkey += item + `= \'${myObject[item]}\', `;

    }else
    if (item == 'where_AND'){

      key_W_AND = where_parse(myObject[item],'and');

    }else
    if (item == 'where_OR'){

      key_W_AND = where_parse(myObject[item],'or');

    }else
    if (i < Object.keys(myObject).length -2){
      jsonkey += item + ' = \'' + myObject[item] + '\', ';

    }else{
      jsonkey += item + ' = \'' + myObject[item] + '\'';
    }

    }
    
    i++;

  });

  q = `UPDATE ${tbl} SET ${jsonkey} WHERE ${key_W_AND};`;
  return q;
}


exports.delete_query = (tbl,myObject)=>{ 

  var key_W_AND='';
  var items = Object.keys(myObject);
  var i=0, jsonkey ='', jsonval ='\'',q='';

  items.forEach((item)=> {
    if (item == 'where_AND'){

      key_W_AND = where_parse(myObject[item],'and');

    } else
    if (item == 'where_OR'){

      key_W_AND = where_parse(myObject[item],'or');

    } else

    if (i < Object.keys(myObject).length -1){
      jsonkey += item + ' ' + myObject[item] + ',';

    }else{
      jsonkey += item + ' ' + myObject[item];
    }
    i++;

  });

  q = `DELETE FROM ${tbl} WHERE ${key_W_AND};`;
  return q;

}

const where_parse = (obj,and_or)=>{

  var key_W_AND='';
  var w_obj = obj;
  var j=0;

  var items_where = Object.keys(w_obj);

  items_where.forEach((item)=> {

    if (j < Object.keys(w_obj).length -1){
      key_W_AND += item + ' = \'' + w_obj[item] + `\' ${and_or} `;

    }else{

      key_W_AND += item + ' = \'' + w_obj[item] + '\'';
    }
    j++;
  });

  return key_W_AND;
}


exports.insert_multirows_json = (obj)=>{

  var q='';
  var items = Object.keys(obj);
  items.forEach((item)=> {



    var tbl = item;
    for (var y=0;y<obj[item].length;y++){

      var jsonkey ='';var jsonval ='\'';
      var obj1 = obj[item][y];
      var items1 = Object.keys(obj1);


      var i=0;
      items1.forEach((item1)=> {

        if(i < items1.length -1){
          jsonkey += item1 + `,`;
          jsonval += obj1[item1] + '\',\'';

        }else{
          jsonkey += item1 ;
          jsonval += obj1[item1] + `\'`;
        }

        i++;
      });

      q +=`insert into ${tbl} (${jsonkey}) values (${jsonval});`;
  

    }


  });
 // return q;

 return new Promise((resolve,reject)=>{
  pg_.query(q,(err,res)=>{
    if(err){
      reject(err);
    }else{
      resolve(res);
    }
  });
});


};





exports.ifExists = (tbl,obj,condition)=>{ 

  var q = `select * from ${tbl} where ${condition};`;
   
  var data = obj;

  return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){

        reject(err);
      }else{

        if(res.rows.length > 0){
          data.name = res.rows[0].name;
          data.exists = '1';
          data.password = res.rows[0].password;
          data.active = res.rows[0].active;
          data.rand = res.rows[0].rand;
          resolve(data);
          
        }else{
          data.exists = '0';
          reject(data);
          
        }
        
      }
    });
  });
}
exports.ifDoesntExists = (tbl,condition)=>{ 

  var q = `select email from ${tbl} where ${condition};`;


  return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){
        reject(err);
      }else{

        if(res.rows.length > 0){
          reject('email already exists.');
        }else{

          resolve(true);
        }
        
      }
    });
  });
}



exports.check_ifExistsInDB = (myObject,arg,arg1,cb)=>{

  let keys = '';   var results = [];

  var items = Object.keys(myObject);
  items.forEach((item)=> {



   for (var y=0;y<myObject[item].length;y++){


    var q=`${arg} = \'${myObject[item][y][arg]}\' AND account_type = \'${arg1}\'`;

  
    this.ifExists(item,myObject[item][y],q).then(pos=>{

      results.push(pos);
      
    }).catch(err=>{
      
      results.push(err);
      
    });

  }
});
  setTimeout(function () {
    cb(null,results);},1000);
  
}

exports.rem_dataFrom = (tbl,condition)=>{ 

  var q = `delete from ${tbl} where ${condition};`;


  return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){
        reject(err);
      }else{
       resolve(res);

     }
   });
  });
}
exports.check_sKEY = (fld,tbl,condition)=>{ 

  var q = `select ${fld} from ${tbl} where ${fld} = \'${condition}\';`;


  return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){
        reject(err);
      }else{
       resolve(res);

     }
   });
  });
}

exports.removes_duplicatesJSON = (arr)=> {
  var cleaned = [];
  arr.forEach((itm)=> {

    var unique = true;
    cleaned.forEach((itm2)=> {

      if (isEqual(itm.email.toString().toLowerCase(), itm2.email.toString().toLowerCase())) unique = false;
    });
    if (unique)  cleaned.push(itm);
  });
  return cleaned;
}

exports.rem_attrFromJSON = (obj,attr)=>{
  for(var i=0;i<obj.length;i++){
    delete obj[i][attr];
  }
}


exports.filter_JSON = (myObj,attr,str)=>{
  var newArray = myObj.filter((el) =>{
    return el[attr] == str;
  });
  return newArray;
}

exports.create_sessionTbl = ()=>{
  const q =`CREATE TABLE IF NOT EXISTS "user_sessions" (
   "sid" varchar NOT NULL COLLATE "default",
   "sess" json NOT NULL,
   "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") 
NOT DEFERRABLE INITIALLY IMMEDIATE;`;
return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){
        reject(err);
      }else{
       resolve(res);

     }
   });
  });

}

exports.create_usersTbl = ()=>{
  const q =`DROP TABLE IF EXISTS users;CREATE TABLE IF NOT EXISTS "users" (
   "u_id" SERIAL,
   "name" varchar NOT NULL,
   "email" varchar NOT NULL ,
   "password" varchar NOT NULL,
   "account_type" varchar NOT NULL,
   "profile_id" varchar ,
   "token" varchar ,
   "active" boolean,
   "rand" varchar,
   "created_at" timestamp(6),
   "last_login" timestamp(6),
   "shared_k" varchar UNIQUE
)
WITH (OIDS=FALSE);
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("u_id") 
NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "users" ALTER COLUMN active
SET DEFAULT 'false';`;
return new Promise((resolve,reject)=>{
    pg_.query(q,(err,res)=>{
      if(err){
        reject(err);
      }else{
       resolve(res);

     }
   });
  });

}

  /*

  1. create table example
  var myObject ={
  users: {
    id: 'SERIAL primary key',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  },
  facebook: {
    id: 'SERIAL primary key',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  }
  }
  var str_Results = db.exec_query(1,myObject);

  res.send(str_Results);

  2. insert table example
  var myObject ={
  users: {
    id: 'SERIAL primary key',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  },
  facebook: {
    id: 'SERIAL primary key',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  }
  }
  var str_Results = db.exec_query(2,myObject);

  res.send(str_Results);

  3. update table example

  var myObject_1 ={
  users: {
    id: 'SERIAL primary key',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text',
    where_AND:{
      id:'2',nama:'ALI'
    }
  }
  
  }

  var str_Results = db.exec_query(3,myObject);

  res.send(str_Results);

  4. delete table example

  var myObject_2 ={
  users: {
    where_OR:{
      id:'2'
    }
  }
  }
  
  var str_Results = db.exec_query(4,myObject);

  res.send(str_Results);



  5. insert multirows

  var myObject ={
  users: [{
    id: 'SERIAL',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  },{
    id: 'SERIAL',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  },{
    id: 'SERIAL',
    email: 'text',
    name: 'text',
    password: 'text',
    sesion: 'text'
  }]
  }

  var str_Results = db.insert_rows_json(myObject);
  res.send(str_Results);








  */