const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    email: {type:String, required:true},
    password: {type:String, required:true},
    partner:{type:String, required:true},
    smallcase:[{type:Schema.Types.ObjectId, ref:"smallcases", required:true}]
},
{
    versionKey: false,
    timestamps:true,
})

userSchema.pre("save", function (next) {
    // create and update
    if(!this.isModified("password")) return next();
    bcrypt.hash(this.password,10, (err,hash) => {
        this.password = hash;
        return next();
    });
});

userSchema.methods.checkpassword = function (password) {
    return new Promise((resolve,reject) => {
        bcrypt.compare(password,this.password, function(err,same) {
            if(err) return reject(err);

            return resolve(same);
        })
    })
}