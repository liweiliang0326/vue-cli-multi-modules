/*
 *
 * 获取url后参数
 * @ strname 指定参数
 * */
// export const getRequestParams = strname => {
//   var url = location.search; // 获取url中"?"符后的字串
//   var theRequest = {};
//   if (url.indexOf("?") !== -1) {
//     var str = url.substr(1);
//     var strs = str.split("&");
//     for (var i = 0; i < strs.length; i++) {
//       theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
//     }
//   }
//   if (strname) {
//     return theRequest[strname];
//   } else {
//     return theRequest;
//   }
// };

var href = window.location.href;
function getCaption(obj) {
  var index = obj.lastIndexOf("\?");
  obj = obj.substring(index + 1, obj.length);
  return obj;
}
export const getParams = (params) => {
  var search = getCaption(href, 1);
  var vars = search.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == params) {
      return pair[1];
    }
  }
  return false;
};

/*
 * 获取是 手机端还是pc端
 * */
export const getDeviceType = () => {
  if (navigator.userAgent.indexOf("Mobile") !== -1) {
    return "mobile";
  } else {
    return "desktop";
  }
};

/*
 * 将秒转化为 天:时:分:秒
 * @second_time 秒
 * */
export const formatSecondsToTime = value => {
  var time;
  var d = Math.floor(value / 86400);
  var h = Math.floor((value - d * 86400) / 3600);
  var m = Math.floor((value - d * 86400 - h * 3600) / 60);
  var s = value - d * 86400 - h * 3600 - m * 60;
  if (d <= 9) {
    d = "0" + d;
  }
  if (h <= 9) {
    h = "0" + h;
  }
  if (m <= 9) {
    m = "0" + m;
  }
  if (s <= 9) {
    s = "0" + s;
  }
  time = h + ":" + m + ":" + s;
  return time;
};

/*
 * 校验手机号
 * @ str  传入输入手机号
 * */
export const isPhoneAvailable = str => {
  const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
};

/*
 * 获取当前域名
 * */
export const getCurrentDomain = () => {
  var protocol = window.location.protocol;
  var host = window.location.host;
  return protocol + "//" + host;
};

/*
 * 判断是否为ios android
 * */
export const isAndroid = () => {
  if (navigator.userAgent.toLowerCase().indexOf('android') != -1) {  // eslint-disable-line
    return true;
  }
  return false;
};
