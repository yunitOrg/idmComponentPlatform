<template>
    <div class="page-max-width creative-center-container">
        <div class="navigation">
            <ICreativeCenterNavBar :nav-list="config.navList"></ICreativeCenterNavBar>
        </div>
        <div class="content">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script lang="ts" setup>
import config from '@/settings/creativeCenterPageConfig'
</script>

<style lang="scss" scoped>
.creative-center-container {
  display: flex;
  margin: 20px auto !important;
  .navigation {
    width: 220px;
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.06);
    margin-right: 20px;
  }
  .content {
    width: 0;
    flex-grow: 1;
    flex-shrink: 1;
  }
}
</style>
