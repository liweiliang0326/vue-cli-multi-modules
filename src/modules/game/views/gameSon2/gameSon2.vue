<template>
  <div class="game_son2">
    <p>test-gameSon2</p>
    <!-- <button @click="httpPutFinishDataCatalogFun">编辑</button>
    <button @click="httpDeleteFinishDataCatalogFun">删除</button> -->
    <p v-if="storeProvinceEcode">{{ storeProvinceEcode }}</p>
    <p>当前域名：{{ currentDomain }}</p>
    <p>设备类型： {{ deviceType }}</p>
    <p>是否是安卓系统： {{ isAndroid ? "是安卓" : "不是安卓" }}</p>

    <ul v-if="testList">
      <li v-for="item in testList" :key="item.id">
        {{ item.catalogName + "：" + item.modifiedDate }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentDomain, getDeviceType, isAndroid } from "@/utils/tools.js";
import $http from "@/modules/game/service.js";

export default {
  name: "gameSon2",
  data() {
    return {
      currentDomain: getCurrentDomain(),
      deviceType: getDeviceType(),
      isAndroid: isAndroid(),
      testList: null
    };
  },
  created() {
    this.httpPostFinishDataCatalogListFun();
  },
  // mounted () {
  //   this.$toast("game");
  // },
  computed: {
    ...mapState(["storeProvinceEcode"])
  },
  methods: {
    httpPostFinishDataCatalogListFun() {
      let data = {};
      $http
        .httpPostFinishDataCatalogList(data)
        .then(res => {
          console.log("game-获取数据成功", res);
          if (res.data.retCode) {
            this.testList = res.data.result;
          }
        })
        .catch(err => console.log("game-获取数据失败", err));
    },

    // 编辑
    httpPutFinishDataCatalogFun() {
      let data = {
        appCreated: true,
        catalogName: "20201125-lwl-test2",
        catalogOrderNum: 20201125,
        id: 79,
        parentCatalogId: "0",
        remark: "测试",
        status: 1,
        tenancyCode: "lwl-test2-3"
      };
      $http
        .httpPutFinishDataCatalog(data)
        .then(res => {
          console.log("编辑数据成功", res);
        })
        .catch(err => console.log("编辑数据失败", err));
    },

    // 删除
    httpDeleteFinishDataCatalogFun() {
      let data = {
        id: 78
      }
      $http
        .httpDeleteFinishDataCatalog(data)
        .then(res => {
          console.log("删除数据成功", res);
        })
        .catch(err => console.log("删除数据失败", err));
    }
  }
};
</script>
