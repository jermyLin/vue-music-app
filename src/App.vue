<template>
    <div id="app">
        <m-header></m-header>
        <tab></tab>
        <keep-alive exclude="recommend">
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
    import mHeader from 'components/m-header/m-header'
    import tab from 'components/tab/tab'
    import player from 'components/player/player'

    export default {
        components: {
            mHeader,
            tab,
            player
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #fff;
    }
</style>
