const RestaurantModel = require('../models/Restaurant');
const emailRegex = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
const service = {};

service.verifyRegisterFields = ({name, email, password, description, phone, rating ,photo, facebook, instagram}) => {
    let serviceResponse = {
        success:true,
        content:{}
    }
    if(!description || !email || !password || !name || !phone || !rating || !photo || !facebook || !instagram){
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
    return serviceResponse
};

service.verifyLoginFields = ({email, password}) =>{
    let serviceResponse = {
		success: true,
		content: {}
	}

	if (!email || !password) { 
		serviceResponse = {
			success: false,
			content: {
				error: "Required fields empty"
			}
		}

		return serviceResponse;
	}

	return serviceResponse;
}
service.verifyUpdatedFields = ({name, email, password, description, phone, rating ,photo, facebook, instagram})=>{
    let serviceResponse={
        success:true,
        content: {}
    }

    if(name) serviceResponse.content.name = name;
    if(phone) serviceResponse.content.phone = phone;
    if(password) serviceResponse.content.password = password;
    if(description) serviceResponse.content.description = description;
    if(photo) serviceResponse.photo = photo;
    if(facebook) serviceResponse.facebook = facebook;
    if(instagram) serviceResponse.instagram = instagram;
    if(rating) serviceResponse.content.rating = rating;

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

service.create = async({name, email, password, description, phone, rating, photo, facebook, instagram}) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Restaurant created I think...",
        }
    }

    try{
        const restaurant = new RestaurantModel({
            name,
            email,
            password,
            description,
            phone,
            rating,
            photo,
            facebook,
            instagram
        });
        
        const restaurantSaved = await restaurant.save();
        if(!restaurantSaved){
            serviceResponse = {
                success: false,
                content: {
                    error: "Restaurant not created"
                }
            }
        }else{
            serviceResponse = {
                success: true,
                content: {
                    id: restaurantSaved._id,
                    message: "Restaurant created",
                }
            }
        }

        return serviceResponse;
    }catch(error){
        throw new Error("Internal Server Error")
    }finally{
        return serviceResponse;
    }
};

service.findOneById = async (_id) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Restaurant not Found"
        }
    }

    try{
        const restaurant = await RestaurantModel.findById(_id).exec();
        if(!restaurant){
            serviceResponse={
                success: false,
                content: {
                    error: "Restaurant not found",
                }
            }
        }else {
            serviceResponse.content = restaurant;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.updateById = async (restaurant, contentToUpdate) =>{
    let serviceResponse ={
        success:true,
        content:{
            message: "Restaurant Updated "
        }
    }

    try {
        const restaurantUpdated = await RestaurantModel.findByIdAndUpdate(restaurant._id,{...contentToUpdate});
        if(!restaurantUpdated){
            serviceResponse={
                success: false,
                content: {
                    error:"Restaurant not updated"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }


};

service.findAll = async () => {
    let serviceResponse = {
    success:true,
    content: {
        message: "Dont mind me getting all restaurants"
    }
}

try{
        const restaurants = await RestaurantModel.find({},undefined,undefined).exec();
        serviceResponse.content = {
            restaurants: restaurants,
            count: restaurants.length,
        }

        return serviceResponse;
}catch (e) {
    console.log(e);
    throw e;
}
}

service.deleteOneById = async (_id) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Restaurant Deleted!!"
        }
    }

    try {
        const restaurantDeleted = await RestaurantModel.findByIdAndDelete(_id).exec();
        if(!restaurantDeleted){
            serviceResponse={
                success: false,
                content: {
                    message: "Restaurant not deleted"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }

}

service.findOneByEmail = async(email) => {
    let serviceResponse = {
        success: true,
        content: {},
    }
    try{
        const restaurant = await RestaurantModel.findOne({email: email}).exec();
        if(!restaurant){
            serviceResponse = {
                success: false,
                content: {
                    error: "This email has not been registered",
                }
            }
        }else{
            serviceResponse.content = restaurant;
        }
        return serviceResponse;
    }catch(e){
        throw new Error ("Internal Server Error");
    }
}

service.findOneWithToken = async (token) => {
    let serviceResponse={
        success: true,
        content:{}
    }

    try{
        const restaurant = await RestaurantModel.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }})
            .select("-hashedPassword")
            .exec();
        if(!restaurant){
            serviceResponse={
                success: false,
                content: {
                    error: "Restaurant not found"
                }
            }
        }else{
            serviceResponse.content=restaurant;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

module.exports = service;