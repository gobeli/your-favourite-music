// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {Client, TrackHandler, PlaylistHandler} from 'spotify-sdk';
import './styles/styles.scss'

let client = Client.instance;

client.settings = {
  clientId: '3beb58e0f88f41d78171e9046e455938',
  secretId: '1cfd320c917f423fb409e34476701802',
  scopes: ['user-top-read'],
  redirect_uri: process.env.NODE_ENV === 'production' ? 'https://gobeli.github.io/your-favourite-music/' : 'http://localhost:8080/'
};

if (localStorage.getItem('token')) {
    client.token = localStorage.getItem('token')
} else if (window.location.hash.split('&')[0].split('=')[1]) {
    localStorage.setItem('token', window.location.hash.split('&')[0].split('=')[1])
    client.token = localStorage.getItem('token')
}

Vue.prototype.$spotify = client
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
