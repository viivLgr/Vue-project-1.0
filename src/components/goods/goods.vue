<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
            @click="selectMenu(index,$event)" ref="menuList">
          <p class="text">
            <icon :num="3" :type="item.type"></icon>
            {{item.name}}
          </p>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="food-list" ref="foodList">
          <h3 class="title">{{item.name}}</h3>
          <ul>
            <li v-for="food in item.foods" class="food-item" @click.stop.prevent="selectFood(food,$event)">
              <div class="img"><img :src="food.icon" width="57" height="57"></div>
              <div class="content">
                <h4 class="name">{{food.name}}</h4>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now"><i>￥</i>{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
              :minPrice="seller.minPrice"></shopcart>
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  import icon from 'components/icon/icon';

  const ERROR_OK = 0;
  const debug = process.env.NODE_ENV !== 'production';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this._followScroll(i);
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      const url = debug ? '/api/goods' : 'http://ustbhuangyi.com/sell/api/goods';
      this.$http.get(url).then((res) => {
        res = res.body;
        if (res.errno === ERROR_OK) {
          this.goods = res.data;
          this.$nextTick(() => { // 初始化数据
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectFood(food, event) {
        if (!event._constructed) {   // _constructed 原生没有这个属性 阻止原生点击  获取自定义派发
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();  // 执行子组件方法
      },
      selectMenu(index, event) {
        if (!event._constructed) {   // _constructed 原生没有这个属性 阻止原生点击  获取自定义派发
          return;
        }
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      addFood(target) {
        this._drop(target);
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // 可以点击
        });

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 // 实时监听位置
        });

        this.foodsScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
          }
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight; // 区域高度
          this.listHeight.push(height);
        }
      },
      _followScroll(index) {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.meunScroll.scrollToElement(el, 300, 0, -100);
      },
      _drop (target) {
        // 体验优化，异步执行下落优化
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);  // 获取子组件，并使用子组件的方法
        });
      }
    },
    components: {
      icon,
      shopcart,
      cartcontrol,
      food
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods {
    display: flex;
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    overflow: hidden;
    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height: 14px;
        vertical-align: middle;
        &.current {
          position: relative;
          margin-top: -1px;
          z-index: 10;
          background: #fff;
          .text {
            border-no();
            font-weight: 700;
          }
        }
        .icon {
          margin-right: 2px;
        }
        .text {
          display: table-cell;
          vertical-align: middle;
          width: 56px;
          font-size: 12px;
          border-1px(rgba(7, 17, 27, 0.1));
        }
        &:last-child .text {
          border-no();
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      background: #fff;
      .title {
        padding: 0 0 0 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 152, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px 18px 0;
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          border-no();
        }
        .img {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc, .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 152, 159);
          }
          .desc {
            margin: 0 0 8px;
            line-height: 12px;
          }
          .extra {
            .count {
              margin-right: 2px;
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
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>


