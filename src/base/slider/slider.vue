<template>
    <swiper :options="swiperOption" ref="mySwiper">
        <slot></slot>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {
                swiperOption: {
                    initialSlide: 1,
                    autoplay: 2000,
                    autoplayDisableOnInteraction: false,
                    direction: 'horizontal',
                    speed: 1000,
                    loop: true,
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    mousewheelControl: true,
                    observer: true,
                    observeParents: true,
                }
            }
        },
        computed: {
            swiper () {
                return this.$refs.mySwiper.swiper
            }
        },
        mounted () {
//      this.swiper.slideTo(1, 0, false);
        },
        activated () {
        },
    }
</script>
<style>
    .swiper-pagination .swiper-pagination-bullet-active {
        opacity: 1;
        background: rgba(255, 255, 255, 0.8);
        width: 20px;
        border-radius: 5px;
        transition: all 0.5s linear;
    }
</style>
