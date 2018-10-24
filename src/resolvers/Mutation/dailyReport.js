const { getUserId } = require('../../utils');

const dailyReport = {

  createDailyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    return ctx.db.mutation.createDailyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          },
          issues: {
            connect: args.issues
          },
        },
      },
      info
    );
  },

  updateDailyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    const reportExists = await ctx.db.exists.DailyReport({
      id: args.id,
      author: { id: userId },
    });

    if (!reportExists) {
      throw new Error(`Daily Report not found or you're not the author`)
    }

    const dailyReport = await ctx.db.query.dailyReport({
      where: { id: args.id }
    }, `{ id issues { id } }`);

    const updates = {
      ...args,
      issues: {
        disconnect: dailyReport.issues,
        connect: args.issues
      },
    };

    delete updates.id;

    return ctx.db.mutation.updateDailyReport(
      {
        where: { id: args.id },
        data: updates
      },
      info
    )
  },

  deleteDailyReport: async (parent, { id }, ctx, info) => {
    const userId = getUserId(ctx);
    const reportExists = await ctx.db.exists.DailyReport({
      id,
      author: { id: userId },
    });

    if (!reportExists) {
      throw new Error(`Daily Report not found or you're not the author`)
    }

    return ctx.db.mutation.deleteDailyReport(
      {
        where: { id },
      },
      info
    )
  },

};

module.exports = { dailyReport };

