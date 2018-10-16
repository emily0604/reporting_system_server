const { google } = require('../../services/google');

// Helpers.

const getPrismaUser = async (ctx, googleId) => {
  return await ctx.db.query.user({ where: { googleId } })
};

const createPrismaUser = async (ctx, googleUser) => {

  if (!googleUser.hd || googleUser.hd !== 'framgia.com') {
    throw new Error('Not allow access!');
  }

  return await ctx.db.mutation.createUser({
    data: {
      name: googleUser.name,
      googleId: googleUser.id,
      email: googleUser.email,
      avatar: googleUser.picture
    }
  });
};

// Resolvers.

const auth = {

  authenticate: async (parent, { googleCode }, ctx, info) => {

    const googleToken = await google.getGoogleToken(googleCode);
    const googleUser = await google.getGoogleUser(googleToken);

    let user = await getPrismaUser(ctx, googleUser.id);

    if (!user) {
      user = await createPrismaUser(ctx, googleUser);
    }

    ctx.request.session.userId = user.id;

    return {
      user
    };
  },

};

module.exports = { auth };
