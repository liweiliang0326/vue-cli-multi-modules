<template>
  <div class="invite_son2">
    <p>test-inviteSon2</p>
    <ul v-if="documentDictTypeList">
      <li v-for="(item, index) in documentDictTypeList" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import $http from "@/modules/invite/service.js";

export default {
  name: "inviteSon2",
  data() {
    return {
      documentDictTypeList: null
    }
  },
  created() {
    this.getDocumentDictTypeFun();
  },
  methods: {
    getDocumentDictTypeFun() {
      $http
        .getDocumentDictType()
        .then(res => {
          console.log("game-获取数据成功", res);
          if(res.data.code === '00000') {
            this.documentDictTypeList = res.data.data;
          }
        })
        .catch(err => console.log("game-获取数据失败", err));
    }
  }
};
</script>
