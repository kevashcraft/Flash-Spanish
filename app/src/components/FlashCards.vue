<template>
    <transition-group name="list" class="card_container" tag="div">
        <FlashCard v-for="card in cards" :card="card" :key="card.index" />
    </transition-group>
</template>

<script>
import { mapState } from 'vuex'

import FlashCard from './FlashCard.vue'

export default {
  name: 'FlashCards',
  components: { FlashCard },
  computed: mapState(['cards'])
}
</script>

<style scoped>

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
