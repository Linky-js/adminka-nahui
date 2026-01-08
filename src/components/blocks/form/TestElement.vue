<script setup>
import { reactive, watch, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({
      name: '',
      description: '',
      questions: [
        {
          question: '',
          answers: [{ text: '', points: 0 }],
        },
      ],
    }),
  },
});

const emit = defineEmits(['update:modelValue']);

// Локальное состояние теста
const testData = reactive(JSON.parse(JSON.stringify(props.modelValue)));

// Следим за изменениями и пробрасываем вверх через v-model
watch(
  testData,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
  { deep: true }
);

// Методы управления вопросами и ответами
function addQuestion() {
  testData.questions.push({
    question: '',
    answers: [{ text: '', points: 0 }],
  });
}

function removeQuestion(index) {
  testData.questions.splice(index, 1);
}

function addAnswer(questionIndex) {
  testData.questions[questionIndex].answers.push({
    text: '',
    points: 0,
  });
}

function removeAnswer(questionIndex, answerIndex) {
  testData.questions[questionIndex].answers.splice(answerIndex, 1);
}

function saveTest() {
  emit('update:modelValue', testData);
}

onMounted(() => {
  if (props.modelValue && Object.keys(props.modelValue).length > 0) {
    Object.assign(testData, props.modelValue);
  }
});
</script>

<template>
  <div class="test">
    <h2>{{ testData.name || 'Создать тест' }}</h2>

    <div class="form-group">
      <label>Название теста:</label>
      <input v-model="testData.name" type="text" />
    </div>

    <div class="form-group">
      <label>Описание теста:</label>
      <textarea v-model="testData.description"></textarea>
    </div>

    <div
      v-for="(question, qIndex) in testData.questions"
      :key="qIndex"
      class="question"
    >
      <div class="form-group">
        <h3>Вопрос {{ qIndex + 1 }}</h3>
        <input
          v-model="question.question"
          type="text"
          placeholder="Введите вопрос"
        />
      </div>

      <div
        v-for="(answer, aIndex) in question.answers"
        :key="aIndex"
        class="answer"
      >
        <div class="form-group-wrap">
          <div class="form-group">
            <h4>Вариант ответа {{ aIndex + 1 }}</h4>
            <input
              v-model="answer.text"
              type="text"
              placeholder="Вариант ответа"
            />
          </div>
          <div class="form-group">
            <label>Баллы:</label>
            <input v-model.number="answer.points" type="number" />
          </div>
        </div>
        <button type="button" @click="removeAnswer(qIndex, aIndex)">
          Удалить ответ
        </button>
      </div>

      <button type="button" @click="addAnswer(qIndex)">
        Добавить ответ
      </button>
      <button type="button" @click="removeQuestion(qIndex)">
        Удалить вопрос
      </button>
    </div>

    <button type="button" @click="addQuestion">Добавить вопрос</button>
    <button type="button" @click="saveTest">Сохранить тест</button>
  </div>
</template>

  
  <style scoped>
.form-group-wrap {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
.form-group-wrap .form-group {
  width: 100%;
}
.test {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.question {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.answer {
  margin-left: 20px;
}
#fileNews {
  display: none;
}
.content-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label {
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #333;
}
input,
textarea,
select {
  background: #f1f1f1;
  border: 1px solid #5f22c1;
  padding: 5px;
  min-height: 34px;
}
/* Basic editor styles */
.tiptap:first-child {
  margin-top: 0;
}

.tiptap img {
  display: block;
  height: auto;
  margin: 1.5rem 0;
  max-width: 100%;
}

.ProseMirror-selectednode {
  outline: 3px solid var(--purple);
}
.button-group {
  display: flex;
  gap: 10px;
}
.button-group button,
.button-group label {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: 0.3s;
}
.button-group button.is-active {
  background: #5f22c16c;
}
.tiltapContainer {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}
</style>
  