// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const {OPENID} = cloud.getWXContext();

    // 在云开发数据库中存储用户订阅的课程
    var result = await db.collection('weekly_report').add({
      data: {
        touser: OPENID, // 订阅者的openid
        saveTime: event.saveTime,
        name: event.name,
        page: event.page, 
        content: event.content,
        startDate: event.startDate,
        endDate: event.endDate,
        done: false, // 消息发送状态设置为 false
      },
    });


    return result;
  } catch (err) {
    console.log(err);
    return err;
  };
};