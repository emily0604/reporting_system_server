const { getUserId } = require('../utils');
const { forwardTo } = require('prisma-binding');


const Query = {
  info: () => `This is the API of a Reporting System`,

  divisions: forwardTo('db'),
  issues: forwardTo('db'),
  issue: forwardTo('db'),
  dailyReports: forwardTo('db'),
  dailyReport: forwardTo('db'),

  me: (parent, args, ctx, info) => {
    const id = getUserId(ctx);
    // Check if there is a current user ID:
    if (!id) return null;
    return ctx.db.query.user({ where: { id } }, info)
  },

};

module.exports = { Query };

