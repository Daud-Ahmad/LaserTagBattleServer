const express = require('express');

const config = require('config');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

const IndividualPlayers = require('../../models/IndividualPlayers');

const { check, validationResult } = require('express-validator');

const router = express.Router();

//@route Post api/individualPlayerApi/AddPlayer
//@desc Add new individual player in individual player schema
//@access private
router.post(
  '/AddPlayer',
  [
    auth,
    [
      check('irId', 'irId is required')
        .not()
        .isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { irId } = req.body;
      const newPlayer = new IndividualPlayers({
        irId,
        user: req.user.id
      });

      const player = await newPlayer.save();
      res.json(player);
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

//@route Get api/individualPlayerApi/GetAllPlayer
//@desc get All individuals players
//@access public
router.get(
  '/GetAllPlayer',

  async (req, res) => {
    try {
      const individual = await IndividualPlayers.find().populate('user', [
        'name',
        'email'
      ]);

      res.json(individual);
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

//@route POST api/individualPlayerApi/KillPlayer
//@desc update the killed player data
//@access private
router.post(
  '/KillPlayer/',
  [
    auth,
    [
      check('isAlive', 'isAlive field required')
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
      const individual = await IndividualPlayers.findOne({ user: req.user.id });
      if (individual) {
        const update = await IndividualPlayers.findOneAndUpdate(
          { user: req.user.id },
          { isAlive: req.body.isAlive }
        );

        res.json(update);
      }
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

//@route DELETE api/individualPlayerApi/DeletePlayer/:id
//@desc delete individual player
//@access private
router.delete(
  '/DeletePlayer/:id',
  auth,

  async (req, res) => {
    try {
      const individual = await IndividualPlayers.findOne(req.param.id);

      if (individual) {
        await individual.remove();
        res.json({ msg: 'removed' });
      } else {
        res.json({ msg: 'no data found' });
      }
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
