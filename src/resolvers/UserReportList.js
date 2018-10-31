const UserReportList = {
  dailyReports({ dailyReportIds }, args, ctx, info) {
    const dailyReportIdsFilter = { id_in: dailyReportIds };
    return ctx.db.query.dailyReports({ where: dailyReportIdsFilter }, info);
  }
};

module.exports = { UserReportList };
