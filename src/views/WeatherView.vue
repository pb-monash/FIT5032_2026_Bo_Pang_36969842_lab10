<template>
  <main class="page-shell weather-view">
    <section class="weather-panel">
      <div class="panel-heading">
        <p class="eyebrow">OpenWeather API</p>
        <h1>WEATHER APP</h1>
      </div>

      <form class="search-bar" @submit.prevent="searchByCity">
        <input
          v-model.trim="city"
          type="text"
          class="search-input"
          placeholder="Enter city name, e.g. Clayton, AU"
          aria-label="City name"
        />
        <button class="search-button" type="submit" :disabled="loading">
          Search
        </button>
      </form>

      <form
        v-if="apiKeyMissing"
        class="search-bar api-key-bar"
        @submit.prevent="saveApiKey"
      >
        <input
          v-model.trim="apiKeyInput"
          type="password"
          class="search-input"
          placeholder="Enter OpenWeather API key"
          aria-label="OpenWeather API key"
        />
        <button class="search-button" type="submit" :disabled="loading">
          Save Key
        </button>
      </form>

      <div v-if="loading" class="status-message">
        Loading weather data...
      </div>

      <div v-if="error" class="status-message error">
        {{ error }}
      </div>

      <section v-if="weatherData" class="weather-card" aria-label="Weather result">
        <div>
          <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
          <span>{{ weatherData.weather[0].description }}</span>
        </div>

        <div class="weather-main">
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>

        <dl class="weather-details">
          <div>
            <dt>Feels like</dt>
            <dd>{{ feelsLike }} °C</dd>
          </div>
          <div>
            <dt>Humidity</dt>
            <dd>{{ weatherData.main.humidity }}%</dd>
          </div>
          <div>
            <dt>Wind</dt>
            <dd>{{ windSpeed }} m/s</dd>
          </div>
        </dl>
      </section>
    </section>
  </main>
</template>

<script>
import axios from 'axios'

const envApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const placeholderApiKey = 'replace_with_your_openweather_api_key'
const storageKey = 'openweather_api_key'

export default {
  name: 'WeatherView',
  data() {
    return {
      city: '',
      apiKeyInput: '',
      savedApiKey: '',
      weatherData: null,
      loading: false,
      error: '',
    }
  },
  computed: {
    activeApiKey() {
      if (envApiKey && envApiKey !== placeholderApiKey) {
        return envApiKey
      }

      return this.savedApiKey
    },
    apiKeyMissing() {
      return !this.activeApiKey
    },
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null
    },
    feelsLike() {
      return this.weatherData ? Math.round(this.weatherData.main.feels_like) : null
    },
    windSpeed() {
      return this.weatherData ? this.weatherData.wind.speed.toFixed(1) : null
    },
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
        : null
    },
  },
  mounted() {
    this.savedApiKey = localStorage.getItem(storageKey) || ''
    this.fetchCurrentLocationWeather()
  },
  methods: {
    saveApiKey() {
      if (!this.apiKeyInput) {
        this.error = 'Please enter an OpenWeather API key.'
        return
      }

      this.savedApiKey = this.apiKeyInput
      localStorage.setItem(storageKey, this.savedApiKey)
      this.apiKeyInput = ''
      this.error = ''
      this.fetchCurrentLocationWeather()
    },
    async fetchCurrentLocationWeather() {
      if (this.apiKeyMissing) {
        return
      }

      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by this browser.'
        return
      }

      this.loading = true
      this.error = ''

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const url = 'https://api.openweathermap.org/data/2.5/weather'
          await this.fetchWeatherData(url, {
            lat: latitude,
            lon: longitude,
            appid: this.activeApiKey,
            units: 'metric',
          })
        },
        () => {
          this.loading = false
          this.error = 'Location permission was denied. Search by city instead.'
        },
      )
    },
    async searchByCity() {
      if (this.apiKeyMissing) {
        this.error = 'OpenWeather API key is missing.'
        return
      }

      if (!this.city) {
        this.error = 'Please enter a city name.'
        return
      }

      const url = 'https://api.openweathermap.org/data/2.5/weather'
      await this.fetchWeatherData(url, {
        q: this.city,
        appid: this.activeApiKey,
        units: 'metric',
      })
    },
    async fetchWeatherData(url, params) {
      this.loading = true
      this.error = ''

      try {
        const response = await axios.get(url, { params })
        this.weatherData = response.data
      } catch (err) {
        this.weatherData = null
        this.error = err.response?.data?.message
          ? `Error fetching weather data: ${err.response.data.message}`
          : 'Error fetching weather data.'
        console.error('Error fetching weather data:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
