<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/csu.png" style="width:400px">
    <Home msg="增强提示演示"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Home from '@/components/home-page.vue'; // @ is an alias to /src

@Options({
  components: {
    Home,
  },
})
export default class HomeView extends Vue {}
</script>
