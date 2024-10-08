<template>
    <main>
        <div class="content create-quiz">
        <h2>Create a New Quiz</h2>
        <form @submit.prevent="submitQuiz" class="create-quiz-form">

            <input
            v-model="quizTitle"
            type="text"
            class="input-field"
            placeholder="Quiz Title"
            required
            />

            <div class="questions-section">
            <p>Questions</p>
            <div v-for="(question, index) in questions" :key="index" class="question-item">
                <input
                v-model="question.text"
                type="text"
                class="input-field"
                :placeholder="'Question ' + (index + 1)"
                required
                />

                <div class="answers-section">
                <p>Answers</p>
                <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="answer-item">
                    <input
                    v-model="answer.text"
                    type="text"
                    class="input-field"
                    :placeholder="'Answer ' + (answerIndex + 1)"
                    required
                    />
                    <label class="correct-answer-text">
                        <br>
                    <input
                        class="correct-answer-radio"
                        type="radio"
                        v-model="question.correctAnswer"
                        :value="answerIndex"
                    />
                    Correct Answer
                    </label>
                </div>
                <button type="button" class="button-small" @click="addAnswer(index)">Add Answer</button>
                </div>
                <button type="button" class="button-small" @click="removeQuestion(index)">Remove Question</button>
            </div>
            <button type="button" class="button-small" @click="addQuestion">Add Question</button>
            </div>

            <button class="button-small" type="submit">Create Quiz</button>
        </form>
    </div>
</main>
</template>
  
<script>
  export default {
    name: 'CreateQuizPage',
    data() {
      return {
        quizTitle: '',
        questions: [
          {
            text: '',
            answers: [
              { text: '' },
              { text: '' }
            ],
            correctAnswer: null
          }
        ]
      };
    },
    methods: {
      addQuestion() {
        this.questions.push({
          text: '',
          answers: [
            { text: '' },
            { text: '' }
          ],
          correctAnswer: null
        });
      },
      removeQuestion(index) {
        this.questions.splice(index, 1);
      },
      addAnswer(questionIndex) {
        this.questions[questionIndex].answers.push({ text: '' });
      },
      
    },
  };
</script>