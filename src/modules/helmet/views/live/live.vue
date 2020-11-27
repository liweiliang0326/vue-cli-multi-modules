<template>
  <div class="live">
    <div ref="main" class="main">
      <div class="project_name_box rowFlex columnCenter spaceBetween">
        <p class="project_name">
          工程名称：{{ projectName ? projectName : storeProjectName }}
        </p>
        <p @click="close()">关闭</p>
      </div>
      <div class="project_data_box rowFlex spaceBetween">
        <div class="table_box">
          <tableModule
            type="live"
            :tableData="tableData"
            @showData="showData"
          />
          <template v-if="tableData.body && tableData.body.length">
            <a-pagination
              class="pagination"
              v-model="paginationOptions.currentPageNum"
              :total="paginationOptions.total"
              :pageSize="paginationOptions.pageSize"
              show-less-items
              @change="getOnlineDevicesFun()"
            />
          </template>
        </div>

        <!-- 设备在线 -->
        <div v-if="deviceIsOnline" class="content_box rowFlex rowCenter">
          <div class="video_oproep_box">
            <template v-if="!isOproepIng">
              <!-- 基于tcPlayer播放视频 -->
              <div id="tcplayer_box" class="rowFlex allCenter">
                <video class="call_end_video" v-if="isCallEnd" controls></video>
              </div>
              <!-- 开始通话按钮 -->
              <div class="oproep_btn rowFlex allCenter" @click="startOproep()">
                <img src="@/assets/images/helmet/call.png" alt="">
                <p>对讲</p>
              </div>
            </template>

            <template v-else>
              <!-- 基于通话播放视频 -->
              <video id="oproep_video" muted controls></video>
              <!-- 结束通话按钮 -->
              <div class="oproep_btn rowFlex allCenter" @click="endOproep()">
                <img src="@/assets/images/helmet/end.png" alt="">
                <p>结束</p>
              </div>
            </template>
          </div>
        </div>

        <!-- 设备不在线 -->
        <div v-else class="content_box rowFlex allCenter">
          <div id="tcplayer_box" class="rowFlex allCenter">
            <div
              class="vcp-player vcp-playing"
              style="width: 540px; height: 360px;"
            >
              <div class="vcp-error-tips"></div>
              <div class="vcp-loading"></div>
              <video
                controls
                src=""
                style="width: 540px; height: 360px;"
              ></video>
            </div>
          </div>
          <a-alert
            v-if="showErrMsg"
            class="warn_desc"
            :message="errMsg"
            type="error"
            show-icon
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $http from "@/modules/helmet/service.js";
import tableModule from "@/components/helmet/tableModule.vue";
import { mapState } from "vuex";
let player;

