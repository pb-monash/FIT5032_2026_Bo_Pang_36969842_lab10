<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">FIT5032 Lab 10</RouterLink>
    <nav aria-label="Primary navigation">
      <RouterLink to="/WeatherCheck">Get Weather</RouterLink>
      <RouterLink to="/CountBookAPI">Count Book API</RouterLink>
      <RouterLink to="/GetAllBookAPI">GetAllBookAPI</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
