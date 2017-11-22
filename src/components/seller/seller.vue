<template>
  <div class="seller" v-el:seller>
    <div class="seller-content">
      <div class="overview">
        <h2 class="title">{{seller.name}}</h2>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h3>起送价</h3>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h3>商家配送</h3>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h3>平均配送时间</h3>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" :class="{'active':favorite}" @click="toggleFavorite($event)">
          <i class="icon-favorite"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin" v-show="seller.bulletin">
        <h2 class="title">公告与活动</h2>
        <p class="text">{{seller.bulletin}}</p>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li v-for="item in seller.supports" class="support-item border-1px">
          <icon :type="item.type" :num="4"></icon>
          <span class="text">{{item.description}}</span>
        </li>
      </ul>
      <split></split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list>
            <li v-for="pic in seller.pics" class="pic-item">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h2 class="title">商家信息</h2>
        <ul class="info-list">
          <li v-for="info in seller.infos" class="info-item">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import icon from 'components/icon/icon';
  import {saveToLocal, loadFromLocal} from 'common/js/store';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    watch: {
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    ready() {
      this._initScroll();
      this._initPics();
    },
    methods: {
      toggleFavorite(event) {
        if (!event.constructed) {
          this.favorite = !this.favorite;
          saveToLocal(this.seller.id, 'favorite', this.favorite);
        }
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$els.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        // 商家图片
        if (this.seller.pics) {
          let picW = 120;
          let marginW = 6;
          let width = (picW + marginW) * this.seller.pics.length - marginW;
          this.$els.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$els.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical' // 忽略竖向滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split,
      icon
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .seller {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 18px;
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .desc {
        padding: 8px 0 18px;
        border-1px(rgba(7, 17, 27, 0.1));
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
        .text {
          margin-right: 12px;
          line-height: 18px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
      .remark {
        padding: 18px 0 0;
        display: flex;
        .block {
          flex: 1;
          text-align: center;
          h3 {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 4px;
          }
          .content {
            font-weight: 100;
            color: rgb(7, 17, 27);
            font-size: 10px;
            .stress {
              line-height: 24px;
              font-size: 14px;
            }
          }
        }
        .block + .block {
          border-left: 1px solid rgba(7, 17, 27, 0.1);
        }
      }
      .favorite {
        position: absolute;
        right: 11px;
        top: 18px;
        width: 36px;
        text-align: center;
        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          color: #d4d6d9;
          line-height: 24px;
          font-size: 24px;
        }
        &.active {
          .icon-favorite {
            color: rgb(240, 20, 20);
          }
        }
        .text {
          line-height: 10px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0;
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text {
        padding: 8px 12px 16px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 100;
        color: rgb(240, 20, 20);
      }
    }
    .supports {
      margin: 0 18px;
      .support-item {
        padding: 16px 12px;
        font-size: 0;
        border-top-1px(rgba(7, 17, 27, 0.1));
        .icon {
          margin-right: 6px;
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          font-weight: 100;
          color: rgb(7, 17, 27);
        }
      }
    }
    .pics {
      padding: 18px;
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
        margin-bottom: 8px;
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            width: 120px;
            height: 90px;
          }
          .pic-item + .pic-item {
            margin-left: 6px;
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0;
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
        margin-bottom: 8px;
      }
      .info-list {
        .info-item {
          padding: 16px 12px;
          line-height: 16px;
          font-size: 12px;
          font-weight: 100;
          color: rgb(7, 17, 27);
          border-top-1px(rgba(7, 17, 27, 0.1));
        }
      }
    }
  }
</style>

