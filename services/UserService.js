const UserModel = require("../models/User");
// const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})");
const emailRegex = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
const service = {};

service.verifyRegisterFields = ({username, email, password}) => {
    let serviceResponse = {
        success:true,
        content:{}
    }
    if(!username || !email || !password ){
        serviceResponse = {
            success: false,
            content: {
                error: "Required fields empty"
            }
        }
        return serviceResponse;
    }


    if(!emailRegex.test(email)){
        serviceResponse = {
            success: false,
            content: {
                error:"Field format incorrect"
            }
        }
        return serviceResponse;
    }

    return serviceResponse;
}

service.verifyLoginFields = ({identifier, password}) =>{
    let serviceResponse = {
        success:true,
        content:{}
    }

    if(!identifier || !password){
        serviceResponse={
            success: false,
            content: {
                error:"Required fields empty"
            }
        }
        return serviceResponse;
    }
    //debug("Service " + serviceResponse);
    return serviceResponse;
}

service.verifyUpdatedFields = ({username, email, password})=>{
    let serviceResponse={
        success:true,
        content: {}
    }

    if(!username && !email && !password){
        serviceResponse={
            success: false,
            content: {
                error:"All fields are empty"
            }
        }
        return serviceResponse;
    }
    if(username) serviceResponse.content.username = username;

    if(password) serviceResponse.content.password = password;
    
    if(email){
        if(!emailRegex.test(email)){
            serviceResponse = {
                success: false,
                content: {
                    error:"Field format incorrect"
                }
            }
            return serviceResponse;
        }
        serviceResponse.content.email = email;
    }
    return serviceResponse;
}

service.findOneById = async (_id) => {
    let serviceResponse={
        success: true,
        content:{}
    }

    try{
        const user = await UserModel.findById(_id)
            .select("-hashedPassword")
            .exec();

        if(!user){
            serviceResponse={
                success: false,
                content: {
                    error: "User not found"
                }
            }
        }else{
            serviceResponse.content=user;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }

}

service.findOneUsernameEmail= async (username, email) => {
    let serviceResponse ={
        success:true,
        content:{}
    }

    try {
        const user = await UserModel.findOne({
            $or:[{username:username}, {email:email}]
        }).exec();
        
        if(!user){
            serviceResponse={
                success: false,
                content: {
                    error:"User not found"
                }
            }
        }else {
            serviceResponse.content = user;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.register = async ({email,username,password}) => {
    let serviceResponse={
        success:true,
        content:{
            message:"User Registered"
        }
    }

    try {
        const user = new UserModel({email,username,password});
        const userSaved = await user.save();
        if(!userSaved){
            serviceResponse={
                success: false,
                content: {
                    error: "User not registered"
                }
            }
        }
        let serviceResponse={
            success:true,
            content:{
                message:"User Registered"
            }
        }
        return serviceResponse
    }catch (e) {
        throw e;
    }

}

service.updateById = async (user, contentToUpdate) =>{
    let serviceResponse ={
        success:true,
        content:{
            message: "User Updated"
        }
    }

    try {
        Object.keys(contentToUpdate).forEach(
            key =>{
                user[key] =contentToUpdate[key];
            }
        );
        const userUpdated = await user.save();
        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    error:"User not updated"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }


}

service.savedFavoriteProduct = async (user, productID) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Product added to favorites"
        }
    }

    try {
        const alreadyExists=user.savedProducts.some(product => product.equals(productID));
        if(alreadyExists){
            serviceResponse={
                success: true,
                content: {
                    message: "Product already saved"
                }
            }
            return serviceResponse;
        }

        user.savedProducts.push(productID);
        const userUpdated = await user.save();

        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Cannot save product"
                }
            }
        }
        return serviceResponse;

    }catch (e) {
        throw e;
    }
}

service.savedFavoriteRestaurant = async (user, restaurantID) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Restaurant registered"
        }
    }

    try {
        const alreadyExists=user.savedRestaurants.some(restaurant => restaurant.equals(restaurantID));
        if(alreadyExists){
            serviceResponse={
                success: false,
                content: {
                    message: "Restaurant already saved"
                }
            }
            return serviceResponse;
        }

        user.savedRestaurants.push(restaurantID);
        const userUpdated = await user.save();

        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Cannot save restaurant"
                }
            }
        }
        return serviceResponse;

    }catch (e) {
        throw e;
    }
}

service.findOneWithToken = async (token) => {
    let serviceResponse={
        success: true,
        content:{}
    }

    try{
        const user = await UserModel.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }})
            .select("-hashedPassword")
            .exec();
        if(!user){
            serviceResponse={
                success: false,
                content: {
                    error: "User not found"
                }
            }
        }else{
            serviceResponse.content=user;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.removeFavoriteRestaurant = async (user, restaurantID) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Restaurant removed"
        }
    }

    try {
        
        const alreadyExists=user.savedRestaurants.some(restaurant => restaurant.equals(restaurantID));
        if(!alreadyExists){
            serviceResponse={
                success: false,
                content: {
                    message: "Restaurant already removed"
                }
            }
            return serviceResponse;
        }
        
        const index = user.savedRestaurants.indexOf(restaurantID);
        if(index > -1){
            user.savedRestaurants.splice(index,1);
        }

        //user.savedRestaurants.push(restaurantID);
        const userUpdated = await user.save();

        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Cannot save restaurant"
                }
            }
        }
        return serviceResponse;

    }catch (e) {
        throw e;
    }
}

service.removeFavoriteProduct = async (user, productID) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Product removed"
        }
    }

    try {
        
        const alreadyExists=user.savedProducts.some(product => product.equals(productID));
        if(!alreadyExists){
            serviceResponse={
                success: false,
                content: {
                    message: "Product already removed"
                }
            }
            return serviceResponse;
        }
        
        const index = user.savedProducts.indexOf(productID);
        if(index > -1){
            user.savedProducts.splice(index,1);
        }

        //user.savedRestaurants.push(restaurantID);
        const userUpdated = await user.save();

        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Cannot save product"
                }
            }
        }
        return serviceResponse;

    }catch (e) {
        throw e;
    }
}

module.exports = service;