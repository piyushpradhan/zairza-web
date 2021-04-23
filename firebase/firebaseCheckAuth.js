/* Check for authenticated user */

const admin = require("./firebaseService");

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies != null && req.cookies["zToken"] != null) {
    req.authToken = req.cookies["zToken"];
  } else {
    req.authToken = null;
  }
  next();
};

module.exports = checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.userInfo = userInfo;
      req.authId = userInfo.uid;
      User.findOne({ firebaseUid: userInfo.uid }, function (err, existingUser) {
        if (err) {
          return next(err);
        }
        if (!existingUser) {
          User.create({ firebaseUid: userInfo.uid }, function (err, user) {
            if (err) {
              return next(err);
            }
            req.user = user;
            return next();
          });
        } else {
          req.user = existingUser;
          return next();
        }
      });
    } catch (e) {
      next(e);
    }
  });
};
