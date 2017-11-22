<template>
  <div class="ratingselect">
    <ul class="rating-type">
      <li @click="select(2,$event)" class="positive" :class="{'active':selectType===2}">
        {{desc.all}}<span>{{ratings.length}}</span></li>
      <li @click="select(0,$event)" class="positive" :class="{'active':selectType===0}">{{desc.positive}}<span>{{positives.length}}</span>
      </li>
      <li @click="select(1,$event)" class="negative" :class="{'active':selectType===1}">{{desc.negative}}<span>{{negatives.length}}</span>
      </li>
    </ul>
    <div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i><span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default() {
          return ALL;
        }
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {   // _constructed 原生没有这个属性 阻止原生点击  获取自定义派发
          return;
        }
        this.selectType = type;
        this.$dispatch('ratingtype.select', type);
      },
      toggleContent(event) {
        if (!event._constructed) {   // _constructed 原生没有这个属性 阻止原生点击  获取自定义派发
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$dispatch('content.toggle', this.onlyContent);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratingselect {
    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      overflow: hidden;
      border-1px(rgba(7, 17, 27, 0.1))
      li {
        float: left;
        margin-right: 8px;
        line-height: 20px;
        padding: 8px 12px;
        font-size: 12px;
        border-radius: 1px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff;
        }
        &.positive {
          background: rgba(0, 160, 220, 0.2);
          &.active {
            background: rgb(0, 160, 220);
          }
        }
        &.negative {
          background: rgba(77, 85, 93, 0.2);
          &.active {
            background: rgb(77, 85, 93);
          }
        }
        span {
          font-size: 8px;
          margin-left: 2px;
          line-height: 16px;
        }
      }
    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      color: rgb(147, 153, 159);
      border-1px(rgba(7, 17, 27, 0.1));
      font-size: 12px;
      &.on {
        .icon-check_circle {
          color: #00c850;
        }
      }
      .icon-check_circle {
        font-size: 24px;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
</style>
