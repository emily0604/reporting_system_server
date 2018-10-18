const division = {

  createDivision: async (parent, args, ctx, info) => {
    const { name, description } = args.data;
    return ctx.db.mutation.createDivision(
      {
        data: { name, description },
      },
      info
    )
  },

  updateDivision: async (parent, args, ctx, info) => {
    const { id, name, description } = args.data;
    return ctx.db.mutation.updateDivision(
      {
        where: { id },
        data: { name, description },
      },
      info
    )
  },

  deleteDivision: async (parent, args, ctx, info) => {
    const { id } = args.data;
    return ctx.db.mutation.deleteDivision(
      {
        where: { id },
      },
      info
    )
  },

};

module.exports = { division };

