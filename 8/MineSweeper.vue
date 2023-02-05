<template>
  <div>
    <mine-form />
    <div>{{ timer }}</div>
    <table-component />
    <div>{{ result }}</div>
  </div>
</template>

<script>
import TableComponent from "./TableComponent";
import MineForm from "./MineForm";
import store, { INCREMENT_TIMER } from "./store";
import { mapState } from "vuex";

let interval;

export default {
  store,
  components: {
    TableComponent,
    MineForm,
  },
  computed: {
    ...mapState(["timer", "result", "halted"]),
  },
  methods: {},
  watch: {
    halted(value, oldValue) {
      if (value === false) {
        interval = setInterval(() => this.$store.commit(INCREMENT_TIMER), 1000);
      } else {
        clearInterval(interval);
      }
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
}
td {
  border: 1px solid black;
  width: 40px;
  height: 40px;
  text-align: center;
}
</style>
