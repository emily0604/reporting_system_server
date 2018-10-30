const { getUserId } = require('../utils');
const { forwardTo } = require('prisma-binding');

const Subscription = {
  dailyReport: {
    subscribe: forwardTo('db')
  },
  weeklyReport: {
    subscribe: forwardTo('db')
  }
};
module.exports = { Subscription };
