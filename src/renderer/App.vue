<template>
  <div id="app" class="flex min-h-screen">
    <router-view></router-view>
    <sidebar></sidebar>
  </div>
</template>

<script>
import sidebar from "./components/Sidebar";
export default {
  name: "BreezeApp",
  components: {
    sidebar
  },
  mounted() {
    this.$store.dispatch("updateTime");
    this.$store.dispatch("updateExactlyNow");
  }
};
</script>

<style src="./assets/main.css"></style>

