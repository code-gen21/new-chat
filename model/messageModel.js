const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    message:{
        text:{
            type:String,
            required:true,
        },
    },
    users:Array,
    sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },   // The mongoose.Schema.Types.ObjectId type is a MongoDB ObjectId type. An ObjectId is a unique identifier that is used to represent a document in MongoDB. The ref property is used to specify the collection that the ObjectId field references. In this case, the User collection is referenced.
    },
    {
        timestamps:true,
    }
);

module.exports=mongoose.model("Messages",messageSchema);