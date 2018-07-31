<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Recording</span>
      <md-button class="md-raised">Start Recording</md-button>
      <md-button class="md-raised md-accent">submit</md-button>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Sound List
        </md-toolbar>

        <md-list>
          <md-button class="md-fab md-mini md-primary" v-on:click.stop.prevent="createFirst">
            <md-icon>+</md-icon>
          </md-button>
          
          <md-layout v-for="sound of sounds" v-bind:key="sound.id">
              <md-card md-with-hover>
                <md-ripple>
                  <md-card-header>
                    <div class="md-title">{{sound.title}}</div>
                    <div class="md-subhead">{{sound.start_time}}</div>
                  </md-card-header>
                  <md-card-actions>
                    <md-button>Delete</md-button>
                  </md-card-actions>
                </md-ripple>
              </md-card>
            </md-layout>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-field>
          <label>Title</label>
          <md-input v-model="title" md-counter="30"></md-input>
        </md-field>
        <p v-for="item of items" v-bind:key="item.id">{{ item.text }}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <md-field>
          <label>Textarea</label>
          <md-textarea v-model="text"></md-textarea>
        </md-field>
        <md-button class="md-raised md-primary">add</md-button>
      </md-app-content>

    </md-app>
  </div>
</template>

<script>
import apiService from "./api-service";

export default {
  name: 'App2',
  data() {
    return {
      sounds: [],
      isRecording: false,
      audioRecorder: null,
      recordingData: [],
      dataUrl: '',
      sound_id: 1,
      title: "test-title",
      startTime: '',
      endTime: '',
      audioElement: null,
      blob: null,
      gapSeconds: 3,
      text: '',
      time: '',
      items: [],
    };
  },
  methods: {

    createFirst: function(){
      this.createSound();
          setTimeout(() => {
            this.getNote();
          }, 1000);
    },

    createSound: function() {
      apiService.createSound({
        title: this.title,
        startTime: new Date().toISOString()},
      )
        .then(newsoundid => {
          this.sound_id = newsoundid;
          console.log(newsoundid)
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
        });
    },

    getSound: function() {
      apiService.getSound()
        .then(sounds => {
          this.sounds = sounds;
                console.log(this.sounds);
        });
    },

    getSoundRaw: function() {
      apiService.getSoundRaw(this.sound_id)
        .then(rblob => {
          this.dataUrl = window.URL.createObjectURL(rblob);
          setTimeout(() => {
            this.togglePlay();
          }, 100);
        });
        this.getSoundInfo();
    },
    getSoundInfo: function() {
      apiService.getSoundInfo(this.sound_id)
        .then( items=> {
          const { title, startTime, endTime} = items;
          console.log(title);
          console.log(startTime);
          console.log(endTime);
        });
    },
    toggleRecording: function() {
        var that = this;
        this.isRecording = !this.isRecording;
        
        if (this.isRecording) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia({
                    audio: true,
                    video: false
                }, function(stream) {
                    that.stream = stream;
                    that.audioRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm',
                        audioBitsPerSecond : 96000
                    });
                    that.audioRecorder.start();
                    console.log('Media recorder started');
                }, function(error) {
                    alert(JSON.stringify(error));
            });
            this.setStartTime();
        }
        else {
            this.audioRecorder.stop();
            this.audioRecorder.ondataavailable = function(event) {
              that.recordingData.push(event.data);
            };
            this.audioRecorder.onstop = function(event) {
              console.log('Media recorder stopped');
              that.blob = new Blob(that.recordingData, { type: 'audio/webm'});
            };
            this.setEndTime();
        };
    },

    setStartTime: function(){
      const startTime =  new Date()
      this.startTime = startTime.toISOString()
    },
    setEndTime: function(){
      const endTime =  new Date()
      this.endTime = endTime.toISOString()
    },

    submitRecording: function(evt) {
      apiService.createSoundRaw({
        title: this.title,
        blob : this.blob,
        startTime: this.startTime,
        endTime: this.endTime},
        this.sound_id
      )
        .then(newsoundid => {
          //this.items.push(newitem);
          console.log(newsoundid)
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
          //this.setMessage('There was an error adding your item');
        });
    },

    togglePlay: function() {
    var audioElement = document.getElementById("audio");
      if (audioElement.paused === false) {
        audioElement.pause();
        console.log('Media play pause');
     } else {
        audioElement.play();
        console.log('Media play ');
     }
    },

    goPlay: function() {
    var audioElement = document.getElementById("audio");
        audioElement.currentTime = this.gapSeconds ;
        audioElement.play();
        console.log('Media play ');
    },



    getNote: function() {
      apiService.getNote(this.sound_id)
        .then(items => {
          this.items = items;
        });
    },
    addText: function(evt) {
      evt.preventDefault();
      console.log(this.text , new Date(), this.sound_id);
      apiService.createNote({
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

  },
  mounted: function() {
    this.getSound();
    this.getNote();
  },
};
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
