const { checkPermission } = require('../../utils');
const permittedRoles = ['ADMIN', 'GROUP_LEADER'];

const project = {
  createProject: (parent, args, ctx, info) => {
    checkPermission(ctx.request.roles, permittedRoles);

    const membersId = args.members.map(id => ({
      id
    }));

    // connect to teamLeader / members if args is given
    const teamLeader = args.teamLeader ? { connect: { id: args.teamLeader } } : null;
    const members = args.members ? { connect: membersId } : null;

    return ctx.db.mutation.createProject(
      {
        data: {
          ...args,
          teamLeader,
          members
        }
      },
      info
    );
  },

  updateProject: async (parent, args, ctx, info) => {
    checkPermission(ctx.request.roles, permittedRoles);

    const { id } = args;
    const membersId = args.members.map(id => ({
      id
    }));

    const project = await ctx.db.query.project(
      {
        where: { id }
      },
      `{id members { id } teamLeader { id }}`
    );

    // connect to teamLeader if args is given
    const teamLeader = args.teamLeader ? { connect: { id: args.teamLeader } } : null;
    const members = { connect: membersId };

    // if project.teamLeader is null, then keep it null
    // else if project.leader has value, then disconnect
    const disconectTeamLeaderSelector = project.teamLeader === null ? null : { disconnect: true };

    const disconnectUpdates = {
      ...args,
      members: {
        disconnect: project.members
      },
      teamLeader: disconectTeamLeaderSelector
    };

    const connectUpdates = {
      ...args,
      members,
      teamLeader
    };

    delete disconnectUpdates.id;
    delete connectUpdates.id;

    await ctx.db.mutation.updateProject(
      {
        where: { id },
        data: disconnectUpdates
      },
      info
    );

    return ctx.db.mutation.updateProject(
      {
        where: { id },
        data: connectUpdates
      },
      info
    );
  },

  deleteProject: (parent, args, ctx, info) => {
    checkPermission(ctx.request.roles, permittedRoles);
    const { id } = args;
    return ctx.db.mutation.deleteProject({ where: { id } }, info);
  }
};

module.exports = { project };
