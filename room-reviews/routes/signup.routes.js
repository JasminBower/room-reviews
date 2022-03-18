const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
	//res.json("hi");
	res.render("signup");
});

router.post("/signup", async (req, res) => {
	const { password, email, username } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);
	try {
		const newUser = new User({ password: hashed, email, username });
		await newUser.save();
	} catch (err) {
		console.log(err);
	}

	res.redirect("/profile");
});

router.get("/profile", (req, res) => {
	res.render("profile");
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const loggedInUser = await User.findOne({ username });
		const hashedUserPassword = loggedInUser.password;
		const checkPassword = await bcrypt.compare(password, hashedUserPassword);
		if (!checkPassword) {
			throw Error("Incorrect bro");
		}

		console.log(req.session);
		req.session.user = loggedInUser;
		res.redirect("/profile");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
