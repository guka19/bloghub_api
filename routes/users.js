var express = require('express');
var router = express.Router();
const userService = require("../services/userService");
const authenticate = require("../middlewares/authMiddleware");

// User routes
router.post("/register", userService.register);
router.post("/login", userService.login);
router.get("/getAll", userService.getAll);
router.get("/getById", authenticate,  userService.getUserById);
router.put("/update", authenticate, userService.updateUser);
router.delete("/delete", authenticate,  userService.deleteUser);

module.exports = router;
    