<script>
export default {
  name: "HeaderAdmin",
  components: {},
};
</script>
<template>
  <div class="header_acc">
    <div class="links">
      
      <router-link to="/" class="exit link">Выйти</router-link>
    </div>
  </div>
</template>
<style scoped>
.header_acc {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 43px;
  width: 100%;
}
.links{
    display: flex;
    gap: 24px;
}
.link {
  color: #383838;
  font-family: Onest;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; 
}
.gotoHome.link {
  color: #5f22c1;
}
</style>