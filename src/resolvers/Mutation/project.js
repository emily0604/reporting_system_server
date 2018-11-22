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
  }
};

module.exports = { project };
