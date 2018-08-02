<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Recording</span>
      <md-button class="md-raised" v-on:click.stop.prevent="toggleRecording">
        <i class="stop icon" v-show="isRecording"></i>
        <i class="record icon" v-show="!isRecording"></i>
        <span v-show="!isRecording">Start recording</span>
        <span v-show="isRecording">End recording</span>
      </md-button>

      <md-button class="md-raised md-accent" v-on:click.stop.prevent="submitRecording">submit</md-button>
      <md-button class="md-raised md-accent" v-on:click.stop.prevent="getSoundRaw">play</md-button>
      <audio id="audio" style="display:block; width: 100%" controls v-bind:src='dataUrl' v-if="dataUrl.length > 0" preload="auto"></audio>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Sound List
        </md-toolbar>

        <md-list>
          <md-button class="md-fab md-mini md-primary" v-on:click.stop.prevent="createFirst">
            <md-icon>+</md-icon>
          </md-button>
          
          <md-layout v-for="sound of sounds" v-bind:key="sound.id" v-on:click="reviewSoundAndNote(sound)" >
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
          <md-input v-model="title" md-counter="30" v-on:change="changeTitle()"></md-input>
        </md-field>
        <p v-for="item of items" v-bind:key="item.id" v-on:click="getGapTime(item)" >{{ item.text }}</p>
        <md-field>
          <label>Textarea</label>
          <md-textarea v-model="text"></md-textarea>
        </md-field>
        <md-button class="md-raised md-primary" v-on:click="addText">add</md-button>
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
      title: '',
      startTime: '',
      endTime: '',
      audioElement: null,
      blob: null,
      gapSeconds: 3,
      text: '',
      submit_time: '',
      items: [],
    };
  },
  methods: {

    createFirst: async function(){
      this.ResetItems();
      this.ResetTitle();
      await this.createSound();
      this.getSound();
    },

    changeTitle: async function() {
      console.log("title sound id=" , this.sound_id);
      console.log(this.title);
      await this.putSoundInfo();
      this.getSound();
    },

    reviewSoundAndNote: function(sound) {
      apiService.getNote(sound.id)
        .then(items => {
          this.items = items;
        });
        this.sound_id = sound.id
        this.startTime = sound.start_time
        console.log("here",sound.id)
    },

    getNote: function() {
      apiService.getNote(this.sound_id)
        .then(items => {
          this.items = items;
        });
    },

    createSound: function() {
      return apiService.createSound({
        title: this.title,
        startTime: new Date().toISOString()},
      )
        .then(newsoundid => {
          this.sound_id = newsoundid;
          return newsoundid
          console.log(newsoundid)
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
        });
    },

    getGapTime: function(item) {
      console.log("item.submit_time=",item.submit_time);
      console.log(this.startTime);
      let d2 = new Date(item.submit_time);
      let d1 = new Date(this.startTime);
      let d3 = new Date(this.endTime);
      if ((d2 - d1)>0 && (d3 - d2)>0 ){
        this.gapSeconds =  (d2 - d1)/1000;
        console.log(this.gapSeconds);
        this.goPlay();
      }else{
        console.log("out of time");
      }
    },

    getSoundRaw: function() {
      apiService.getSoundRaw(this.sound_id)
        .then(rblob => {
          this.dataUrl = window.URL.createObjectURL(rblob);
          setTimeout(() => {
            this.togglePlay();
          }, 1000);
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

    getSound: function() {
      return apiService.getSound()
        .then(sounds => {
          this.sounds = sounds;
          return sounds
        });
    },

    toggleRecording: function() {
        this.isRecording = !this.isRecording;
        if (this.isRecording) {
          this.recording();
        }
        else {
          this.stoprecording();
        };
    },

    recording: function(){
      var that = this;
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
    },

    stoprecording: function() {
      var that = this;
      this.audioRecorder.stop();
      this.audioRecorder.ondataavailable = function(event) {
        that.recordingData.push(event.data);
      };
      this.audioRecorder.onstop = function(event) {
        console.log('Media recorder stopped');
        that.blob = new Blob(that.recordingData, { type: 'audio/webm'});
      };
      this.setEndTime();
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
      this.createSoundRaw();
      this.putSoundInfo();
    },

    createSoundRaw: function(evt) {
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
        });
    },
    
    putSoundInfo: function(){
      return apiService.putSoundInfo({
        title: this.title,
        startTime: this.startTime,
        endTime: this.endTime},
        this.sound_id
      )
        .then(newsoundid => {
          return newsoundid ;
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
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


    addText: function(evt) {
      evt.preventDefault();
      //console.log(this.text , new Date(), this.sound_id);
      apiService.createNote({
        text: this.text,
        submit_time: new Date()},
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
    ResetTitle: function(message) {
      this.title = '';
    },
    ResetItems: function(message) {
      this.items = [];
    },

  },
  mounted: function() {
    this.getSound().then(sounds => {
      this.sound_id = sounds[0].id;
      this.getNote();
        // こっちは更新さ入れている。
    });
    // ここではまだsoudnidは更新されていない
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
