const { checkPermission } = require('../../utils');
const permittedRoles = ['ADMIN', 'GROUP_LEADER'];

const project = {
  createProject: (parent, args, ctx, info) => {
    checkPermission(ctx.request.roles, permittedRoles);

    const membersId = args.members.map(id => ({
      id
    }));

    return ctx.db.mutation.createProject(
      {
        data: {
          ...args,
          teamLeader: {
            connect: { id: args.teamLeader }
          },
          members: {
            connect: membersId
          }
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
      `{id members { id }}`
    );

    const disconnectUpdates = {
      ...args,
      members: {
        disconnect: project.members
      },
      teamLeader: {
        connect: { id: args.teamLeader }
      }
    };

    const connectUpdates = {
      ...args,
      members: {
        connect: membersId
      },
      teamLeader: {
        connect: { id: args.teamLeader }
      }
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
