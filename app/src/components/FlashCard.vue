<template>
  <md-content class="flash-card md-elevation-6">
    <div class="header">
      <canvas :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></canvas>
      <canvas :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></canvas>
    </div>
    <div class="content">
      <!-- <div class="question">
        <p v-if="isAnswerShowing">{{ card.answerText }}</p>
        <p v-else>{{ card.questionText }}</p>
      </div> -->
      <div class="question">
        <div if="card.questionType === 'text'">
          <p>{{ card.questionText }}</p>
        </div>
      </div>
      <div class="answer">
        <div v-if="card.answerType === 'text'">
          <p v-if="isAnswerShowing">{{ card.answerText }}</p>
          <p v-else class="blurred">{{ card.answerText }}</p>
          <!-- <p v-else class="block">Click to Show</p> -->
        </div>
      </div>
      <div class="hint">
        <p v-if="card.hintType === 'text'">{{ card.hintText }}</p>
      </div>
    </div>
    <div class="footer">
      <canvas :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></canvas>
      <canvas :width="iconSize" :height="iconSize" :data-jdenticon-value="card.hash"></canvas>
    </div>
  </md-content>
</template>

<script>
export default {
  name: 'FlashCard',
  props: {
    card: Object
  },
  computed: {

  },
  mounted () {
    window.jdenticon()
  },
  methods: {
    showAnswer(event) {
      event.stopPropagation()
      if (!this.isAnswerShowing) {
        this.isAnswerShowing = true;
      } else {
        this.$emit('next');
      }
    }
  },
  data () {
    return {
      isAnswerShowing: false,
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
  border: 1px dashed white
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
  margin-top: -50px;
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
  /* justify-content: center; */
  /* border: 1px solid blue; */
}
.question, .hint, .answer, .answer-block {
  font-size: 2rem;
  line-height: 5rem;
  display: flex;
  justify-content: center;
  min-height: 20%;
  align-items: flex-start;
  margin: 15px;
}
.question {
  font-size: 4rem;
  font-weight: 800;
}
.answer {
  align-items: flex-start;
}
/* .question {
  align-items: flex-end;
}
.hint {
}
.answer, .answer-block {
  align-items: center;
} */
.block {
  /* height: 100%;
  width: 80%; */
  border: 1px dashed black;
  /* padding: 2rem; */
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
