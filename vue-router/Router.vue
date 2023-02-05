<template>
  <div>
    <div>
      <router-link to="/game/number-baseball">숫자 야구</router-link>
      <router-link to="/game/response-check">반응 속도</router-link>
      <router-link to="/game/lotto-generator">로또생성기</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import router from "./routes";

export default {
  router,
};
</script>
