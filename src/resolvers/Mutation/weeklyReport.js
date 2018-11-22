const { getUserId, checkPermission } = require('../../utils');
const permittedRoles = ['ADMIN', 'TEAM_LEADER'];

const weeklyReport = {
  createWeeklyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    checkPermission(ctx.request.roles, permittedRoles);

    return ctx.db.mutation.createWeeklyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          }
        }
      },
      info
    );
  }
};

module.exports = { weeklyReport };
