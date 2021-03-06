<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}"><i class="icon-shopping_cart"></i></div>
          <div v-show="totalCount>0" class="count">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="{'highlight':totalPrice>=minPrice}">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <h2 class="title">购物车</h2>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <span class="price">¥{{food.price*food.count}}</span>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
        </ul>
      </div>
    </div>
  </div>
  <div class="list-mask" @click="hideList" v-show="listShow" transition="fade"></div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [
            {
              price: 12,
              count: 2
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true  // 折叠
      };
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}起送`;
        } else {
          return '去结算';
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        var show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) { // 初始化
              this.scroll = new BScroll(this.$els.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh(); // 重新计算高度
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop (el) {
        for (let i = 0, len = this.balls.length; i < len; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList () {
        this.fold = true;
      },
      pay () {
        // @click.stop.prevent 阻止事件冒泡
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol
    },
    transitions: {
      drop: {
        beforeEnter(el) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();    // 视口偏移
              let x = rect.left - 32;
              let y = -(window.innerHeight - rect.top - 22);
              el.style.display = ''; //  显示
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
              el.style.transform = `translate3d(0,${y}px,0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter(el) {
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight;  // 主动触发浏览器重绘 没有使用所以使用disable-eslint
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterEnter(el) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .shopcart {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    background: pink;
    .content {
      display: flex;
      background: #141d27;
      font-size: 0;
      color: rgba(255, 255, 255, 0.4);
      .content-left {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          .logo {
            width: 100%;
            z
            height: 100%;
            border-radius: 50%;
            background: #2b343c;
            text-align: center;
            .icon-shopping_cart {
              line-height: 44px;
              font-size: 24px;
              color: #80858a;
            }
            &.highlight {
              background: rgb(0, 160, 220);
              .icon-shopping_cart {
                color: #fff;
              }
            }
          }
          .count {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            font-size: 10px;
            color: #fff;
            border-radius: 16px;
            padding: 0 6px;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          padding-right: 10px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          line-height: 24px;
          font-size: 16px;
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          vertical-align: top;
          line-height: 24px;
          margin: 12px 0 0 12px;
          font-size: 10px;
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        .pay {
          line-height: 48px;
          height: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          background: #2b333b;
          &.highlight {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        &.drop-transition {
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
          .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(0, 160, 220);
            transition: all 0.4s linear;
          }
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      &.fold-transition {
        transition: all 0.5s;
        transform: translate3d(0, -100%, 0);
      }
      &.fold-enter, &.fold-leave {
        transform: translate3d(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        box-shadow: 0 -1px 2px 0px rgba(7, 17, 27, 0.1);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          box-sizing: border-box;
          padding: 12px 0;
          display: flex;
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
            flex: 1;
          }
          .price {
            flex: 0 0 120px;
            width: 120px;
            line-height: 24px;
            font-size: 10px;
            color: rgb(240, 20, 20);
            font-weight: 700;
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
        .food + .food {
          border-top-1px(rgba(7, 17, 27, 0.1));
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
    &.fade-transition {
      transition: all 0.5s;
      opacity: 1;
      background: rgba(7, 17, 27, 0.6);
    }
    &.fade-enter, &.fade-leave {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
</style>
