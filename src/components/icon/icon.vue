<template>
  <span class="icon" v-show="type>=0" :class="iconClass"></span>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      type: {
        type: Number
      },
      num: {
        type: Number
      }
    },
    computed: {
      iconClass () {
        return this.classMap[this.type] + ' icon-' + this.num;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">

  @import "../../common/stylus/mixin.styl";

  .icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px;
    background-repeat: no-repeat;
    vertical-align: top;
    &.icon-2{
      width: 14px;
      height: 14px;
      margin-right: 4px;
      background-size: 14px;
    }
    &.icon-3{
      width: 12px;
      height: 12px;
      margin-right: 4px;
      background-size: 12px;
    }
    &.icon-4{
      width: 16px;
      height: 16px;
      margin-right: 4px;
      background-size: 16px;
    }
    &.decrease {
      bg-image('decrease_1');
      &.icon-2 {
        bg-image('decrease_2');
      }
      &.icon-3 {
        bg-image('decrease_3');
      }
      &.icon-4 {
        bg-image('decrease_4');
      }
    }
    &.discount {
      bg-image('discount_1');
      &.icon-2 {
        bg-image('discount_2');
      }
      &.icon-3 {
        bg-image('discount_3');
      }
      &.icon-4 {
        bg-image('discount_4');
      }
    }
    &.guarantee {
      bg-image('guarantee_1');
      &.icon-2 {
        bg-image('guarantee_2');
      }
      &.icon-3 {
        bg-image('guarantee_3');
      }
      &.icon-4 {
        bg-image('guarantee_4');
      }
    }
    &.invoice {
      bg-image('invoice_1');
      &.icon-2 {
        bg-image('invoice_2');
      }
      &.icon-3 {
        bg-image('invoice_3');
      }
      &.icon-4 {
        bg-image('invoice_4');
      }
    }
    &.special {
      bg-image('special_1');
      &.icon-2 {
        bg-image('special_2');
      }
      &.icon-3 {
        bg-image('special_3');
      }
      &.icon-4 {
        bg-image('special_4');
      }
    }
  }
</style>
