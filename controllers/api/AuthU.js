const UserService = require("../../services/UserService");
const crypto = require('crypto');
const controller = {}

controller.register = async (req, res) => { 
    const fieldValidation = UserService.verifyRegisterFields(req.body);
    if (!fieldValidation.success) { 
        return res.status(400).json(fieldValidation.content)
    }
    try {
        const {email, username} = req.body;
        const userExists = await UserService.findOneUsernameEmail(username, email);
        
        if (userExists.success) { 
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        const userRegistered = await UserService.register(req.body)
        if (!userRegistered.success) { 
            return res.status(409).json(userRegistered.content);
        }
        return res.status(201).json(userRegistered.content);
    } catch (e) { 
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

controller.login = async (req, res) => { 
	const fieldValidation = UserService.verifyLoginFields(req.body);
	if (!fieldValidation.success) { 
		return res.status(400).json(fieldValidation.content);
	}

	try {
		const { identifier, password } = req.body;
		

		const userExists = await UserService.findOneUsernameEmail(identifier, identifier);
		if (!userExists.success) { 
			return res.status(404).json(userExists.content);
		}

		const user = userExists.content;

		if (!user.comparePassword(password)) {
			return res.status(401).json({
				error: "Incorrect password"
			})
		}

		// const token = createToken(user._id);

		// const tokenRegistered = await UserService.registerToken(user, token);
		// if (!tokenRegistered.success) { 
        //     return res.status(409).json(tokenRegistered.content);
		// }
		
		return res.status(200).json(
			user._id
		)
	} catch (error) {
		return res.status(500).json({
			error: "Internal server error"
		})
	}
}

controller.forgotPassword = async (req,res) => {
	var token;
	crypto.randomBytes(20, function(err, buf) {
		token = buf.toString('hex');
	});
	const { identifier } = req.body;
	const userExists = await UserService.findOneUsernameEmail(identifier, identifier);
	if (!userExists.success) { 
		req.flash('error', 'No account with that email address exists.');
		return res.redirect('/test/authU/forgot');
	}

	
	//user.resetPasswordToken = token;
	//user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	//luego guardar

	//Enviando el correo
	const nodemailer = require('nodemailer');
	
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: process.env.SENDEREMAIL,
		  pass: process.env.SENDERPASSWORD
		}
	  });
	  const mailOptions = {
		from: 'ilikeoctocats@gmail.com',
		to: 'secg.1994@gmail.com',
		subject: 'FoodSight Password Reset',
		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		'http://' + req.headers.host + '/test/authU/reset/' + token + '\n\n' +
		'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	  };

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			req.flash('error', 'An error has ocurred, please contact the admin');
			return res.redirect('/test/authU/forgot');
		} else {
			console.log('Email sent')
			req.flash('info', 'An e-mail has been sent to with further instructions.');
			return res.redirect('/test/authU/forgot');
		}
	  });

}

controller.renderForgotView = async (req,res) => {
	return res.render('forgot', {
		user: req.user
	  });
}

module.exports = controller;