require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.usingHeader = (req,res,next)=>{

	try{

	const token = req.headers.authorization.split(" ")[1];
	const decode = jwt.verify(token, process.env.JWT_KEY);
	req.userData = decode;
	console.log(token);
	next();
	
	}catch (error){

	return res.status(401).json({message: 'Auth failed !!!!'});
	
	}

};

exports.noHeader = (req,res,next)=>{
	try{
	const decode = jwt.verify(req.query.token, process.env.JWT_KEY);
	req.userData = decode;
	console.log(decode);
	next();
	}catch (error){
	return res.status(401).json({message: 'Authentication failed'});
	console.log('err');
	}
}