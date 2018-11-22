const { getUserId } = require('../../utils');

const dailyReport = {
  createDailyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    const taskArgs = args.tasks.map(task => ({
      url: task.url,
      logtime: task.logtime,
      project: { connect: { id: task.projectId } },
      members: { connect: [{ id: userId }] }
    }));

    return ctx.db.mutation.createDailyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          },
          tasks: {
            create: taskArgs
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
      author: { id: userId }
    });

    if (!reportExists) {
      throw new Error('Daily Report not found or you are not the author');
    }

    const dailyReport = await ctx.db.query.dailyReport(
      {
        where: { id: args.id }
      },
      `{ id tasks { id } }`
    );

    // Update 1: Delete all of tasks in dailyReport.
    // Check if daily Report don't have any tasks, skip this step.
    if (dailyReport.tasks.length > 0) {
      const updates1 = {
        ...args,
        tasks: {
          delete: dailyReport.tasks
        }
      };

      delete updates1.id;

      await ctx.db.mutation.updateDailyReport(
        {
          where: { id: args.id },
          data: updates1
        },
        info
      );
    }

    // Update 2: Create new tasks
    // Get all tasks from client.
    const taskArgs = args.tasks.map(task => ({
      url: task.url,
      logtime: task.logtime,

      // connect to exists project
      project: { connect: { id: task.projectId } }
    }));

    const updates2 = {
      ...args,
      tasks: {
        create: taskArgs
      }
    };

    delete updates2.id;

    return ctx.db.mutation.updateDailyReport(
      {
        where: { id: args.id },
        data: updates2
      },
      info
    );
  },

  deleteDailyReport: async (parent, { id }, ctx, info) => {
    const userId = getUserId(ctx);
    const reportExists = await ctx.db.exists.DailyReport({
      id,
      author: { id: userId }
    });

    if (!reportExists) {
      throw new Error('Daily Report not found or you are not the author');
    }

    return ctx.db.mutation.deleteDailyReport(
      {
        where: { id }
      },
      info
    );
  }
};

module.exports = { dailyReport };
