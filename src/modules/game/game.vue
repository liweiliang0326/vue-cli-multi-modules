<template>
  <div class="game">
    <img src="../../assets/images/game/bg1.jpg" @click="toGameSon(1)"/>
    <img src="../../assets/images/game/icon1.png" @click="toGameSon(2)"/>

    <router-view />

  </div>
</template>

<script>
export default {
  name: "game",
  methods: {
    toGameSon(num) {
      this.$router.push({
        name: "gameSon" + num
      });
    }
  },
};
</script>

<style lang="less" scoped>
.game {
  width: 100%;
  height: 100%;
  img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
}
</style>
