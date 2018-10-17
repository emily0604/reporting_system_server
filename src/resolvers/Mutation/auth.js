const jwt = require('jsonwebtoken');
const { google } = require('../../services/google');

const getPrismaUser = async (ctx, googleId) => {
  return await ctx.db.query.user({ where: { googleId } });
};

const createPrismaUser = async (ctx, googleUser) => {
  return await ctx.db.mutation.createUser({
    data: {
      name: googleUser.name,
      googleId: googleUser.id,
      email: googleUser.email,
      avatar: googleUser.picture,
      roles: { set: ['MEMBER'] }
    }
  });
};

const auth = {

  authenticate: async (parent, args, ctx, info) => {
    const { googleCode } = args;
    const googleToken = await google.getGoogleToken(googleCode);
    const googleUser = await google.getGoogleUser(googleToken);

    let user = await getPrismaUser(ctx, googleUser.id);

    if (!user) {
      user = await createPrismaUser(ctx, googleUser);
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return {
      user
    };
  },

  signout: (parent, args, ctx, info) => {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!'};
  }
};

module.exports = { auth };
