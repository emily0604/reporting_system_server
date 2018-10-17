function getUserId(ctx) {
  if (ctx.request.userId) {
    return ctx.request.userId;
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