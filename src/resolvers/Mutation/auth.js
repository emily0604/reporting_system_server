const jwt = require('jsonwebtoken');
const { google } = require('../../services/google');
const { getUserId } = require('../../utils');

const getPrismaUser = async (ctx, googleId) => {
  return await ctx.db.query.user({ where: { googleId } });
};

const initializeRoles = async ctx => {
  const rolesToBeInitialized = ['MEMBER', 'TEAM_LEADER', 'GROUP_LEADER', 'ADMIN'];
  return await rolesToBeInitialized.map(async name => {
    await ctx.db.mutation.createRole({ data: { name } });
  });
};

const createPrismaUser = async (ctx, googleUser) => {
  return await ctx.db.mutation.createUser({
    data: {
      name: googleUser.name,
      googleId: googleUser.id,
      email: googleUser.email,
      avatar: googleUser.picture,
      roles: {
        connect: { name: 'MEMBER' }
      }
    }
  });
};

const auth = {
  authenticate: async (parent, args, ctx, info) => {
    const { googleCode } = args;
    const googleToken = await google.getGoogleToken(googleCode);
    const googleUser = await google.getGoogleUser(googleToken);

    let user = await getPrismaUser(ctx, googleUser.id);
    const roles = await ctx.db.query.roles({});

    // initialize roles if they are not created yet
    if (roles.length <= 0) {
      const createdRoles = await initializeRoles(ctx);
    }

    if (!user) {
      user = await createPrismaUser(ctx, googleUser);
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return {
      user
    };
  },

  signout: (parent, args, ctx, info) => {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  editProfile: (parent, args, ctx, info) => {
    const userId = getUserId(ctx);

    if (!userId) throw new Error('You are not logged in');

    const updates = { ...args };

    delete updates.id;

    return ctx.db.mutation.updateUser(
      {
        where: { id: args.id },
        data: updates
      },
      info
    );
  }
};

module.exports = { auth };
