<template>
  <div class="homepage">
    <h1>recording</h1>
    <button class="button red-button" v-on:click.stop.prevent="toggleRecording">
      <i class="stop icon" v-show="isRecording"></i>
      <i class="record icon" v-show="!isRecording"></i>
      <span v-show="!isRecording">Start recording</span>
      <span v-show="isRecording">Stop recording</span>
    </button>
    <button class="button green-button" v-on:click.stop.prevent="getSound">
      <i class="play icon"></i> Play recording
    </button>
    <button class="button green-button" v-on:click.stop.prevent="submitRecording">
      <i class="send icon"></i> Send recording
    </button>
    <audio id="audio" v-bind:src='dataUrl' preload="auto"></audio>
  </div>
</template>

<script>
import apiService from "../api-service";

export default {
  name: 'Homepage',
  data() {
    return {
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
    };
  },
  methods: {
    getSound: function() {
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
