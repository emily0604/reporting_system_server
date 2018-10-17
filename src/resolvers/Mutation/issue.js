const issue = {
  createIssue: async (parent, { name, description }, ctx, info) => {
    return ctx.db.mutation.createIssue({
      data: { name, description },
      info
    });
  },

  updateIssue: async (parent, { id, name, description }, ctx, info) => {
    return await ctx.db.mutation.updateIssue({
      where: { id },
      data: { name, description },
      info
    })
  },

  deleteIssue: async (parent, { id }, ctx, info) => {
    return await ctx.db.mutation.deleteIssue({
      where: { id },
      info
    })
  },

};

module.exports = { issue };

