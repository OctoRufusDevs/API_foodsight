const RestaurantService = require("../../services/RestaurantService");

const controller = {}

controller.register = async (req, res) => { 
    const fieldValidation = RestaurantService.verifyRegisterFields(req.body);
    if (!fieldValidation.success) { 
        return res.status(400).json(fieldValidation.content)
    }
    try {
        const {email } = req.body;
        const restaurantExists = await RestaurantService.findOneByEmail(email);
        
        if (restaurantExists.success) { 
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        const restaurantRegistered = await RestaurantService.create(req.body)
        if (!restaurantRegistered.success) { 
            return res.status(409).json(restaurantRegistered.content);
        }
        return res.status(201).json(restaurantRegistered.content);
    } catch (e) { 
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

controller.login = async (req, res) => { 
	const fieldValidation = RestaurantService.verifyLoginFields(req.body);
	if (!fieldValidation.success) { 
		return res.status(400).json(fieldValidation.content);
	}

	try {
		const { email, password } = req.body;

		const restaurantExists = await RestaurantService.findOneByEmail(email);
		if (!restaurantExists.success) { 
			return res.status(404).json(restaurantExists.content);
		}

		const restaurant = restaurantExists.content;

		if (!restaurant.comparePassword(password)) {
			return res.status(401).json({
				error: "Incorrect password"
			})
		}

		// const token = createToken(restaurant._id);

		// const tokenRegistered = await RestaurantService.registerToken(restaurant, token);
		// if (!tokenRegistered.success) { 
        //     return res.status(409).json(tokenRegistered.content);
		// }
		
		return res.status(200).json(
			restaurant._id
		)
	} catch (error) {
		return res.status(500).json({
			error: "Internal server error"
		})
	}
}

module.exports = controller;