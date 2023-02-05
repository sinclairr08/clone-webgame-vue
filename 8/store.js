import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0,
};

const plantMine = (row, cell, mine) => {
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });

  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    shuffle.push(chosen);
  }

  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;

    data[ver][hor] = CODE.MINE;
  }

  return data;
};

export default new Vuex.Store({
  state: {
    tableData: [],
    data: {
      row: 0,
      cell: 0,
      mine: 0,
    },
    halted: true,
    timer: 0,
    result: "",
    openedCount: 0,
  }, // Vue의 data 역할
  getters: {}, // Vue의 computed 역할
  mutations: {
    [START_GAME](state, { row, cell, mine }) {
      state.data = {
        row,
        cell,
        mine,
      };
      state.tableData = plantMine(row, cell, mine);
      state.timer = 0;
      state.halted = false;
      state.openedCount = 0;
    },
    [OPEN_CELL](state, { row, cell }) {
      let openedCount = 0;
      const checked = [];

      /**
       * 주변 8칸이 지뢰인지 검색
       */
      function checkAround(row, cell) {
        const checkRowCellUndefined =
          row < 0 ||
          row >= state.tableData.length ||
          cell < 0 ||
          cell >= state.tableData[0].length;

        if (checkRowCellUndefined) {
          return;
        }

        if (
          [
            CODE.OPENED,
            CODE.FLAG,
            CODE.FLAG_MINE,
            CODE.QUESTION_MINE,
            CODE.QUESTION,
          ].includes(state.tableData[row][cell])
        ) {
          return;
        }

        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          checked.push(row + "/" + cell);
        }

        let around = [];

        if (state.tableData[row - 1]) {
          around = around.concat([
            state.tableData[row - 1][cell - 1],
            state.tableData[row - 1][cell],
            state.tableData[row - 1][cell + 1],
          ]);
        }

        around = around.concat([
          state.tableData[row][cell - 1],
          state.tableData[row][cell + 1],
        ]);

        if (state.tableData[row + 1]) {
          around = around.concat([
            state.tableData[row + 1][cell - 1],
            state.tableData[row + 1][cell],
            state.tableData[row + 1][cell + 1],
          ]);
        }

        const counted = around.filter((v) =>
          [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)
        );

        /** 주변에 지뢰 X */
        if (counted.length === 0 && row > -1) {
          const near = [];
          if (row - 1 > -1) {
            near.push([row - 1, cell - 1]);
            near.push([row - 1, cell]);
            near.push([row - 1, cell + 1]);
          }

          near.push([row, cell - 1]);
          near.push([row, cell + 1]);

          if (row + 1 < state.tableData.length) {
            near.push([row + 1, cell - 1]);
            near.push([row + 1, cell]);
            near.push([row + 1, cell + 1]);
          }

          near.forEach((n) => {
            if (state.tableData[n[0]][n[1]] !== CODE.OPENED) {
              checkAround(n[0], n[1]);
            }
          });
        }
        if (state.tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        Vue.set(state.tableData[row], cell, counted.length);
      }

      checkAround(row, cell);
      if (
        state.data.row * state.data.cell - state.data.mine ===
        state.openedCount + openedCount
      ) {
        state.halted = true;
        state.result = `${state.timer}초만에 승리했습니다.`;
      }
      state.openedCount += openedCount;
    },
    [CLICK_MINE](state, { row, cell }) {
      state.halted = true;
      Vue.set(state.tableData[row], cell, CODE.CLICKED_MINE);
    },
    [FLAG_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.MINE) {
        Vue.set(state.tableData[row], cell, CODE.FLAG_MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.FLAG);
      }
    },
    [QUESTION_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.FLAG_MINE) {
        Vue.set(state.tableData[row], cell, CODE.QUESTION_MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.QUESTION);
      }
    },
    [NORMALIZE_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.QUESTION_MINE) {
        Vue.set(state.tableData[row], cell, CODE.MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.NORMAL);
      }
    },
    [INCREMENT_TIMER](state) {
      state.timer += 1;
    },
  }, // state 를 동기적으로 수정하는 역할
});
