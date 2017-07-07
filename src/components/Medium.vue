<template>
  <a target="_blank" :href="medium.url" class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img v-if="medium.image" :src="medium.image ? medium.image.url : ''">
      </p>
    </figure>
    <div class="media-content content">
      <strong>{{medium.name}}</strong>
    </div>
    <div class="media-right">
      <span class="icon is-big" style="margin-right: 1rem"><i class="fa fa-play"></i></span>
    </div>
  </a>
</template>
<script>
  export default {
    props: ['medium']
  }
</script>
<style lang="scss">
  .media {
    align-items: center;
    .image {
      background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%);
    }
  }

</style>
