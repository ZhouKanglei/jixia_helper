// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('sharing')
    .where({
      temp: 1
    })
    .orderBy('type', 'asc')
    .orderBy('name', 'asc')
    .get();
  } catch(e) {
    console.log(e);
  }
}