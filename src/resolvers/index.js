const { Query } = require('./Query');
const { division } = require('./Mutation/division');
const {auth} = require('./Mutation/auth');


module.exports = {
  Query,
  Mutation: {
    ...division,
    ...auth
  }
};