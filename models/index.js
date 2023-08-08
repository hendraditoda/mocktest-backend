const dbConfig = require('../config/db.config.js');
const { Op } = require('sequelize');

const Sequelize = require('sequelize');
const client = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.client = client;

// MODELS
db.users = require('./user.model.js')(client, Sequelize);
// db.games = require('./game.model.js')(client, Sequelize);
// db.scores = require('./score.model.js')(client, Sequelize);

// ASSOCIATIONS
// USER-SCORE
// db.users.hasMany(db.scores, { foreignKey: 'userId', onDelete: 'CASCADE' });
// db.scores.belongsTo(db.users, { foreignKey: 'userId', onDelete: 'CASCADE' });

// GAME-SCORE
// db.games.hasMany(db.scores, { foreignKey: 'gameId', onDelete: 'CASCADE' });
// db.scores.belongsTo(db.games, { foreignKey: 'gameId', onDelete: 'CASCADE' });

function createGames() {
  db.games.bulkCreate(
    [
      {
        id: 1,
        title: 'Rock Paper Scissor',
        description:
          'The familiar game of Rock, Paper, Scissors is played like this: at the same time, two players display one of three symbols: a rock, paper, or scissors. A rock beats scissors, scissors beat paper by cutting it, and paper beats rock by covering it.',
        thumbnail: 'https://i.ibb.co/8cj8wHx/top-title.webp',
        play_count: 0,
        how_to_play:
          'You have to choose between rock, scissors, or paper. After that you click on your choice and wait to see the results win, lose, or draw',
        release_date: new Date('2023-05-15'),
        latest_update: 'May 15, 2023',
      },
      {
        id: 2,
        title: 'Guess The Number',
        description:
          'The number guessing game is a game where the computer generates a random number and we need to guess that number in minimum tries',
        thumbnail: 'https://easyshiksha.com/online_courses/assets/games/number-guessing/images/banner.png',
        play_count: 0,
        how_to_play: 'Guess the number from 1 - 100',
        release_date: new Date('2023-05-15'),
        latest_update: 'May 15, 2023',
      },
    ],
    {
      updateOnDuplicate: [
        'title',
        'description',
        'thumbnail',
        'play_count',
        'how_to_play',
        'release_date',
        'latest_update',
      ],
    }
  );
}

setTimeout(createGames, 2000);

function updateScore() {
  db.scores.update({ achievement: 'Newcomers' }, { where: { score: { [Op.lt]: 50 } } }),
    db.scores.update({ achievement: 'Bronze Rank' }, { where: { score: { [Op.between]: [50, 99] } } }),
    db.scores.update({ achievement: 'Silver Rank' }, { where: { score: { [Op.between]: [100, 199] } } }),
    db.scores.update({ achievement: 'Gold Rank' }, { where: { score: { [Op.between]: [200, 299] } } }),
    db.scores.update({ achievement: 'Platinum Rank' }, { where: { score: { [Op.between]: [300, 499] } } }),
    db.scores.update({ achievement: 'Diamond Rank' }, { where: { score: { [Op.between]: [500, 999] } } }),
    db.scores.update({ achievement: 'Ruby Rank' }, { where: { score: { [Op.between]: [1000, 1499] } } }),
    db.scores.update({ achievement: 'Legend Rank' }, { where: { score: { [Op.gt]: 1500 } } });
}

setTimeout(updateScore, 4000);

module.exports = db;
