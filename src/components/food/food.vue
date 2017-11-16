<template>
  <div class="food" v-show="showFlag" transition="move" v-el:food>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image">
        <i class="icon-arrow_lift back" @click="hide"></i>
      </div>
      <div class="content">
        <h2 class="title">{{food.name}}</h2>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now"><i>￥</i>{{food.price}}</span><span class="old"
                                                               v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
      </div>
      <div class="cartcontrol-wrapper">
        <cartcontrol :food="food"></cartcontrol>
      </div>
      <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst($event)" transition="fade">加入购物车</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      addFirst (event) {
        if (!event._constructed) {   // _constructed 原生没有这个属性 阻止原生点击  获取自定义派发
          return;
        }
        this.$dispatch('cart.add', event.target);  // 事件对象传递给父组件
        Vue.set(this.food, 'count', 1);
      },
      show () {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide () {
        this.showFlag = false;
      }
    },
    components: {
      cartcontrol
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
    &.move-transition {
      transition: all 0.3s linear;
      transform: translate3d(0, 0, 0);
    }
    &.move-enter, &.move-leave {
      transform: translate3d(100%, 0, 0);
    }
    .food-content {
      .image-header {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        .back {
          position: absolute;
          left: 0px;
          top: 0px;
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
        }
      }
      .content {
        padding: 18px;
        .title {
          line-height: 14px;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(7, 17, 27);
        }
        .detail {
          margin-bottom: 18px;
          line-height: 10px;
          height: 10px;
          font-size: 0;
          .sell-count, .rating {
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-right: 10px;
          }
        }
        .price {
          font-weight: 700;
          line-height: 24px;
          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
            i {
              font-size: 10px;
              font-style: normal;
            }
          }
          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 152, 159);
          }
        }
      }
      .cartcontrol-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
      .buy {
        position: absolute;
        right: 20px;
        bottom: 20px;
        z-index: 10;
        line-height: 24px;
        border-radius: 12px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 10px;
        background: rgb(0, 160, 220);
        color: #fff;
        &.fade-transition {
          transition: all .2s;
          opacity: 1;
        }
        &.fade-move, &.fade-leave {
          opacity: 0;
        }
      }
    }
  }
</style>
