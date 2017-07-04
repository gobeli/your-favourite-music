<template>
  <main>
    <section v-if="!$spotify.token" class="hero is-fullheight is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="login">
            <button class="button is-primary is-large" @click="login">Login with spotify</button>
          </div>
        </div>
      </div>
    </section>
    <div class="container" v-if="$spotify.token">
      <div class="content">
        <h1 class="title is-2">My favourite Music</h1>
      </div>
      <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li :class="{'is-active': activeTab === 'artists'}" @click="activate('artists')"><a>Favourite Artists</a></li>
          <li :class="{'is-active': activeTab === 'tracks'}" @click="activate('tracks')"><a>Favourite Tracks</a></li>
          <li :class="{'is-active': activeTab === 'favourite genres'}" @click="activate('favourite genres')"><a>Favourite Genres</a></li>
        </ul>
      </div>
      <div class="field">
        <label class="label">Time frame</label>
        <p class="control">
          <span class="select">
            <select v-model="timeRange">
              <option value="long_term">Always</option>
              <option value="medium_term">&#126; 6 Months</option>
              <option value="short_term">&#126; 4 Weeks</option>
            </select>
          </span>
        </p>
      </div>
      <div class="content" v-if="activeTab === 'artists'">
        <h2>Artists</h2>
        <app-medium v-for="artist in saveArtists" :medium="artist" :key="artist.key"></app-medium>
      </div>
      <div class="content" v-if="activeTab === 'tracks'">
        <h2>Tracks</h2>
        <app-medium v-for="track in saveTracks" :medium="track" :key="track.key"></app-medium>
      </div>
      <div class="content" v-if="activeTab === 'favourite genres'">
        <h2>Favourite Genres</h2>
        <app-chart :data="genres.map(g => g.count)" :labels="genres.map(g => g.genre)"></app-chart>
      </div>
    </div>
  </main>
</template>

<script>
import Chart from './components/Chart'
import Medium from './components/Medium'
import {UserHandler} from 'spotify-sdk'

export default {
  name: 'app',
  data: () => ({
    user: null,
    genres: [],
    artists: [],
    tracks: [],
    timeRange: 'long_term',
    activeTab: 'artists'
  }),
  components: {
    'app-chart': Chart,
    'app-medium': Medium
  },
  mounted() {
    if (this.$spotify.token) {
      this.user = new UserHandler()
      this.activate('artists')
    }
  },
  watch: {
    timeRange() {
      this.activate(this.activeTab)
    }
  },
  computed: {
    saveArtists() {
      return this.artists.map(a =>
        ({ image: this.getImage(a), name: a.name, key: a.id, url: a.external_urls.spotify }))
    },
    saveTracks() {
      return this.tracks.map(t =>
        ({ image: this.getImage(t.album), name: t.name, key: t.id, url: t.external_urls.spotify }))
    }
  },
  methods: {
    login() {
      this.$spotify.login().then((url) => {
        window.location.href = wind
	    });
    },
    logout() {
      localStorage.removeItem('token')
      location.reload()
    },
    getImage(item) {
      if (item && item.images) {
        return item.images.find(i => i.height === 64)
      }
    },
    activate(type) {
      this.activeTab = type
      if (type === 'favourite genres') {
        type = 'artists'
      }
      this.user.top(type, { limit: 100, time_range: this.timeRange  })
        .catch((err) => this.logout())
        .then((x) => {
          this[type] = x.map(a => Object.assign(a, {popularity: a.popularity + ' / 100'}))
          if (type === 'artists') this.getGenres()
        })
    },
    getGenres() {
      let genres = [];
      for (var genre of this.artists.map(a => a.genres).reduce((a,b) => a.concat(b))) {
        const gen = genres.find(g => g.genre === genre)
        if (gen) {
          gen.count++
        } else {
          genres.push({ genre, count: 1 })
        }
      }
      this.genres = genres.sort((a,b) => b.count-a.count).splice(0, 10);
      console.log(this.genres)
    }
  }
}
</script>
<style lang="scss">
  .container {
    padding: 1rem;
  }
  .select {
    width: 100%;
    select {
      display: block;
      width: 100%;
    }
  }
  .login {
    display: flex;
    justify-content: center;
  }
</style>
