<template>
  <md-content class="control-panel md-elevation-6">
    <div class="content">
      <md-switch v-model="darkMode">Dark Mode</md-switch>
      <md-field>
        <label for="mapIdx">mapIdx</label>
        <md-input v-model="mapIdx" name="mapIdx" id="mapIdx" />
      </md-field>
      <md-field>
        <label for="deck">Deck</label>
        <md-select v-model="deck" name="deck" id="deck">
          <md-option v-for="d in decks" :value="d.value" :key="d.value">{{d.label}}</md-option>
        </md-select>
      </md-field>
    </div>
  </md-content>
</template>

<script>
export default {
  name: 'ControlPanel',
  computed: {
    darkMode: {
      get () {
        return this.$store.state.theme === 'default-dark'
      },
      set () {
        this.$store.commit('toggleTheme')
      }
    },
    deck: {
      get () {
        return this.$store.state.deck
      },
      set (deck) {
        this.$store.commit('setDeck', deck)
        this.$store.dispatch('refreshCard')
      }
    },
    decks () {
      let decks = []
      Object.keys(this.$store.state.deckMetas).forEach(slug => {
        decks.push({value: slug, label: this.$store.state.deckMetas[slug].label})
      })
      return decks
    },
    mapIdx: {
      get () {
        return this.$store.state.deckMetas[this.$store.state.deck].mapIdx
      },
      set (idx) {
        this.$store.commit('setMapIdx', idx)
        this.$store.dispatch('refreshCard')
      }
    },
  }
}
</script>

<style scoped>
.control-panel {
  margin: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

@media screen and (max-width: 800px) {
  .control-panel {
    margin: 5px;
  }
}

.header, .footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
}

</style>
