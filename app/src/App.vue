<template>
  <div id="app" md-theme="dark">
    <div id="window" @click="showAnswer()">
      <transition-group name="list" class="card_container" tag="div">
        <FlashCard v-for="card in cards" :card="card" :key="card.index" ref="flashcard" @next="nextCard" />
      </transition-group>
      <!-- <ControlPanel class="control-panel" /> -->
    </div>
  </div>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue'
import FlashCard from './components/FlashCard.vue'

export default {
  name: 'app',
  components: {
    ControlPanel,
    FlashCard
  },
  created() {
    this.$http.get('spanish-uno.json').then(resp => {
      let data = resp.data;
      this.all_cards = data;
      this.nextCard()
    });
    window.addEventListener('keyup', event => {
      // left-arrow, up-arrow
      if (event.keyCode === 37 || event.keyCode === 38) {
        this.prevCard();
      }
      // right-arrow
      if (event.keyCode === 39) {
        this.nextCard();
      }
      // space / down-arrow
      if (event.keyCode === 32 || event.keyCode === 40) {
        this.showAnswer()
      }
    })
  },
  methods: {
    showAnswer() {
      let flashcard = this.$refs['flashcard'][0];
      flashcard.showAnswer(event)
    },
    prevCard() {
      if (this.idx > 0) {
        this.idx--;
        this.loadCard()
      }
    },
    nextCard() {
      this.idx++;
      this.loadCard()
    },
    loadCard() {
      let card = this.all_cards[this.idx];
      card.isAnswerShowing = false;
      this.cards = [card];
    }
  },
  data() {
    return {
      idx:0,
      cards:[],
      all_cards: []
    }
  }
}
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  /* align-items: stretch;
  align-content: stretch; */
}
#window {
  display: flex;
  flex: 1;
  max-width: 450px;
  /* border: 1px dashed black; */
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.card_container {
  position: relative;
  display: flex;
  flex: 1;
  /* border: 1px dashed yellow; */
  justify-content: center;
  align-content: stretch;
  z-index: 1;

}
.control-panel {
  z-index: 2;
}
/* .list-move {
  transition: transform 1s;
} */
.list-item {
  display: block;
  height: 300px;
  width: 200px;
  /* border: 1px solid pink; */
  /* margin-right: 10px; */
}
.list-leave-active {
  transition: all .5s;
}
.list-enter-active {
  transition: all .3s;
}
/* .list-enter {
  opacity: 0;
} */
.list-leave-to {
  opacity: 0;
}
/* .list-enter {
  transform: translateY(600px);
} */
.list-leave-to {
  transform: translateX(-600px);
}
.list-leave-active {
  position: absolute;
  height: 100%;
  width: 100%
}
</style>
