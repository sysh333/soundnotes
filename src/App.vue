<template>
  <div id="app">

  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  padding: 0;
  margin: 0;
  background-image: url('./assets/doodles.png');
  background-repeat: repeat;
  display: flex;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fff;
  margin: 50px auto;
  width: 800px;
  height: fit-content;
  padding: 15px;
  min-height: 600px;
  box-shadow: 0 0 3px rgba(0,0,0,0.5);
}
</style>
