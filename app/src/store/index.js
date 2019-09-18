import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import VuexPersistence from 'vuex-persist'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const vuexLocal = new VuexPersistence({
  key: 'flash!',
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: {
    theme: 'default',

    deck: '',

    deckMetas: {},

    cardIdx: 0,

    cards: [],

    page: 'cards',

    pageChanging: false

  },
  mutations: {
    decMapIdx(state) {
      if (!state.deckMetas[state.deck]) return
      let mapIdx = state.deckMetas[state.deck].mapIdx - 1
      if (mapIdx < 0) {
        mapIdx = state.deckMetas[state.deck].length - 1
      }
      state.deckMetas[state.deck].mapIdx = mapIdx
      state.cardIdx = state.deckMetas[state.deck].map[mapIdx]
    },
    incMapIdx(state) {
      if (!state.deckMetas[state.deck]) return
      let mapIdx = state.deckMetas[state.deck].mapIdx + 1
      if (mapIdx >= state.deckMetas[state.deck].length) {
        mapIdx = 0
      }
      state.deckMetas[state.deck].mapIdx = mapIdx
      state.cardIdx = state.deckMetas[state.deck].map[mapIdx]
    },
    setCard(state, card) {
      state.cards = [card]
    },
    setCardIdx(state, idx) {
      state.cardIdx = [idx]
    },
    setDeck(state, deck) {
      state.deck = deck
    },
    setDeckMetas(state, metas) {
      state.deckMetas = metas
    },
    setPageChanging(state, pageChanging) {
      state.pageChanging = pageChanging
    },
    setMapIdx(state, idx) {
      state.deckMetas[state.deck].mapIdx = idx
    },
    toggleIsAnswerShower(state) {
      state.cards[0].isAnswerShowing = true
    },
    togglePage(state) {
      state.page = state.page === 'cards' ? 'control' : 'cards'
    },
    toggleTheme(state) {
      state.theme = state.theme === 'default' ? 'default-dark' : 'default'
    }
  },
  actions: {
    flip({ commit }) {
      commit('setPageChanging', true)
      commit('togglePage')
      setTimeout(() => commit('setPageChanging', false), 750)
    },
    back({ commit, state }) {
      if (state.page === 'cards' && state.pageChanging === false) {
        commit('decMapIdx')
      }

    },
    primary({ commit, state }) {
      if (state.page === 'cards' && state.pageChanging === false) {
        // if (state.cards[0].isAnswerShowing) {
          commit('incMapIdx')
        // } else {
        //   commit('toggleIsAnswerShower')
        // }
      }
    },

    refreshCard({ commit, state }) {
      commit('setCardIdx', -1)
      let mapIdx = state.deckMetas[state.deck].mapIdx
      let cardIdx = state.deckMetas[state.deck].map[mapIdx]
      commit('setCardIdx', cardIdx)
    }
  },
  plugins: [vuexLocal.plugin]
})

export default store
