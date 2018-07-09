<template>
  <div class="homepage">
    <h1>Add Item</h1>
    <p>See the <router-link to="/">Store</router-link></p>
    <form v-on:submit="addText">
      <input v-model="text" placeholder="add text" />
      <button type="submit">Add Text</button>
    </form>
  </div>
</template>

<script>
import apiService from '../api-service';

export default {
  name: 'Admin',
  data() {
    return {
      text: '',
      time: '',
      sound_id: 2,
    };
  },
  methods: {
    addText: function(evt) {
      evt.preventDefault();
      console.log(this.text , new Date(), this.sound_id);
      apiService.createItem({
        text: this.text,
        time: new Date(),
        sound_id: this.sound_id,
      })
        .then(() => {
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
          this.setMessage('There was an error adding your item');
        });
    },
      // TODO: Save data in server using API
  // SPAのSEO対策?
  // mounted: function () {
  //   const title = window.document.getElementsByTagName('title')[0];
  //   title.textContent = 'mystore: admin';
  // },
  },
};
</script>

<style scoped>
form {
  display: block;
  margin: auto;
  width: 500px;
}

input {
  margin: 5px auto;
  box-sizing: border-box;
  width: 200px;
  padding: 15px;
  display: block;
}

button {
  display: block;
  margin: 5px auto;
  padding: 15px;
}
</style>
