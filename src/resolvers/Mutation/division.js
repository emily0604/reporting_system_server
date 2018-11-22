const { getUserId, checkPermission } = require('../../utils');
const permittedRoles = ['ADMIN'];

const division = {
  createDivision: async (parent, args, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    checkPermission(ctx.request.roles, permittedRoles);

    const { name, description } = args;

    return ctx.db.mutation.createDivision(
      {
        data: { name, description }
      },
      info
    );
  },

  updateDivision: async (parent, args, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    checkPermission(ctx.request.roles, permittedRoles);

    // Check if division exists
    const divisionExists = await ctx.db.exists.Division({
      id: args.id
    });

    if (!divisionExists) throw new Error('Division not found');

    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateDivision(
      {
        where: { id: args.id },
        data: updates
      },
      info
    );
  },

  deleteDivision: async (parent, { id }, ctx, info) => {
    // Check if user logged in
    const userId = getUserId(ctx);

    // Check if user has permission to do this
    checkPermission(ctx.request.roles, permittedRoles);

    // Check if division exists
    const divisionExists = await ctx.db.exists.Division({
      id
    });

    if (!divisionExists) throw new Error('Division not found');

    return ctx.db.mutation.deleteDivision(
      {
        where: { id }
      },
      info
    );
  }
};

module.exports = { division };
