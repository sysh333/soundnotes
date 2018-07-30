<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Recording</span>
      <md-button class="md-raised">Default</md-button>
      <md-button class="md-raised md-accent">Accent</md-button>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Sound List
        </md-toolbar>

        <md-list>
          <md-card md-with-hover>
            <md-ripple>
              <md-card-header>
                <div class="md-title">Card with hover effect</div>
                <div class="md-subhead">It also have a ripple</div>
              </md-card-header>
              <md-card-actions>
                <md-button>Action</md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>

          <md-card md-with-hover>
            <md-ripple>
              <md-card-header>
                <div class="md-title">Card with hover effect</div>
                <div class="md-subhead">It also have a ripple</div>
              </md-card-header>
              <md-card-actions>
                <md-button>Action</md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>

          <md-card md-with-hover>
            <md-ripple>
              <md-card-header>
                <div class="md-title">Card with hover effect</div>
                <div class="md-subhead">It also have a ripple</div>
              </md-card-header>
              <md-card-actions>
                <md-button>Action</md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-field>
          <label>Title</label>
          <md-input v-model="regular" md-counter="30"></md-input>
        </md-field>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <md-field>
          <label>Textarea</label>
          <md-textarea v-model="textarea"></md-textarea>
        </md-field>
        <md-button class="md-raised md-primary">add</md-button>
      </md-app-content>

    </md-app>
  </div>
</template>

<script>
  export default {
    name: 'App2',
    data: () => ({
      regular: null,
      maxLength: null,
      disabled: null,
      autogrow: null,
      textarea: null
    })
  }
</script>


<style scoped>
  .md-app {
    max-height: 800px;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-card {
    width: 220px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

</style>
