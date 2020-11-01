const UserService = require("../../services/UserService");
const crypto = require('crypto');
const { token } = require("morgan");
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
	const {email} = userExists.content;
	
	const userUpdated = await UserService.updateById(userExists.content, {
		resetPasswordToken: token,
		resetPasswordExpires:  Date.now() + 3600000, //1 hora
	});
	console.log(userUpdated.success);
	//luego guardar

	//Enviando el correo
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	  const msg = {
		from: 'ilikeoctocats@gmail.com',
		to: email,
		subject: 'FoodSight Password Reset',
		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		'http://' + req.headers.host + '/test/authU/reset/' + token + '\n\n' +
		'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	  };
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent')
			req.flash('info', 'An e-mail has been sent to with further instructions.');
			return res.redirect('/test/authU/forgot');
	  	})
	  	.catch((error) => {
			console.log(error);
			req.flash('error', 'An error has ocurred while sending the email, please contact the admin.');
			return res.redirect('/test/authU/forgot');
	  	})

}

controller.renderForgotView = async (req,res) => {
	return res.render('forgot', {
		user: req.user
	  });
}

controller.loadUpdateForm = async(req,res) => {
	const userExists = await UserService.findOneWithToken(req.params.token, Date.now());
	if(!userExists.success){
		req.flash('error', 'Password reset token is invalid or has expired.');
		return res.redirect('/test/authU/forgot');
	}
	return res.render('reset',{
		user: req.user
	});
}

controller.updatePassword = async(req,res) =>{
	const userExists = await UserService.findOneWithToken(req.params.token, Date.now());
	if(!userExists.success){
		req.flash('error', 'Password reset token is invalid or has expired.');
		return res.redirect('/test/authU/forgot');
	}
	const { password, confirm } = req.body;
	
	if(password.toString() != confirm.toString()){
		req.flash('error', 'The password must be the same in both fields');
		return res.redirect('/test/authU/reset/'+userExists.token);
	}

	const userUpdated = await UserService.updateById(userExists.content, {
		password: req.body.password,
		resetPasswordToken: undefined,
		resetPasswordExpires:  undefined,
	});

	const {email} = userExists.content;
	//Enviando el correo
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	  const msg = {
		from: 'ilikeoctocats@gmail.com',
		to: email,
		subject: 'Your password has been changed',
		text: 'Hello,\n\n' +
		'This is a confirmation that the password for your account has just been changed.\n'
	  };
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent')
			req.flash('info', 'An e-mail has been sent confirming the password change.');
			return res.redirect('/test/authU/forgot');
	  	})
	  	.catch((error) => {
			console.log(error);
			req.flash('error', 'An error has ocurred while sending the email, please contact the admin.');
			return res.redirect('/test/authU/forgot');
	  	})
}

module.exports = controller;