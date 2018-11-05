const { getUserId } = require('../../utils');

const weeklyReport = {

  createWeeklyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    const hasPermissions = ctx.request.user.roles.some(role =>
      ['TEAM_LEADER'].includes(role)
    );

    if (!hasPermissions) {
      throw new Error("You don't have permission to do that!")
    }

    return ctx.db.mutation.createWeeklyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          }
        },
      },
      info
    );
  },

};

module.exports = { weeklyReport };

