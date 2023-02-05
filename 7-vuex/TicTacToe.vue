<template>
  <div>
    <div>{{ turn }} 님의 턴입니다</div>
    <table-component>
      <tr v-for="(rowData, rowIndex) in tableData" :key="rowIndex">
        <td
          @click="onClickTd(rowIndex, cellIndex)"
          v-for="(cellData, cellIndex) in rowData"
          :key="cellIndex"
        >
          {{ cellData }}
        </td>
      </tr>
    </table-component>
    <div v-if="winner">{{ winner }} 님의 승리!</div>
  </div>
</template>

<script>
import TableComponent from "./TableComponent";
import { mapState } from "vuex";
import store, {
  CHANGE_TURN,
  CLICK_CELL,
  NO_WINNER,
  RESET_GAME,
  SET_WINNER,
} from "./store";
export default {
  store,
  components: {
    TableComponent,
  },
  computed: {
    ...mapState(["winner", "turn", "tableData"]),
  },
  methods: {
    onClickTd(rowIndex, cellIndex) {
      if (this.cellData) return;

      this.$store.commit(CLICK_CELL, {
        row: rowIndex,
        cell: cellIndex,
      });

      let win = false;
      if (
        this.tableData[rowIndex][0] === this.turn &&
        this.tableData[rowIndex][1] === this.turn &&
        this.tableData[rowIndex][2] === this.turn
      ) {
        win = true;
      }
      if (
        this.tableData[0][cellIndex] === this.turn &&
        this.tableData[1][cellIndex] === this.turn &&
        this.tableData[2][cellIndex] === this.turn
      ) {
        win = true;
      }
      if (
        this.tableData[0][0] === this.turn &&
        this.tableData[1][1] === this.turn &&
        this.tableData[2][2] === this.turn
      ) {
        win = true;
      }
      if (
        this.tableData[0][2] === this.turn &&
        this.tableData[1][1] === this.turn &&
        this.tableData[2][0] === this.turn
      ) {
        win = true;
      }

      if (win) {
        // 3줄 달성으로 승리
        this.$store.commit(SET_WINNER, this.turn);
        this.$store.commit(RESET_GAME);
      } else {
        //무승부
        let all = true;
        this.tableData.forEach((row) => {
          row.forEach((cell) => {
            if (!cell) {
              all = false;
            }
          });
        });
        if (all) {
          this.$store.commit(NO_WINNER);
          this.$store.commit(RESET_GAME);
        } else {
          // 게임 계속 진행
          this.$store.commit(CHANGE_TURN);
        }
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
