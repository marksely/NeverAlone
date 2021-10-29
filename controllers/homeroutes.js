const router = require("express").Router();
const { User, Post, Comments } = require("../models/");
const { withAuth } = require("../utils/auth");

// quotes.json contains and array of quotes - used to display a quote at random
const quoteList = require("../db/quotes.json");

//_____________-- ROUTES --_____________________

// gets login page on initial load, if logged in takes user to homepage
router.get("/", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/homepage");
    }
    res.render("login");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get sign up page -> if logged in, go to home page
router.get("/sign-up", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/homepage");
    }
    res.render("signup", { logged_in: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get login page -> if logged in, go to home page
router.get("/login", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/homepage");
      return;
    }
    res.render("login", { logged_in: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get profile page when logged in
router.get("/profile", withAuth, async (req, res) => {
  try {
    res.render("profile", { logged_in: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get home page when logged in

router.get("/homepage", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User }],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    // let randomIndex = Math.floor(Math.random() * quoteList.length);
    // let randomQuote = quoteList[randomIndex]
    console.log("Posts", posts);

    res.render("homepage", {
      posts,
      // randomQuote,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
