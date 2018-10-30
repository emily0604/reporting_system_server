const { getUserId } = require('../utils');
const { forwardTo } = require('prisma-binding');

const Query = {
  info: () => `This is the API of a Reporting System`,

  divisions: forwardTo('db'),
  dailyReports: forwardTo('db'),
  dailyReport: forwardTo('db'),

  me: (parent, args, ctx, info) => {
    const id = getUserId(ctx);
    // Check if there is a current user ID:
    if (!id) return null;
    return ctx.db.query.user({ where: { id } }, info);
  },

  userReports: async (parent, args, ctx, info) => {
    const id = getUserId(ctx);
    if (!id) return null;

    const { skip, first } = args;
    const dailyReports = await ctx.db.query.dailyReports({
      where: { author: { id } },
      skip,
      first
    });
    const dailyReportsConnection = await ctx.db.query.dailyReportsConnection(
      { where: { author: { id } } },
      `{ aggregate { count } }`
    );

    return {
      count: dailyReportsConnection.aggregate.count,
      dailyReportIds: dailyReports.map(dailyReport => dailyReport.id)
    };
  }
};

module.exports = { Query };
