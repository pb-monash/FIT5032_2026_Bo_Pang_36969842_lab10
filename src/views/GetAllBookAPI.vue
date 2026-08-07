<template>
  <main class="page-shell api-view">
    <section class="weather-panel">
      <div class="panel-heading">
        <p class="eyebrow">Local JSON API</p>
        <h1>GetAllBookAPI</h1>
      </div>

      <div v-if="apiResponse" class="summary-grid">
        <article>
          <span>Total Books</span>
          <strong>{{ totalBooks }}</strong>
        </article>
        <article>
          <span>Authors</span>
          <strong>{{ authorsCount }}</strong>
        </article>
      </div>

      <div v-if="apiResponse" class="api-response">
        <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authorsData from '../assets/json/authors.json'

const authors = ref([])
const books = ref([])
const apiResponse = ref(null)
const authorsCount = ref(0)
const totalBooks = ref(0)

const getAllBooks = () => {
  books.value = authors.value.flatMap((author) => {
    return author.famousWorks.map((bookTitle) => ({
      title: bookTitle,
      author: author.name,
      nationality: author.nationality,
    }))
  })
}

const getApiData = () => {
  authors.value = authorsData
  authorsCount.value = authors.value.length
  getAllBooks()
  totalBooks.value = books.value.length

  apiResponse.value = {
    success: true,
    data: {
      totalBooks: totalBooks.value,
      authorsCount: authorsCount.value,
      books: books.value,
    },
    timestamp: new Date().toISOString(),
  }
}

onMounted(() => {
  getApiData()
})

defineExpose({
  getApiData,
})
</script>
