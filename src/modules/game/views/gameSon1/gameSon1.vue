<template>
  <div class="game_son1">
    <p>
      test-gameSon1
    </p>
    <button @click="changeStoreProvinceEcode">
      change-setStoreProvinceEcode
    </button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "gameSon1",
  methods: {
    ...mapMutations(["setStoreProvinceEcode"]),
    changeStoreProvinceEcode() {
      const randomNum = Math.floor(Math.random() * 10);
      console.log("randomNum", randomNum);
      this.setStoreProvinceEcode(randomNum);
    }
  }
};
</script>
