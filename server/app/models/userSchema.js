import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";

const userSchema = new Schema({
    companyName: {
        type: String,
        required: [true, 'Company name field is required']
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
        required: [true, 'Email field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

// checking is user exists
userSchema.methods.isUserExist = async function (param) {
    return await User.findOne({ email: param });
}

// checking is password matched
userSchema.methods.isPasswordMatched = async function (givenPassword, savedPassword) {
    return await bcrypt.compare(givenPassword, savedPassword);
}

// create or save works for both
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    this.password = hashedPassword;

    next();
});

const User = model("User", userSchema);
export default User;