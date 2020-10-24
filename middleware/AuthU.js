const {verifyID} = require("../utils/MongoUtils");
const UserService = require("../services/UserService");
const middleware = {};

middleware.verifyAuth = async (req, res, next) => {
    
    const {_id} =req.headers;
    if (!verifyID(_id)) {
        return res.status(400).json({
            error: "Error in ID"
        })
    }

    const userExists = await UserService.findOneById(_id);
    if (!userExists.success) {
        return res.status(404).json(userExists.content);
    }

    req.user = userExists.content;

    next();
}

module.exports = middleware;