const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/userModel");
const { blacklistModel } = require("../model/blacklistModel");

const userResolvers = {
  Mutation: {
    registerUser: async (_, { username, email, password, role }) => {
      try {
        if (!email || !username || !password || !role) {
          throw new Error("Please provide all the fields");
        }

        const existingEmail = await UserModel.findOne({ email });

        if (existingEmail) {
          throw new Error("This Email is already taken.");
        } else {
          const hash = await bcrypt.hash(password, 5);
          const user = new UserModel({ username, email, password: hash, role });

          await user.save();
          return { message: "User has been registered" };
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new Error("Invalid Credentials");
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
          const accessToken = jwt.sign(
            { userId: user._id },
            process.env.secretkey,
            {
              expiresIn: "7d",
            }
          );

          const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.refreshSecretkey,
            {
              expiresIn: "30d",
            }
          );

          return {
            message: "Login Successfully",
            accessToken,
            refreshToken,
            uid: user._id,
          };
        } else {
          throw new Error("Invalid Credentials");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    logoutUser: async (_, { token }) => {
      try {
        if (!token) {
          throw new Error("Token not provided");
        }

        const existingToken = await blacklistModel.findOne({ token });

        if (existingToken) {
          throw new Error("Token already blacklisted");
        }

        const blacklistedToken = new blacklistModel({ token });
        await blacklistedToken.save();

        return "Logged out successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Query: {
    getNewToken: async (_, { refresh_token }) => {
      try {
        if (!refresh_token) {
          throw new Error("Login Again");
        }

        jwt.verify(refresh_token, process.env.refreshSecretkey, (err, decoded) => {
          if (err) {
            throw new Error("Invalid or expired refresh token. Please Login First");
          } else {
            const newAccessToken = jwt.sign(
              { userId: decoded.userId },
              process.env.secretkey,
              {
                expiresIn: "1h",
              }
            );

            return { message: "Login Successfully", token: newAccessToken };
          }
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = { userResolvers };
