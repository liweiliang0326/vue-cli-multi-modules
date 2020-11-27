<template>
  <div class="invite">
    <div>
      <button @click="toInviteSon(1)">去邀请子页面1</button>
      <button @click="toInviteSon(2)">去邀请子页面2</button>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "invite",
  methods: {
    toInviteSon(num) {
      this.$router.push({
        name: "inviteSon" + num
      });
    }
  }
};
</script>
