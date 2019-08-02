const express = require('express');
const config = require('config');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();

//@route Post api/auth/UpdateProfile
//@desc Update Profile
//@access private
router.post('/UpdateProfile', auth, async (req, res) => {
  try {
    let { name, email, phone } = req.body;

    const profileField = {};
    if (name) profileField.name = name;
    if (email) profileField.email = email;
    if (phone) profileField.phone = phone;

    const user = await User.findOne({ _id: req.user.id });
    if (user) {
      profile = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileField },
        { new: true }
      );
      return res.json(profile);
    } else {
      return res.json({ value: 'not updated' });
    }
  } catch (err) {
    res.status(500).send('server error');
  }
});

//@route Post api/auth/ChangePass
//@desc Change Password
//@access private
router.post(
  '/ChangePass',
  [
    auth,
    [
      check('new_password', 'New Password is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let { new_password } = req.body;

      let user = await User.findOne({ _id: req.user.id });
      if (user) {
        const salt = await bcrypt.genSalt(10);

        const changePass = {};
        changePass.password = await bcrypt.hash(new_password, salt);

        const updateProfile = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: changePass },
          { new: true }
        );
        return res.json(updateProfile);
      }
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
