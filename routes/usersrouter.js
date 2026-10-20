const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);


router.get('/profile', protect, userController.getUserProfile);
router.put('/update-password', protect, userController.updatePassword); // Placé AVANT /:id !


router.get('/', protect, adminOnly, userController.getUsers);
router.put('/:id/role', protect, adminOnly, userController.updateUserRole);



router.get('/:id', protect, adminOnly, userController.getUserById);

module.exports = router;