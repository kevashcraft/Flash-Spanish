<template>
  <md-content class="flash-card md-elevation-6">
    <div class="header">
      <svg :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></svg>
      <svg :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></svg>
    </div>
    <div class="content">
      <audio :src="card.audio" ref="audio" />
      <div class="question">
        <div if="card.questionType === 'text' && card.answerType === 'text'">
          <p class="question-text">{{ card.questionText }}</p>
          <p class="answer-text" :class="{blurred: !card.isAnswerShowing}">{{ card.answerText }}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <svg :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></svg>
      <svg :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></svg>
    </div>
  </md-content>
</template>

<script>
export default {
  name: 'FlashCard',
  props: {
    card: Object
  },
  mounted () {
    window.jdenticon()
    this.$refs['audio'].play()
  },
  beforeDestroy () {
    this.$refs['audio'].pause()
  },
  data () {
    return {
      iconSize: 120,
    }
  }
}
</script>

<style scoped>
p {
  user-select: none;
  margin: 0;
  /* padding: 2rem; */
}
.blurred {
  color: transparent;
  text-shadow: 0 0 15px rgba(0,0,0,0.5);
}
.flash-card {
  margin: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: blue;
  /* border: 1px solid orange; */
}

@media screen and (max-width: 800px) {
  .flash-card {
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
.question, .hint, .answer, .answer-block {
  line-height: 4rem;
  display: flex;
  justify-content: center;
  min-height: 20%;
  align-items: flex-start;
  margin: 15px;
}
.question-text {
  font-size: 4rem;
  font-weight: 800;
}
.answer {
  align-items: flex-start;
}
.answer-text {
  font-size: 2rem;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
