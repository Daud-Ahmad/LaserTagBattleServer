const express = require('express');
const teamPlayerModel = require('../../models/TeamPlayersModel');

const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const router = express.Router();

//@route Post api/teamPlayerApi/AddPlayer
//@desc Add new team player in team player schema
//@access private
router.post(
  '/AddPlayer',
  [
    auth,
    [
      check('teamId', 'teamId is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { teamId } = req.body;
      const newPlayer = new teamPlayerModel({
        teamId,
        user: req.user.id
      });

      await newPlayer.save();
      const player = await teamPlayerModel
        .findOne({ user: req.user.id })
        .populate('user', ['name', 'email']);
      res.json(player);
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
