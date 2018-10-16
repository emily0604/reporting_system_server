function getUserId(ctx) {
  if (ctx.request.session.userId) {
    return ctx.request.session.userId;
  }

  throw new AuthError();
}

class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

module.exports = {
  getUserId,
  AuthError,
};