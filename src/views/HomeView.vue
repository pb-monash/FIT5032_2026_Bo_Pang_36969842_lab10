<template>
  <main class="page-shell home-view">
    <section class="intro-panel">
      <p class="eyebrow">Studio API</p>
      <h1>Weather API</h1>
      <p>Open the weather page from the navigation to test current-location weather and city search.</p>
      <RouterLink class="primary-link" to="/WeatherCheck">Get Weather</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
