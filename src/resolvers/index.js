const { Query } = require('./Query');
const { Subscription } = require('./Subscription');

const { division } = require('./Mutation/division');
const { auth } = require('./Mutation/auth');
const { dailyReport } = require('./Mutation/dailyReport');
const { weeklyReport } = require('./Mutation/weeklyReport');
const { AuthPayload } = require('./AuthPayload');
const { UserReportList } = require('./UserReportList');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...division,
    ...dailyReport,
    ...weeklyReport,
  },
  Subscription,
  AuthPayload,
  UserReportList
};
