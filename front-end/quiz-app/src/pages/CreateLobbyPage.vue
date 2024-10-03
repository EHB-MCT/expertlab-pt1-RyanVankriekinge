<template>
    <main>
        <div class="content create-lobby">
            <h2>Choose quiz</h2>
            <form @submit.prevent="submitForm" class="choose-quiz">
                <select v-model="selectedQuiz" class="quiz-dropdown input-field">
                    <option disabled value="">Select a quiz</option>
                    <option value="quiz1">Quiz 1</option>
                    <option value="quiz2">Quiz 2</option>
                    <option value="quiz3">Quiz 3</option>
                </select>

                <button class="button-small" type="submit">Continue</button>
            </form>
        </div>
    </main>
</template>

<script>
    export default {
        name: 'CreateLobbyPage',
    };
</script>