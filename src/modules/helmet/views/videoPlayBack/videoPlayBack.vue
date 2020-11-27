<template>
  <div class="video_play_back">
    <div class="main">
      <div class="project_name_box rowFlex columnCenter spaceBetween">
        <p class="project_name">
          工程名称：{{ projectName ? projectName : storeProjectName }}
        </p>
        <p @click="close()">关闭</p>
      </div>
      <div class="project_data_box rowFlex spaceBetween">
        <div class="table_box">
          <tableModule
            type="videoPlayBack"
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
              @change="getSelectRecordsFun()"
            />
          </template>
        </div>

        <div class="content_box rowFlex allCenter">
          <div id="tcplayer_box" class="rowFlex allCenter"></div>
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
  name: "videoPlayBack",
  components: {
    tableModule
  },
  data() {
    return {
      projectName: "",
      tableData: {
        head: ["序号", "设备名称", "使用者", "时间", "时长", "类型", "操作"],
        body: []
      },
      paginationOptions: {
        // size: "small",
        currentPageNum: 1,
        total: 0,
        pageSize: 8
      }
    };
  },
  computed: {
    ...mapState(["storeProjectName"])
  },
  created() {
    this.getSelectRecordsFun();
  },
  methods: {
    // 获取视频回放数据
    getSelectRecordsFun() {
      document.querySelector('.loading').style.display = "block";
      let options = {
        act: "save_video",
        proId: this.$route.params.id,
        page: this.paginationOptions.currentPageNum,
        limit: this.paginationOptions.pageSize
      };
      $http
        .getSelectRecords(options)
        .then(res => {
          // console.log("获取视频回放数据", res);
          document.querySelector('.loading').style.display = "none";
          if (Number(res.data.code) === 200) {
            this.paginationOptions.total = res.data.data.total; // 获取数据总数
            this.tableData.body = res.data.data.records; // 获取数据列表

            if (res.data.data.records.length > 0) {
              player = new TcPlayer("tcplayer_box", {
                m3u8: res.data.data.records[0].filePath,
                flv: res.data.data.records[0].filePath, //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
                autoplay: false, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                width: "660", //视频的显示宽度，请尽量使用视频分辨率宽度
                height: "440" //视频的显示高度，请尽量使用视频分辨率高度
              });
            }
            this.removePlayer(); // 删除多余的播放器
          }
        })
        .catch(err => console.log("获取视频回放数据失败", err));
    },

    // 返回到首页
    close() {
      this.$router.go(-1);
    },

    // 播放对应的视频
    showData(item) {
      player = new TcPlayer("tcplayer_box", {
        m3u8: item.filePath,
        flv: item.filePath, //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
        autoplay: true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        width: "660", //视频的显示宽度，请尽量使用视频分辨率宽度
        height: "440" //视频的显示高度，请尽量使用视频分辨率高度
      });
      this.removePlayer(); // 删除多余的播放器
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
@import "./videoPlayBack.less";
</style>
