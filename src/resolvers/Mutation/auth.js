const {google} = require('../../services/google');
const jwt = require('jsonwebtoken');

// Helpers.

const getPrismaUser = async ({db}, googleId) => {
  return await db.query.user({where: {googleId}})
};

const createPrismaUser = async ({db}, googleUser) => {

  if (!googleUser.hd || googleUser.hd !== 'framgia.com') {
    throw new Error('Not allow access!');
  }

  return await db.mutation.createUser({
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
  authenticate: async (parent, {googleCode}, ctx, info) => {

    const googleToken = await google.getGoogleToken(googleCode);
    const googleUser = await google.getGoogleUser(googleToken);

    let user = await getPrismaUser(ctx, googleUser.id);

    if (!user) {
      user = await createPrismaUser(ctx, googleUser);
    }

    return {
      token: jwt.sign({userId: user.id}, process.env.APP_SECRET),
      user
    }
  },

};

module.exports = {auth};
