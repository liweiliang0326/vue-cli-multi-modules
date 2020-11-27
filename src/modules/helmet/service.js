import http from "@/api/helmetAxios.js";

export default {

  // get请求示例
  // getExcessAirCoefficient(data) {
  //   return http.get('/接口地址', { params: data });
  // },

  // post请求示例
  // computedBalance(data) {
  //   return http.post('/接口地址', data);
  // },

  // 首页-获取用户token
  //  getToken(data) {
  //   return http.post('/api/ennUser/getToken', data);
  // },

  // 首页-获取项目设备概要接口
  getSummary(data) {
    return http.post('/helmet/api/projectsummay/getsummary', data);
  },

  // 设备在线-在线设备信息接口
  getOnlineDevices(data) {
    return http.post('/helmet/api/projectsummay/getonlinedevices', data);
  },

  // 设备在线-设备拉流地址接口-推流
  getLivePush(data) {
    return http.post('/helmet/webSocket/push', data);
  },

  // 设备在线-设备拉流地址接口-关闭推流
  getLivePull(data) {
    return http.post('/helmet/webSocket/pull', data);
  },

  // 获取语音通话配置
  getSipInfo(data) {
    return http.post('/helmet/api/ennUser/getSipInfo?userId=' + data.userId);
  },

  // 视频回放/图片查看-分页查询影像数据接口
  getSelectRecords(data) {
    return http.post('/helmet/api/projectsummay/selectrecords', data);
  },
};
