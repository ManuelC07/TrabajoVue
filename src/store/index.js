import { createStore } from 'vuex';

const savedUserId = localStorage.getItem('userId');

export default createStore({
  state: {
    userId: savedUserId || ''
  },
  getters: {
    getUserId: (state) => state.userId
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
      localStorage.setItem('userId', id); // 🔥 Guardamos en localStorage
    },
    logout(state) {
      state.userId = '';
      localStorage.removeItem('userId'); // 🔥 Eliminamos del localStorage
    }
  },
  actions: {},
  modules: {}
});

