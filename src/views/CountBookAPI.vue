<template>
  <main class="page-shell api-view">
    <section class="weather-panel">
      <div class="panel-heading">
        <p class="eyebrow">Local JSON API</p>
        <h1>Count Book API</h1>
      </div>

      <div v-if="loading" class="status-message">
        Loading authors data...
      </div>

      <div v-if="error" class="status-message error">
        {{ error }}
      </div>

      <div v-if="apiResponse" class="summary-grid">
        <article>
          <span>Authors</span>
          <strong>{{ authorsCount }}</strong>
        </article>
        <article>
          <span>Books</span>
          <strong>{{ totalBooks }}</strong>
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
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)
const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null

  try {
    authors.value = authorsData
    calculateStats()

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map((author) => ({
          name: author.name,
          bookCount: author.famousWorks.length,
        })),
      },
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getApiData()
})

defineExpose({
  getApiData,
})
</script>
