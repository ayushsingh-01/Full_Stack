import Useer from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


export const registerUser = async({name, email, password}) => {
    if(!name || !email || !password) {
        throw new Error("All fields are required");
    }
    const exixstingUser = await User.findOne({email});
    if(exixstingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    
    const token = generateToken(user._id);
    return {
        user,
        token
    }
}