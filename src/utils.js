function getUserId(ctx) {
  if (ctx.request.userId) {
    return ctx.request.userId;
  }

  throw new AuthError();
}

function checkPermission(requestRoles, permittedRoles) {
  const hasPermissions = requestRoles.some(role => permittedRoles.includes(role.name));

  if (!hasPermissions) {
    throw new Error("You don't have permission to do that!");
  }
}

class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

module.exports = {
  getUserId,
  checkPermission,
  AuthError
};
