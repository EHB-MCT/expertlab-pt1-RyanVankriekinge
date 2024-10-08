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
                <div v-for="(question, index) in questions" :key="index" class="question-item">
                    <div class="answers-section">
                        <input
                        v-model="question.text"
                        type="text"
                        class="input-field"
                        :placeholder="'Question ' + (index + 1)"
                        style="margin-top: 30px;"
                        required
                        />
                        <p style="margin-top: 30px;">Answers (Question {{ index + 1 }})</p>
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
                        <button type="button" class="button-small red" style="margin-bottom: 30px;" @click="removeQuestion(index)">Remove Question {{ index + 1 }}</button>
                    </div>
                </div>
                <button type="button" class="button-small" @click="addQuestion" style="margin-top: 30px;">Add Question</button>
            </div>

            <button class="button-small" type="submit" style="margin-top: 30px;">Create Quiz</button>
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