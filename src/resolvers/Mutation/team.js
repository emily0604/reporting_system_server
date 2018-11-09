const { getUserId } = require('../../utils');

const team = {

  createTeam: async (parent, args, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    const hasPermissions = ctx.request.user.roles.some(role =>
      ['GROUP_LEADER', 'ADMIN'].includes(role)
    );

    if (!hasPermissions) {
      throw new Error("You don't have permission to do that!")
    }

    const { name, description } = args;

    return ctx.db.mutation.createTeam(
      {
        data: { name, description },
      },
      info
    )
  },

  updateTeam: async (parent, args, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    const hasPermissions = ctx.request.user.roles.some(role =>
      ['GROUP_LEADER', 'ADMIN'].includes(role)
    );

    if (!hasPermissions) {
      throw new Error("You don't have permission to do that!")
    }

    // Check if team exists
    const teamExists = await ctx.db.exists.Team({
      id: args.id
    });

    if (!teamExists) throw new Error('Team not found');

    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateTeam(
      {
        where: { id: args.id },
        data: updates
      },
      info
    )
  },

  deleteTeam: async (parent, { id }, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    const hasPermissions = ctx.request.user.roles.some(role =>
      ['GROUP_LEADER', 'ADMIN'].includes(role)
    );

    if (!hasPermissions) {
      throw new Error("You don't have permission to do that!")
    }

    // Check if team exists
    const teamExists = await ctx.db.exists.Team({
      id
    });

    if (!teamExists) throw new Error('Team not found');

    return ctx.db.mutation.deleteTeam(
      {
        where: { id },
      },
      info
    )
  },

};

module.exports = { team };