export default {
  name: "live",
  components: {
    tableModule
  },
  data() {
    return {
      projectName: "", // 顶部项目名
      tableData: { head: ["序号", "设备名称", "使用者", "操作"], body: [] }, // table表格相关配置
      paginationOptions: { // 分页器相关配置
        currentPageNum: 1,
        total: 0,
        pageSize: 8
      },
      deviceId: "", // 项目ID
      deviceIsOnline: false, // 设备是否在线，默认为：false
      showErrMsg: false, // 是否显示后台返回信息（设备不在线）
      errMsg: "", // 后台返回信息（设备不在线）
      videoSrc: "", // 直播视频地址
      loadFlashTimer: null,
      isOproepIng: false, // 是否在对讲
      sipInfo: null, // 接收sip相关配置
      userAgent: null, // 用户代理
      oproepData: null, // 对讲会话
      deviceSipId: null, // 设备SipId
      oproepVideo: null, // 接收播放通话视频video标签
      isCallEnd: false, // 是否在直播，直播时为
    };
  },
  computed: {
    ...mapState([
      "storeProvinceEcode",
      "storeCityEcode",
      "storeProjectName",
      "storeUserId"
    ])
  },
  created() {
    this.getOnlineDevicesFun();
    this.getSipInfoFun();
  },
  methods: {
    // 获取在线设备信息数据
    getOnlineDevicesFun() {
      document.querySelector(".loading").style.display = "block";
      let options = {
        proId: this.$route.params.id,
        projectName: this.storeProjectName,
        page: this.paginationOptions.currentPageNum,
        limit: this.paginationOptions.pageSize
      };
      $http
        .getOnlineDevices(options)
        .then(res => {
          document.querySelector(".loading").style.display = "none";
          if (Number(res.data.code) === 200) {
            this.paginationOptions.total = res.data.count; // 获取数据总数
            this.tableData.body = res.data.data; // 获取数据列表
          }
        })
        .catch(err => console.log("获取在线设备信息数据失败", err));
    },

    // 获取语音通话配置
    getSipInfoFun() {
      let options = {
        userId: this.storeUserId
      };
      $http
        .getSipInfo(options)
        .then(res => {
          if (Number(res.data.code) === 200) {
            this.sipInfo = res.data.data.sipConfig;
            this.registerSip(); // 注册sip
          }
        })
        .catch(err => console.log("获取语音通话配置数据失败", err));
    },

    // 注册sip
    registerSip() {
      // adminInfo 后台返回的sip通话的数据
      this.loadFlashTimer = setTimeout(() => {
        if (this.sipInfo) {
          const localPhone = this.sipInfo.sipId;
          const me_uri_joint = localPhone + "@" + this.sipInfo.sipHost;
          const ws_url = this.sipInfo.wssUrl;
          const pwd = this.sipInfo.sipPwd;
          // 进行号码登录注册
          // 配置参数
          const config = {
            uri: me_uri_joint,
            transportOptions: {
              wsServers: [ws_url],
              connectionTimeout: 30
            },
            authorizationUser: localPhone,
            password: pwd,
            sessionDescriptionHandlerFactoryOptions: {
              peerConnectionOptions: {
                rtcConfiguration: {
                  iceServers: [
                    { urls: "stun:" + this.sipInfo.stunHost },
                    {
                      urls: "turn:" + this.sipInfo.turnUser,
                      username: this.sipInfo.turnUser,
                      credential: this.sipInfo.turnPwd
                    }
                  ]
                }
              }
            }
          };
          // 创建userAgent
          this.userAgent = new SIP.UA(config);
          // 注册成功
          this.userAgent.on("registered", () => {
            console.log("registered ok");
          });
          // 注册失败
          this.userAgent.on("registrationFailed", (response, cause) => {
            console.log("registrationFailed, ", response, cause);
          });
        }
      }, 1000);
    },

    // 开启通话
    startOproep() {
      // 判断是否正在对讲，如果正在对讲（this.isOproepIng = true），则不做操作
      if (!this.isOproepIng) {
        this.getLivePullFun();
        this.isOproepIng = true;
        this.$nextTick(() => {
          this.oproepVideo = document.querySelector("#oproep_video");
          // 对讲操作
          let options= {
            sessionDescriptionHandlerOptions: {
              constraints: {
                audio: true,
                video: true
              }
            }
          }
          this.oproepData = this.userAgent.invite(this.deviceSipId + '', options);
          this.oproepData.on("accepted", data => {
            console.info("onAccepted - ", data);
            const pc = this.oproepData.sessionDescriptionHandler.peerConnection;
            const remoteStream = new MediaStream();
            pc.getReceivers().forEach(function(receiver) {
              remoteStream.addTrack(receiver.track);
            });
            this.oproepVideo.srcObject = remoteStream;
            this.oproepVideo.play();
            this.oproepVideo.muted = false;
          });
        });
      }
    },

    // 结束通话
    endOproep() {
      console.log("结束通话1");
      this.isOproepIng = false;
      if (this.oproepData) {
        console.log("结束通话2");
        this.oproepData.terminate();
        this.$nextTick(() => {
          this.deviceIsOnline = false;
          this.isCallEnd = true;
        });
      }
    },

    // 退出页面时，如果设备在线则关闭当前直播推流
    close() {
      if (this.isOproepIng) {
        this.endOproep();
      } else {
        if (this.deviceIsOnline) {
          this.getLivePullFun();
        }
      }
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    },

    // 调直播数据接口，显示直播数据
    showData(item) {
      if (this.isOproepIng) {
        // 正在通话中，先挂断电话，再继续下一个直播
        this.endOproep();
        setTimeout(() => {
          this.getLivePushFun(item);
        }, 500);
      } else {
        if (this.deviceIsOnline) {
          // 在直播，先关闭上一个直播推流，再拉新流
          this.getLivePullFun(item);
        } else {
          // 没有直播，直接拉流
          this.getLivePushFun(item);
        }
      }
    },

    // 直播拉流
    getLivePushFun(item) {
      console.log("开始直播");
      this.projectName = item.projectName; // 获取当前设备名称
      this.deviceId = item.deviceId; // 获取当前直播设备id
      this.deviceSipId = item.sipId; // 获取当前设备sipId
      let options = {
        p_type: "0",
        p_id: this.deviceId
      };
      $http
        .getLivePush(options)
        .then(res => {
          if (Number(res.data.code) === 200) {
            this.deviceIsOnline = true;
            this.isCallEnd = false;
            this.$nextTick(() => {
              this.videoSrc = res.data.data[1];
              player = new TcPlayer("tcplayer_box", {
                m3u8: this.videoSrc,
                flv: this.videoSrc, //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
                autoplay: true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                width: "540", //视频的显示宽度，请尽量使用视频分辨率宽度
                height: "360" //视频的显示高度，请尽量使用视频分辨率高度
              });
              this.removePlayer(); // 删除多余的播放器
            });
          } else {
            // 设备不在线
            this.deviceIsOnline = false;
            this.videoSrc = "";
            this.errMsg = res.data.msg;
            this.showErrMsg = true;
            setTimeout(() => {
              this.showErrMsg = false;
              this.errMsg = "";
            }, 2000);
          }
        })
        .catch(err => console.log("获取推流数据失败", err));
    },

    // 关闭直播推流
    getLivePullFun(item = "closePage") {
      let options = {
        p_type: "0",
        p_id: this.deviceId
      };
      $http
        .getLivePull(options)
        .then(res => {
          if (Number(res.data[0].code) === 200) {
            if (item != "closePage") {
              setTimeout(() => {
                this.getLivePushFun(item);
              }, 1000)
            }
          }
        })
        .catch(err => console.log("关闭推流失败", err));
    },

    // 每次new TcPlayer 的时候都会生成一个新的播放器，需要将上一个删掉
    removePlayer() {
      if (document.querySelectorAll(".vcp-player").length > 1) {
        document
          .querySelector("#tcplayer_box")
          .removeChild(document.querySelectorAll(".vcp-player")[0]);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../styles/base.less";
@import "./live.less";
</style>