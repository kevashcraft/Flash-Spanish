<template>
  <div id="app" @click="primary()">
    <div id="window" v-long-press="1500" @long-press-start="flip()" @dblclick="dblclick">
      <transition name="flip" class="page_container" tag="div">
        <FlashCards v-if="page === 'cards'" />
        <ControlPanel v-else />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import LongPress from 'vue-directive-long-press'

import ControlPanel from './components/ControlPanel.vue'
import FlashCards from './components/FlashCards.vue'


import decks from './decks.json'
// console.log('decks', decks)
// var decks = {}

// for (let label in deckMeta) {
//   let slug = deckMeta[label].slug
//   let version = deckMeta[label].version
//   decks[slug] = {
//     deck: require(`./decks/${slug}.json`),
//     label: label,
//     version
//   }
// }

export default {
  name: 'app',
  components: {
    ControlPanel,
    FlashCards
  },
  directives: {
    'long-press': LongPress
  },
  computed: mapState(['theme', 'page', 'cardIdx', 'deck', 'cards']),
  watch: {
    cardIdx (idx) {
      if (idx >= 0) {
        let deck = decks[this.deck].deck
        if (idx < deck.length) {
          let card = deck[idx]
          card.isAnswerShowing = true
          this.$store.commit('setCard', card)
        }
      }
    },
    theme (theme) {
      this.$material.theming.theme = theme
    }
  },
  created() {
    this.$material.theming.theme = this.$store.state.theme
    var metas = {}
    var savedMetas = this.$store.state.deckMetas

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("READY2!");  
    console.log(cordova);
    console.log('LocalFileSystem', LocalFileSystem);
    function readFile(fileEntry) {

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                // displayFileData(fileEntry.fullPath + ": " + this.result);
            };

            reader.readAsText(file);

        }, (e) => console.log("freee", e));
    }
function writeFile(fileEntry, dataObj) {
      console.log("fileEntry", fileEntry);
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    }
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

        console.log('file system open: ' + fs.name);
        fs.root.getFile("newPersistentFile5.txt", { exclusive: false }, function (fileEntry) {

            console.log("fileEntry", fileEntry.isFile)
            // console.log("fileEntry is file?" + fileEntry.isFile.toString());
                readFile(fileEntry);
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'

        }, (e) => {
          console.log("EEE1", e)
            fs.root.getFile("newPersistentFile5.txt", { create: true, exclusive: false }, function (fe) {
              writeFile(fe, null);
            }, (ee) => console.log("ee", ee))
        });

    }, (e) => console.log("e2", e));


}
console.log("2");


// loop through all decks to set metadata
    for (let deckSlug in decks) {
      // get deck and saved data (none if on first load)
      let deckObj = decks[deckSlug]
      let savedObj = savedMetas[deckSlug]
      // set length and label from above
      metas[deckSlug] = {
        length: deckObj.deck.length,
        label: deckObj.label
      }
      // check if there's nothing saved or if above version is newer
      if (!savedObj || deckObj.version > savedObj.version) {
        metas[deckSlug].map = [...Array(deckObj.deck.length).keys()]
        metas[deckSlug].mapIdx = 0
      } else {
        metas[deckSlug].map = savedObj.map
        metas[deckSlug].mapIdx = savedObj.mapIdx
      }
    }
    if (this.deck === '' || !decks[this.deck]) {
      let deck = Object.keys(decks)[0]
      this.$store.commit('setDeck', deck)
    }
    this.$store.commit('setDeckMetas', metas)
    if (this.cards.length === 0) {
      this.$store.commit('incMapIdx')
    }

    window.addEventListener('keyup', event => {
      // left-arrow, up-arrow
      if (event.keyCode === 37 || event.keyCode === 38) {
        this.back();
      }
      // right-arrow
      if (event.keyCode === 39) {
        this.primary();
      }
      // space / down-arrow
      if (event.keyCode === 32 || event.keyCode === 40) {
        this.primary()
      }
    })
  },
  methods: {
    ...mapActions(['primary', 'back', 'flip']),
    dblclick () {
      if (this.dblclickInterval) {
        clearInterval(this.dblclickInterval)
      } else {
        this.dblclickInterval = setInterval (() => {
          this.primary()
        }, 1000)
      }
    }
  },
  data() {
    return {}
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
}
#window {
  position: relative;
  display: flex;
  flex: 1;
  max-width: 450px;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.page_container {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-content: stretch;
  z-index: 1;
}
.flip-enter-active, .flip-leave-active {
  animation-timing-function: ease;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.flip-enter-active {
  transform: rotateY(-90deg);
  animation: flip-in .8s;
}
.flip-leave-active {
  animation: flip-out .3s;
}
.flip-enter-to {
  transform: rotateY(0)
}
.flip-leave-to {
  transform: rotateY(90deg)
}
@keyframes flip-in {
  0% {
    transform: rotateY(-90deg)
  }
  40% {
    transform: rotateY(-90deg)
  }
  /* 60% {
    transform: rotateY(-65deg)
  } */
  100% {
    transform: rotateY(0)
  }
}
@keyframes flip-out {
  0% {
    transform: rotateY(0)
  }
  100% {
    transform: rotateY(90deg)
  }
}
</style>
