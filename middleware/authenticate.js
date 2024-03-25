// authMiddleware.js
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/userModel");
const { blacklistModel } = require("../model/blacklistModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const isBlacklisted = await blacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token is blacklisted" });
    }

    const decodedToken = jwt.verify(token, process.env.secretkey);
    console.log("Decoded Token:", decodedToken);

    const user = await UserModel.findOne({ _id: decodedToken.userId });

    if (!user) {
      return res.status(401).json({ error: "Invalid Token or User not found!" });
    }

    if (user && user._id == decodedToken.userId) {
      // Fetch user IDs of users that the authenticated user follows
      req.user = user;
      next();
    }
  } catch (e) {
    console.error("Authentication error:", e.message);
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token signature" });
    } else if (e.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
};

const isAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access forbidden. Admin role required." });
  }
  next();
};

module.exports = { authMiddleware, isAdminMiddleware };
