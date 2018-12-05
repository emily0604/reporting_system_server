const { getUserId, checkPermission } = require('../../utils');

const permittedRoles = ['ADMIN', 'TEAM_LEADER'];

const weeklyReport = {
  createWeeklyReport: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx);
    checkPermission(ctx.request.roles, permittedRoles);
    const membersActivities = args.membersActivities.map(member => {
      return {
        user: {connect: {id: member.user}},
        activities: {
          create: member.activities
        }
      }
    });

    return ctx.db.mutation.createWeeklyReport(
      {
        data: {
          ...args,
          author: {
            connect: { id: userId }
          },
          membersActivities: {
            create: membersActivities
          }
        }
      },
      info
    );
  }
};

module.exports = { weeklyReport };
