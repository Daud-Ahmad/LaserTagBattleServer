const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const router = express.Router();

//@route Get api/auth
//@desc get user information by sending token
//@access private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//@route Post api/auth
//@desc Authencate user and get token
//@access public
router.post(
  '/',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).send('Incorrect email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send('Incorrect email or password');
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('secritValue'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
