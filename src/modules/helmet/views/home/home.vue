<template>
  <div class="home">
    <div class="main">
      <div class="search_box rowFlex rowFirst columnCenter">
        <div v-if="userInfo">
          <label>{{ isProvinceCompany ? "省公司：" : "管理实体：" }}</label>
          <a-select
            style="width: 150px"
            size="small"
            :default-value="provinceData[0].name"
            :disabled="userInfoGroupLev > 1"
            @change="handleProvinceChange"
          >
            <a-select-option
              v-for="(province, index) in provinceData"
              :key="index"
            >
              {{ province.name }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label>企业：</label>
          <a-select
            style="width: 180px"
            size="small"
            v-model="currentCity"
            :disabled="userInfoGroupLev > 3"
            @change="handleCityChange"
          >
            <a-select-option v-for="(city, index) in cities" :key="index">
              {{ city.name }}
            </a-select-option>
          </a-select>
        </div>

        <div>
          <label>项目名称：</label>
          <a-input
            style="width: 150px"
            size="small"
            v-model="projectName"
            placeholder="请输入项目名称"
            :allowClear="true"
          ></a-input>
        </div>

        <a-button class="search_btn" size="small" @click="searchData()"
          >查询</a-button
        >
      </div>

      <template v-if="projectList && projectList.length > 0">
        <!-- 有数据 -->
        <ul class="project_list rowFlex rowFirst flexWarp">
          <li
            class="project_item columnFlex spaceBetween columnCenter flex0"
            v-for="(item, index) in projectList"
            :key="index"
          >
            <div class="project_logo_name rowFlex rowFirst columnCenter">
              <img
                class="project_logo"
                src="@/assets/images/helmet/u6762.png"
                alt=""
              />
              <p class="project_name">{{ item.projectName }}</p>
            </div>
            <ul class="project_data_list rowFlex spaceAround">
              <li class="project_data_item" @click="jumpPage('Live', item)">
                <p class="type">设备在线</p>
                <p class="num">{{ item.onlineDeviceNum }}</p>
              </li>
              <li
                class="project_data_item"
                @click="jumpPage('videoPlayBack', item)"
              >
                <p class="type">历史视频</p>
                <p class="num">{{ item.vedioNum }}</p>
              </li>
              <li
                class="project_data_item"
                @click="jumpPage('viewPicture', item)"
              >
                <p class="type">历史图片</p>
                <p class="num">{{ item.pictureNum }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </template>
      <template v-if="projectList.length <= 0 && !showLoading">
        <!-- 数据为空 -->
        <div class="no_data_box rowFlex allCenter">
          <a-empty description="暂无数据" />
        </div>
      </template>

      <!-- 当有数据时显示分页器，数据为空不显示 -->
      <template v-if="projectList && projectList.length > 0">
        <a-pagination
          class="pagination"
          v-model="paginationOptions.currentPageNum"
          :total="paginationOptionsTotal"
          :pageSize="paginationOptions.pageSize"
          show-less-items
          @change="getAqmProListFun()"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { getParams } from "@/utils/tools.js";
import * as aSystemConfig from "@/utils/a_system_config.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "home",
  data() {
    return {
      isDisabled: false,
      provinceData: [], // 省公司列表
      cityData: {
        // 全部: [{ name: "全部", ecode: "" }]
      }, // 保存所有整理后的数据
      cities: [], // 企业列表
      currentCity: null, // 通过省公司的改变动态改变显示的企业名称
      doubleClick: true, // 防止用户短时间内多次点击按钮，请求数据
      projectName: "", // 接收用户输入的想要查询的项目名称
      projectList: [], // 接收后台接口返的项目数据列表
      showLoading: true,
      paginationOptions: {
        // 分页器相关配置
        currentPageNum: 1, // 设置当前页面
        pageSize: 8 // 设置每请求一次接口调的数据条数
      },
      paginationOptionsTotal: 0, // 设置数据总数

      areaData: null, // 接收A系统通过url传过来的区域数据
      qiyeData: null, // 接收A系统通过url传过来的企业数据
      userInfo: null, // 接收A系统通过url传过来的用户信息
      userInfoGroupLev: null, // 用户级别
      isProvinceCompany: true, // 是否是省公司，默认：是
      provinceEcode: "", // 接收省公司ecode
      cityEcode: "" // 接收企业ecode
    };
  },
  computed: {
    ...mapState(["storeProvinceEcode", "storeCityEcode", "storeAqmToken"])
  },
  created() {
    this.areaData = JSON.parse(decodeURIComponent(getParams("areaData")));
    this.qiyeData = JSON.parse(decodeURIComponent(getParams("qiyeData")));
    this.userInfo = JSON.parse(decodeURIComponent(getParams("userInfo")));
    this.userInfoGroupLev = Number(this.userInfo.groupLev);

    // console.log("getParams-userInfo-groupLev", this.userInfoGroupLev);
    // console.log("getParams-areaData", this.areaData);
    // console.log("getParams-qiyeData", this.qiyeData);
    // console.log("this.userInfo", this.userInfo);

    if (this.userInfoGroupLev === 1) {
      this.cityData["全部"] = [{ name: "全部", ecode: "" }];
      for (let i = 0; i < this.areaData.length; i++) {
        this.provinceData.push({
          name: this.areaData[i].name,
          code: this.areaData[i].code,
          ecode: this.areaData[i].ecode
        });
      }
      for (let j = 0; j < this.areaData.length; j++) {
        this.cityData[this.areaData[j].name] = [{ name: "全部", ecode: "" }];
        this.cityData[this.areaData[j].name].push(...this.areaData[j].children);
      }
      this.cities = this.cityData[this.provinceData[0].name];
      this.currentCity = this.cityData[this.provinceData[0].name][0].name;
    } else if (this.userInfoGroupLev === 2) {
      this.provinceData.push({
        // 管理实体-省公司数据
        name: this.areaData.name,
        code: this.areaData.code,
        ecode: this.areaData.ecode
      });
      this.cityData[this.areaData.name] = [{ name: "全部", ecode: "" }];
      this.cityData[this.areaData.name].push(...this.areaData.children);
      this.cities = this.cityData[this.provinceData[0].name];
      this.currentCity = this.cityData[this.provinceData[0].name][0].name;
    } else if (this.userInfoGroupLev === 3) {
      this.provinceData.push({
        // 管理实体-省公司数据
        name: this.areaData.name,
        code: this.areaData.code,
        ecode: this.areaData.ecode
      });
      this.setStoreProvinceEcode(this.provinceData[0].ecode);
      this.qiyeData = JSON.parse(this.qiyeData); // 管理实体数据
      this.cityData[this.areaData.name] = [];
      this.cityData[this.areaData.name].push(...this.qiyeData);
      this.cities = this.cityData[this.provinceData[0].name];
      this.currentCity = this.cityData[this.provinceData[0].name][0].name;
    } else if (this.userInfoGroupLev >= 4) {
      this.provinceData.push({
        // 管理实体-省公司数据
        name: this.areaData.name,
        code: this.areaData.code,
        ecode: this.areaData.ecode
      });
      this.setStoreProvinceEcode(this.provinceData[0].ecode);
      this.qiyeData = JSON.parse(this.qiyeData); // 管理实体数据
      this.cityData[this.areaData.name] = [];
      this.cityData[this.areaData.name].push(...this.qiyeData);
      this.cities = this.cityData[this.provinceData[0].name];
      this.currentCity = this.cityData[this.provinceData[0].name][0].name;
      this.cityEcode = this.cities[0].ecode;
      this.setStoreCityEcode(this.cities[0].ecode);
    }

    // console.log("省-列表");
    // console.table(this.provinceData);
    // console.log("管理实体-列表");
    // console.table(this.cities);

    this.provinceEcode = this.provinceData[0].ecode;
    this.cityEcode = this.cities[0].ecode;
    this.setStoreProvinceEcode(this.provinceEcode);
    this.setStoreCityEcode(this.cityEcode);

    if (this.userInfoGroupLev === 3) {
      this.isProvinceCompany = false;
    }
  },
  activated() {
    this.getAqmProListFun();
  },
  mounted() {
    this.setStoreUserId(this.userInfo.id);
  },
  methods: {
    // 引入vuex mutations方法 存储省公司ecode、企业ecode
    ...mapMutations([
      "setStoreAqmToken",
      "setStoreProvinceEcode",
      "setStoreCityEcode",
      "setStoreProjectName",
      "setStoreUserId"
    ]),

    // 获取项目设备概要接口
    getAqmProListFun() {
      this.projectList = [];
      document.querySelector(".loading").style.display = "block";
      this.showLoading = true;

      let groupWhere = {
        groupCode: this.userInfo.groupCode,
        ecode: this.storeCityEcode
          ? this.storeCityEcode
          : this.storeProvinceEcode
          ? this.storeProvinceEcode
          : this.userInfo.ecode,
        isAll: this.storeCityEcode && this.userInfoGroupLev == "3" ? "0" : "1",
        userid: this.userInfo.id,
        userType: this.userInfoGroupLev,
        sgdwid: this.userInfo.groupId,
        sys: "project"
      };

      let data = {
        token: aSystemConfig.Atoken,
        protype: "0",
        menuname_config: "RQ_ZNAQM",
        proname: this.projectName,
        groupWhere: JSON.stringify(groupWhere),
        pagenum: this.paginationOptions.currentPageNum,
        pagesize: this.paginationOptions.pageSize
      };

      $.ajax({
        type: "GET",
        url:
          aSystemConfig.Ahost +
          "/ServiceEngine/rest/ennProAqmService/getAqmProList",
        data: data,
        success: response => {
          document.querySelector(".loading").style.display = "none";
          this.showLoading = false;
          let res = JSON.parse(response);
          if (res.success) {
            this.paginationOptionsTotal = Number(res.count);
            this.projectList = res.items;
            this.setStoreAqmToken(res.token);
            this.doubleClick = true;
          } else {
            this.projectList = [];
          }
        }
      });

      // 如果调接口失败，3秒之后再赋值为:true
      setTimeout(() => {
        if (!this.doubleClick) {
          this.doubleClick = true;
        }
      }, 3000);
    },

    // 监听省份切换
    handleProvinceChange(index) {
      this.cities = this.cityData[this.provinceData[index].name];
      this.currentCity = this.cityData[this.provinceData[index].name][0].name;
      this.provinceEcode = this.provinceData[index].ecode;
      this.cityEcode = "";
      this.setStoreProvinceEcode(this.provinceEcode);
      this.setStoreCityEcode(this.cityEcode);
    },

    // 监听城市切换
    handleCityChange(index) {
      this.currentCity = index;
      this.cityEcode = this.cities[index].ecode;
      this.setStoreCityEcode(this.cityEcode);
    },

    // 点击查询按钮，
    searchData() {
      this.setStoreProvinceEcode(this.provinceEcode);
      this.setStoreCityEcode(this.cityEcode);

      if (this.doubleClick) {
        this.doubleClick = false;
        this.paginationOptions.currentPageNum = 1;
        this.getAqmProListFun();
      }
    },

    // 路由跳转，接收两个参数：路由跳转name、item
    jumpPage(routerName, item) {
      this.setStoreProjectName(item.projectName);
      this.$router.push({
        name: routerName,
        params: {
          id: item.proId
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../styles/base.less";
@import "./home.less";
</style>
