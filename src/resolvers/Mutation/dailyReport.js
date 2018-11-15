const { getUserId } = require('../../utils');

const dailyReport = {

  createDailyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    const tasksId = args.tasks.map(task => ({ id: task.id }));

    const tasksUrlandLogtime = args.tasks.map(task => ({
        where: { id: task.id },
        data: {  url: task.url,  logtime: task.logtime  }
      })
    );

    // Step 1: Connect to task.
    const dailyReport = await ctx.db.mutation.createDailyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          },
          tasks: {
            connect: tasksId
          }
        },
      },
      info
    );

    // // Step 2: Update field in Task Node.
    return ctx.db.mutation.updateDailyReport(
      {
        where: { id: dailyReport.id },
        data: {
          tasks: {
            update: tasksUrlandLogtime
          }
        }
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
      throw new Error('Daily Report not found or you are not the author');
    }

    const updates = { ...args };

    delete updates.id;

    return ctx.db.mutation.updateDailyReport(
      {
        where: { id: args.id },
        data: updates
      },
      info
    );
  },

  deleteDailyReport: async (parent, { id }, ctx, info) => {
    const userId = getUserId(ctx);
    const reportExists = await ctx.db.exists.DailyReport({
      id,
      author: { id: userId },
    });

    if (!reportExists) {
      throw new Error('Daily Report not found or you are not the author');
    }

    return ctx.db.mutation.deleteDailyReport(
      {
        where: { id },
      },
      info
    );
  },

};

module.exports = { dailyReport };

