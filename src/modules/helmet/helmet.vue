<template>
  <div id="app">
    <keep-alive include="home">
      <router-view />
    </keep-alive>
     <a-spin class="loading" size="large" tip="数据加载中..."></a-spin>
  </div>
</template>
<script>
export default {
  name: "helmet",
  created() {
    console.log("安全帽, v44, 适配低分辨率屏幕，调整播放器大小");
  }
};
</script>
<style lang="less" scoped>
// @import "@/styles/mixins.less";
// @import "@/styles/app.less";

#app{
  .loading{
    width: 100px;
    height: 100px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
