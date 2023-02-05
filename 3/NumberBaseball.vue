<template>
  <div>
    <h1>{{ result }}</h1>
    <form @submit.prevent="onSubmitForm">
      <input ref="answer" maxlength="4" v-model="value" />
      <button>입력</button>
    </form>
    <div>시도: {{ tries.length }}</div>
    <ul>
      <li v-for="t in tries" :key="t.entered">
        <div>{{ t.entered }}</div>
        <div>{{ t.result }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
const getNumbers = () => {
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];

  for (let i = 0; i < 4; i++) {
    const chosen = candidates.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }

  return array;
};

export default {
  data() {
    return {
      answer: getNumbers(),
      tries: [],
      value: "",
      result: "",
    };
  },
  methods: {
    onSubmitForm() {
      if (this.value === this.answer.join("")) {
        this.tries.push({
          entered: this.value,
          result: "홈런",
        });
        this.result = "홈런";
        alert(`${this.tries.length}번 만에 성공! 게임을 다시 시작합니다.`);
        this.value = "";
        this.answer = getNumbers();
        this.tries = [];
        this.$refs.answer.focus();
      } else {
        if (this.tries.length >= 9) {
          this.result = `10번 넘게 돌려서 실패. 정답은 ${this.answer.join("")}`;
          alert("게임을 다시 시작합니다.");
          this.value = "";
          this.answer = getNumbers();
          this.tries = [];
          this.$refs.answer.focus();
        }

        let strike = 0;
        let ball = 0;

        const answerArray = this.value.split("").map((v) => parseInt(v));

        for (let i = 0; i < 4; i++) {
          if (answerArray[i] === this.answer[i]) {
            strike += 1;
          } else if (this.answer.includes(answerArray[i])) {
            ball += 1;
          }
        }
        this.tries.push({
          entered: this.value,
          result: `${strike} 스트라이크, ${ball} 볼 입니다.`,
        });
        this.value = "";
        this.$refs.answer.focus();
      }
    },
  },
};
</script>

<style></style>
