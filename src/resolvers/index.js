const { Query } = require('./Query');
const { Subscription } = require('./Subscription');

const { division } = require('./Mutation/division');
const { team } = require('./Mutation/team');
const { auth } = require('./Mutation/auth');
const { dailyReport } = require('./Mutation/dailyReport');
const { weeklyReport } = require('./Mutation/weeklyReport');
const { project } = require('./Mutation/project');
const { AuthPayload } = require('./AuthPayload');
const { DailyReportList } = require('./DailyReportList');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...division,
    ...team,
    ...dailyReport,
    ...weeklyReport,
    ...project
  },
  Subscription,
  AuthPayload,
  DailyReportList
};
