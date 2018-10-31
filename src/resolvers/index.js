const { Query } = require('./Query');
const { division } = require('./Mutation/division');
const {auth} = require('./Mutation/auth');
const {dailyReport} = require('./Mutation/dailyReport');
const { AuthPayload } = require('./AuthPayload');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...division,
    ...dailyReport,
  },
  AuthPayload,
};