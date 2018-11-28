const { getUserId } = require('../utils');
const { forwardTo } = require('prisma-binding');

const Query = {
  info: () => `GraphQL API of Reporting System`,

  divisions: forwardTo('db'),
  dailyReport: forwardTo('db'),
  users: forwardTo('db'),
  team: forwardTo('db'),
  teams: forwardTo('db'),
  project: forwardTo('db'),
  projects: forwardTo('db'),
  group: forwardTo('db'),

  me: (parent, args, ctx, info) => {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },

  dailyReports: async (parent, args, ctx, info) => {
    const { where, orderBy, first, skip } = args;

    const dailyReports = await ctx.db.query.dailyReports({
      ...args
    });

    const dailyReportsConnection = await ctx.db.query.dailyReportsConnection(
      { where },
      `{ aggregate { count } }`
    );

    return {
      count: dailyReportsConnection.aggregate.count,
      dailyReportIds: dailyReports.map(dailyReport => dailyReport.id),
      orderBy
    };
  },

  userReports: async (parent, args, ctx, info) => {
    const id = getUserId(ctx);

    const { skip, first, orderBy } = args;

    const dailyReports = await ctx.db.query.dailyReports({
      where: { author: { id } },
      skip,
      first,
      orderBy
    });

    const dailyReportsConnection = await ctx.db.query.dailyReportsConnection(
      { where: { author: { id } } },
      `{ aggregate { count } }`
    );

    return {
      count: dailyReportsConnection.aggregate.count,
      dailyReportIds: dailyReports.map(dailyReport => dailyReport.id),
      orderBy
    };
  }
};

module.exports = { Query };
