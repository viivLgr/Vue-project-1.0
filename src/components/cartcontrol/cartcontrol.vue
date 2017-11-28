<template>
  <div class="cartcontrol">
    <transition name="move">
      <span class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
      <i class="icon-remove_circle_outline inner"></i>
    </span>
    </transition>
    <span class="cart-count" v-show="food.count>0">{{food.count}}</span>
    <span class="cart-increase" @click.stop.prevent="addCart"><i class="icon-add_circle"></i></span>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {  // 阻止触发两次  betterscroll才可以触发
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
//        this.$dispatch('cart.add', event.target);  // 事件对象传递给父组件
        this.$emit('add', event.target);
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol {
    font-size: 0;
    .cart-decrease, .cart-count, .cart-increase {
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      vertical-align: middle;
    }
    .cart-decrease {
      transition: all 0.4s linear;
      .inner {
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      }
      &.move-enter-active, &.move-leave-active {
        transition: all 0.4s linear;
      }
      &.move-enter, &.move-leave-active {
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner {
          transform: rotate(180deg);
        }
      }
    }
    .cart-count {
      padding: 6px 0;
      width: 12px;
      text-align: center;
      font-size: 12px;
      color: #333;
      line-height: 24px;
    }
  }
</style>
