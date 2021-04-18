// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('weekly_report')
    .where({
      startDate: event.startDate,
      endDate: event.endDate
    })
    .orderBy("saveTime","asc")
    .get();
    
  } catch(e) {
    console.log(e);
  }
}