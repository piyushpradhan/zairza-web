const express = require("express");
const router = express.Router();
const checkIfAuthenticated = require("../firebase/firebaseAuth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { user: req.user });
});

/* GET auth page. */
router.get("/auth", function (req, res, next) {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("pages/auth");
});

/* GET profile page. */
router.get("/me", checkIfAuthenticated, function (req, res, next) {
  res.render("pages/me", { user: req.user });
  console.log(req.user);
});

/* GET settings page. */
router.get("/settings", checkIfAuthenticated, function (req, res, next) {
  res.render("pages/settings");
});

/* GET forgot password page. */
router.get("/forgot", function (req, res, next) {
  res.render("pages/forgot_password");
});

/* GET profile page. */
router.get("/profile", checkIfAuthenticated, function (req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }
  let google = false,
    github = false;
  req.user.third_party_auth.forEach((provider) => {
    if (provider.provider_name === "google") {
      google = true;
    } else if (provider.provider_name === "github") {
      github = true;
    }
  });
  res.render("pages/profile", { user: req.user, google, github });
});

/* GET temp page. */
router.get("/tmp", function (req, res, next) {
  res.render("pages/500");
});

/* GET newPassword page. */
router.get("/forgot/:token", function (req, res, next) {
  ResetRequest.findById(req.params.token, function (err, request) {
    if (err) return next(err);
    if (!request) return next();
    res.render("pages/newPassword");
  });
});

module.exports = router;
