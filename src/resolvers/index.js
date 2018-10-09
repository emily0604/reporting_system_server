const { Query } = require('./Query');
const { division } = require('./Mutation/division');

module.exports = {
  Query,
  Mutation: {
    ...division
  }
};