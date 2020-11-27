<template>
  <div class="view_picture">
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
            class="table_module"
            type="viewPicture"
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

        <div class="content_box">
          <div class="rowFlex allCenter">
            <img v-if="imgSrc" :src="imgSrc" alt="" />
            <img v-else src="@/assets/images/helmet/null.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $http from "@/modules/helmet/service.js";
import tableModule from "@/components/helmet/tableModule.vue";
import { mapState } from "vuex";

export default {
  name: "viewPicture",
  components: {
    tableModule
  },
  data() {
    return {
      projectName: "",
      tableData: {
        head: ["序号", "设备名称", "使用者", "工序", "时间", "操作"],
        body: []
      },
      paginationOptions: {
        // size: "small",
        currentPageNum: 1,
        total: 0,
        pageSize: 8
      },
      imgSrc: ""
    };
  },
  computed: {
    ...mapState(["storeProjectName"])
  },
  created() {
    this.getSelectRecordsFun();
  },
  methods: {
    // 获取图片查看数据
    getSelectRecordsFun() {
      document.querySelector(".loading").style.display = "block";
      let options = {
        act: "save_image",
        proId: this.$route.params.id,
        page: this.paginationOptions.currentPageNum,
        limit: this.paginationOptions.pageSize
      };
      $http
        .getSelectRecords(options)
        .then(res => {
          document.querySelector(".loading").style.display = "none";
          if (Number(res.data.code) === 200) {
            this.paginationOptions.total = res.data.data.total; // 获取数据总数
            this.tableData.body = res.data.data.records; // 获取数据列表
          }
        })
        .catch(err => console.log("获取图片查看数据失败", err));
    },

    // 返回到首页
    close() {
      this.$router.go(-1);
    },

    showData(item) {
      this.projectName = item.projectName;
      this.imgSrc = item.filePath;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../styles/base.less";
@import "./viewPicture.less";
</style>
