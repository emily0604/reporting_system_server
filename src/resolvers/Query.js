const { getUserId } = require('../utils');

const Query = {
  info: () => `This is the API of a Reporting System`,

  divisions: (parent, args, { db }, info) => {
    return db.query.divisions({}, info);
  },

  me: (parent, args, ctx, info) => {
    const id = getUserId(ctx);
    // Check if there is a current user ID:
    if (!id) return null;
    return ctx.db.query.user({ where: { id } }, info)
  },

};

module.exports = { Query };

