// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: event.page,
      data: event.data,
      templateId: event.template_id[0]
    });
    return result;
  } catch (err) {
    console.log(err);
    return err;
  };
};