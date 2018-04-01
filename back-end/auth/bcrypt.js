var bcrypt = require('bcrypt');


exports.hashingPwd = (password,saltRounds)=>{

	return new Promise((resolve,reject)=>{
		bcrypt.hash(password,saltRounds,(error,hash)=>{
			if (error){
				reject(error);
			}else{
				resolve(hash);
			}
		});
	});
};
exports.compareRawPwdToHash = (pwd,hashToCompare)=>{
	return new Promise((resolve,reject)=>{
		bcrypt.compare(pwd,hashToCompare, (err,resp)=>{
			if(resp === true){
				resolve(resp);
			}else{
				reject(new Error(resp));
			}
		});
	});
};
