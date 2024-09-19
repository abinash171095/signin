const { JsonWebTokenError } = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const Schema= mongoose.Schema;


const userSchema = new Schema({

    name:{
        type:String,
        required: [true,'name is required'],
        minlength:[5,'name must be atleast 5 charachter long'],
        maxlength:[50,'name must be atmost 50 charachter long'],
        trim: true
    },
    email:{
        type: String,
        required:[true,'user email is required'],
        unique: true,
        lowercase: true,
        unique:[true,'already registered']
    },
    password:{
        type: String,
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiryDate:{
        type: Date
    }
},{
    timestamps: true
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods={
    jwtToken(){
        return JWT.sign({
            id: this._id, email: this.email
        },process.env.SECRET,
    {expiresIn:'24h'}
)
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports= userModel;