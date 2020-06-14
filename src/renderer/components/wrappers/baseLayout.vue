<template>
  <div id="baseLayout">
    <router-view></router-view>
    <sidebar></sidebar>
  </div>
</template>

<script>
import sidebar from "../Sidebar";
export default {
  components: {
    sidebar
  }
};
</script>

<style>
</style>