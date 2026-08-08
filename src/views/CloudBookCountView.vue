<template>
  <main class="page-shell">
    <section class="weather-panel">
      <div class="panel-heading">
        <p class="eyebrow">Cloud Function</p>
        <h1>Book Counter</h1>
      </div>

      <form v-if="!activeFunctionUrl" class="search-bar" @submit.prevent="saveFunctionUrl">
        <input
          v-model.trim="functionUrlInput"
          type="url"
          class="search-input"
          placeholder="Enter Cloud Function URL"
          aria-label="Cloud Function URL"
        />
        <button class="search-button" type="submit">
          Save URL
        </button>
      </form>

      <button class="search-button" type="button" :disabled="loading" @click="getBookCount">
        Get Book Count
      </button>

      <div v-if="loading" class="status-message">
        Loading book count from cloud function...
      </div>

      <div v-if="error" class="status-message error">
        {{ error }}
      </div>

      <section v-if="apiResponse" class="summary-grid" aria-label="Cloud function result">
        <article>
          <span>Total number of books</span>
          <strong>{{ count }}</strong>
        </article>
        <article>
          <span>Cloud function status</span>
          <strong>{{ apiResponse.success ? 'OK' : 'Error' }}</strong>
        </article>
      </section>

      <div v-if="apiResponse" class="api-response">
        <pre>{{ formattedResponse }}</pre>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const envFunctionUrl = import.meta.env.VITE_CLOUD_BOOK_COUNT_URL
const storageKey = 'cloud_book_count_url'

const functionUrlInput = ref('')
const savedFunctionUrl = ref('')
const apiResponse = ref(null)
const loading = ref(false)
const error = ref('')

const activeFunctionUrl = computed(() => envFunctionUrl || savedFunctionUrl.value)
const count = computed(() => apiResponse.value?.data?.totalBooks ?? 0)
const formattedResponse = computed(() => JSON.stringify(apiResponse.value, null, 2))

onMounted(() => {
  savedFunctionUrl.value = localStorage.getItem(storageKey) || ''
})

function saveFunctionUrl() {
  if (!functionUrlInput.value) {
    error.value = 'Please enter a Cloud Function URL.'
    return
  }

  savedFunctionUrl.value = functionUrlInput.value
  localStorage.setItem(storageKey, savedFunctionUrl.value)
  functionUrlInput.value = ''
  error.value = ''
}

async function getBookCount() {
  if (!activeFunctionUrl.value) {
    error.value = 'Cloud Function URL is missing.'
    return
  }

  loading.value = true
  error.value = ''
  apiResponse.value = null

  try {
    const response = await axios.get(activeFunctionUrl.value)
    apiResponse.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Error loading book count from cloud function.'
  } finally {
    loading.value = false
  }
}
</script>
