<template>

  <div class="homepage">
     <div class="items-list">
        <h2>Note</h2>
        <ul>
          <li v-for="item of items" v-bind:key="item.id">
            <div class="single-item">
              <span class="item-label">{{ item.text }}</span>
            </div>
          </li>
        </ul>
    </div>
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
      sound_id: 1,
      items: [],
    };
  },
  methods: {
    getItems: function() {
      apiService.getItems(this.sound_id)
        .then(items => {
          this.items = items;
        });
    },
    addText: function(evt) {
      evt.preventDefault();
      console.log(this.text , new Date(), this.sound_id);
      apiService.createItem({
        text: this.text,
        time: new Date()},
        this.sound_id
      )
        .then(newitem => {
          this.items.push(newitem);
          this.ResetMessage();
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
          this.setMessage('There was an error adding your item');
        });
    },
    ResetMessage: function(message) {
      this.text = '';
    },
      // TODO: Save data in server using API
  // SPAのSEO対策?
  // mounted: function () {
  //   const title = window.document.getElementsByTagName('title')[0];
  //   title.textContent = 'mystore: admin';
  // },
  },
  mounted: function() {
    this.getItems();
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
