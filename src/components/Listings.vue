<template>
  <div class="homepage">
    <h1>recording</h1>
    <button class="button red-button" v-on:click.stop.prevent="toggleRecording">
      <i class="stop icon" v-show="isRecording"></i>
      <i class="record icon" v-show="!isRecording"></i>
      <span v-show="!isRecording">Start recording</span>
      <span v-show="isRecording">Stop recording</span>
    </button>
    <button class="button green-button" v-if="dataUrl.length > 0" v-on:click.stop.prevent="getSound">
      <i class="play icon"></i> Play recording
    </button>
    <button class="button green-button" v-if="dataUrl.length > 0" v-on:click.stop.prevent="submitRecording">
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
      sound_id: 12,
      title: "test-title",
      startTime: '',
      endTime: '',
      audioElement: null
    };
  },
  methods: {
    getSound: function() {
      apiService.getSound(this.sound_id)
        .then(audioElement => {
          this.audioElement = audioElement;
        });
        console.log("getsound", this.audioElement);
        this.togglePlay();
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
              var blob = new Blob(that.recordingData, { type: 'audio/webm'});
              that.dataUrl = window.URL.createObjectURL(blob);
              console.log(that.recordingData, that.dataUrl);
            };
            this.setEndTime();
        }
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
      console.log(this.recordingData , this.startTime,this.endTime, this.sound_id);
      apiService.createSound({
        title: this.title,
        recordingData : this.recordingData,
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
//     var audioElement = document.getElementById("audio");
//     var audioElement = this.audioElement;
//      if (audioElement.paused === false) {
//          audioElement.pause();
//          console.log('Media play pause');
//      } else {
//          audioElement.play();
//          console.log('Media play ');
//      }
        console.log("togglePlay ",this.audioElement);
        (new Audio(this.audioElement)).play();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
