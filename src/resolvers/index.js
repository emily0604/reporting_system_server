const { Query } = require('./Query');
const { division } = require('./Mutation/division');
const {auth} = require('./Mutation/auth');
const { AuthPayload } = require('./AuthPayload');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...division,
  },
  AuthPayload,
};