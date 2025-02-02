import { createStore } from 'vuex'

export default createStore({
  state: {
    userId:""
  },
  getters: {
    getUserId:(state) => state.userId
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    }
  },
  actions: {
  },
  modules: {
  }
})
