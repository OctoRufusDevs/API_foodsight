const UserService = require("../../services/UserService");
const ProductService = require("../../services/ProductService");
const RestaurantService = require("../../services/RestaurantService")
const {verifyID} = require("../../utils/MongoUtils");
const User = require("../../models/User");
const { use } = require("../../routes/test/UserRoutes");
const controller = {}

controller.getUser = (req,res)=>{
    const {user} = req;
    if(!user) {
        return res.status(404).json({
            error:"User not found"
        })
    }
    return res.status(200).json(user);
}

controller.updateById = async (req, res) =>{
    const {user} = req;

    const verifyField = UserService.verifyUpdatedFields(req.body);
    if(!verifyField.success){
        return res.status(400).json(verifyField.content);
    }
    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }

    try {
        const userUpdated = await UserService.updateById(user,verifyField.content);
        if(!userUpdated.success){
            return res.status(409).json(userUpdated.content);
        }
        return res.status(200).json(userUpdated);
    }catch (e) {
        return res
    }

}

controller.saveProduct = async (req, res) =>{
    const {productID} = req.body;
     const {user} =req;

     if(!verifyID(productID)){
         return res.status(400).json({
             error:"Error in ID"
         });
     }

     try{
         const productExists = await ProductService.findOneById(productID);
         if(!productExists){
             return res.status(400).json(productExists.content);
         }

         const userUpdated = await UserService.savedFavoriteProduct(user,productID);
         if(!userUpdated.success){
             return res.status(409).json(userUpdated.content);
         }
         return res.status(200).json(userUpdated);

     }catch (e) {
         return res.status(500).json({
             error:"Internal Server Error"
         })
     }
}

controller.saveRestaurant = async (req, res) =>{
    const {restaurantID} = req.body;
     const {user} =req;

     if(!verifyID(restaurantID)){
         return res.status(400).json({
             error:"Error in ID"
         });
     }

     try{
         const restaurantExists = await RestaurantService.findOneById(restaurantID);
         if(!restaurantExists){
             return res.status(400).json(restaurantExists.content);
         }

         const userUpdated = await UserService.savedFavoriteRestaurant(user,restaurantID);
         if(!userUpdated.success){
             return res.status(409).json(userUpdated.content);
         }
         return res.status(200).json(userUpdated);

     }catch (e) {
         return res.status(500).json({
             error:"Internal Server Error"
         })
     }
}

controller.getFavProducts = async (req,res) =>{
    const {_id} = req.body;

    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }

    try {
        const userExists = await UserService.findOneById(_id);
        if(!userExists.success){
            return res.status(404).json(userExists.content);
        }

        const user = userExists.content;

        return res.status(200).json({
            ...user.savedProducts,            
        })

    }catch (e) {
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }

}

controller.getFavRestaurant = async (req,res) =>{
    const {_id} = req.body;

    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }

    try {
        const userExists = await UserService.findOneById(_id);
        if(!userExists.success){
            return res.status(404).json(userExists.content);
        }

        const user = userExists.content;

        return res.status(200).json({
            ...user.savedRestaurants,            
        })

    }catch (e) {
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }

}
controller.removeFavRestaurant = async (req,res) => {
    const {_restaurantId} = req.body;
    const {user} = req;
    if(!verifyID(_restaurantId)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }
    try {
        /*const userExists = await UserService.findOneById(_id);
        if(!userExists.success){
            return res.status(404).json(userExists.content);
        }*/

        const userUpdated = await UserService.removeFavoriteRestaurant(user,_restaurantId);
        //const user = userExists.content;
        if(userUpdated.success){
            return res.status(200).json({
                success: true,
                ...user.savedRestaurants,            
            })
        }else{
            return res.status(409).json(userUpdated.content);
        }
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }

}

controller.removeFavProduct = async (req,res) => {
    const {_productId} = req.body;
    const {user} = req;
    if(!verifyID(_productId)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }
    try {
        const userUpdated = await UserService.removeFavoriteProduct(user,_productId);
        if(userUpdated.success){
            return res.status(200).json({
                success: true,
                ...user.savedProducts,            
            })
        }else{
            return res.status(409).json(userUpdated.content);
        }
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }

}

module.exports = controller;