var path = require('path');
var multer = require('multer');
var exp_ = exports;




this.Storage = multer.diskStorage({
     destination: (req, file, callback)=> {

        
         callback(null, './back-end/media/uploads');
        
     },
     filename: (req, file, callback)=> {

     	
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     	
     }
 });

/*exp_.imgWithMulter = multer({
     fileFilter:(req,file,cb)=>{
     	
     	
     	if (file.mimetype !== 'image/jpeg'){
     		return cb('error',false);
     	}else{
     		cb(null,true);
     	}
        
     },storage: this.Storage,
     limits: {fileSize:2 * 1024 * 1024}
 }).array("imgUploader", 3); */


exp_.imgWithMulter = multer({
     fileFilter:(req,file,cb)=>{
       
        if(!file){
            return cb(false); 
        }
        if (file.mimetype !== 'image/jpeg'){
            return cb(false);
        }else{
            cb(null,true);
        }
        
     },storage: this.Storage,
     limits: {fileSize:2 * 1024 * 1024}
 }); 



exp_.validateFiles = function(req, res, next){
    // first we want to see if the files are the infact a photo and are not too big!


   /* if (req.files.truncated){ //if truncated then it was too big
        console.log('photo too large');
        return res.json({
            errors: ['File too large']
        });
    }*/

  /*  req.checkBody('description', 'Invalid description').notEmpty();
    //the checkBody function is from Express Validator to confirm that the description field is filled
    req.checkBody('album_id', 'Invalid album_id').isNumeric();
    //this makes sure that the album id is a number
*/
    //then on the resulting object we can chain specific tests on the values this is cascading!

    var errors = req.validationErrors();
    if (errors) {
        var response = {errors: []};
        errors.forEach(function (err) {
            response.errors.push(err.msg);
        });

        res.statusCode = 400;
        return res.json(response);
    }

    return next();
};

