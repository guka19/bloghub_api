const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const exists = await userModel.findOne({ email: req.body.email });

      if (exists) {
        res.status(409).json({ message: "user_already_exists" });
      }

      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const user = await new userModel({
        userName: req.body.userName,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        bio: req.body.bio,
        role: "user",
        password: hashedPassword,
      }).save();

      const token = jwt.sign(
        {
          id: user._id,
          userName: user.userName,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          role: user.role,
        },
        process.env.SECRET_KEY
      );

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json("Error: ", err);
    }
  },

  login: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });

      if (!user) {
        res.status(401).json({ message: "user_not_found" });
      }

      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          {
            id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            role: user.role,
          },
          process.env.SECRET_KEY
        );

        res.json({ token });
      } else {
        return res.status(404).json({
          message: "user_not_found",
        });
      }
    } catch (err) {
      res.status(500).json("Error: ", err);
    }
  },

  getAll: (req, res) => {
    userModel
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.user.id;

      if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied." });
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.user.id;

      if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied." });
      }

      const deletedUser = await userModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      res.json({ message: "User deleted successfully." });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
