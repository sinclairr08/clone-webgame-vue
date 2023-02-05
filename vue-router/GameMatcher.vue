<template>
  <div v-if="currentGame === 'number-baseball'">
    <number-baseball></number-baseball>
  </div>
  <div v-else-if="currentGame === 'response-check'">
    <response-check></response-check>
  </div>
  <div v-else-if="currentGame === 'lotto-generator'">
    <lotto-generator></lotto-generator>
  </div>
  <div v-else>일치하는 게임이 없습니다</div>
</template>

<script>
import NumberBaseball from "../3/NumberBaseball";
import ResponseCheck from "../4/ResponseCheck";
import LottoGenerator from "../6/LottoGenerator";

export default {
  components: {
    NumberBaseball,
    ResponseCheck,
    LottoGenerator,
  },
  computed: {
    currentGame() {
      return this.$route.params.name;
    },
  },
};
</script>
