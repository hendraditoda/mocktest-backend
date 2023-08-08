const router = require('express').Router();

const userRoutes = require('./user.routes');
const userAPIRoutes = require('./api/user.routes');
// const oauthRouter = require('./oauth');

// const scoreAPIRoutes = require('./api/score.routes');
// const gameAPIRoutes = require('./api/game.routes');

// MVVM
router.use('/api/user', userRoutes);
// API
router.use('/api/v1/user', userAPIRoutes);
// router.use('/api/v1/user', oauthRouter);
// router.use('/api/v1/score', scoreAPIRoutes);
// router.use('/api/v1/game', gameAPIRoutes);

module.exports = router;
