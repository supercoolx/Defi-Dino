<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap-grid.scss";
  @import "./assets/scss/main.scss";

  .header-fixed {
    position: fixed;
    width: 100%;
    z-index: 999;
  }

  .index, .roadmap {
    padding-top:150px!important
  }

  body {
    background:#131701;
  }

  .highlight {
    cursor:pointer!important
  }

  .clearfix {
    clear:both;
  }

  .market-filter {
    display:flex
  }

  .dropdown {
    width:100%!important
  }

</style>
