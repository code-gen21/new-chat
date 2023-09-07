const User=require("../model/userModel");
const bcrypt=require("bcrypt");

module.exports.register=async (req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const usernameCheck=await User.findOne({username});
        if(usernameCheck)
        return res.json({msg:"Username already used",status:false});
        const emailCheck=await User.findOne({email});
        if(emailCheck)
        return res.json({msg:"Email already used",status:false});
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            email,username,password:hashedPassword,
    })
        delete user.password; 
        // console.log(user);
        return res.json({status:true,user});
    }catch(err){  
        next(err);
    }
}

module.exports.login=async (req,res,next)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user)
        return res.json({msg:"Incorrect username or password",status:false});
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        return res.json({msg:"Incorrect Username or password",status:false});
        delete user.password; 
        return res.json({status:true,user});
    }catch(err){
        next(err);
    }
}
 
module.exports.setAvatar=async (req,res,next)=>{
    try{
        const userId=req.params.id;
        const avatarImage=req.body.image;
        const userData=await User.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,avatarImage:avatarImage
        }); 
        userData.isAvatarImageSet=true;
        userData.avatarImage=avatarImage;
        // console.log(userData);
        return res.json({isSet:userData.isAvatarImageSet,image:userData.avatarImage});
    }catch(err){
        next(err);
    }
}

module.exports.getAllUsers=async (req,res,next)=>{
    try{
        // $ne will not select the particular field 
        const users=await User.find({_id:{$ne:req.params.id}}).select(["email","username","avatarImage","_id"]);   // MongoDB includes _id by default. To exclude the _id when picking fields, you need to do .find().select({ name: 1, _id: 0 }) or .find().select('name -_id'). The 0 and - tells Mongoose and the MongoDB server to explicitly exclude _id.
        // console.log(users);
        return res.json(users);
    }catch(err){
        next(err);
    }
}