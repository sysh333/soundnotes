<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">

        <md-field class="md-title">
          <label>Title</label>
          <md-input v-model="title" v-on:change="changeTitle()"></md-input>
        </md-field>

      <md-button class="md-raised" v-bind:disabled="(this.dataUrl.length > 0)" v-on:click.stop.prevent="toggleRecording">
        <span v-show="!isRecording">Start recording</span>
        <span v-show="isRecording">End recording</span>
      </md-button>
      <audio id="audio" class="md-image" controls v-bind:src='dataUrl' v-if="dataUrl.length > 0" preload="auto"></audio>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          {{this.userID}}
        </md-toolbar>

        <md-list>
          <md-button v-on:click='signOut' class="md-raised">Sign out</md-button>
          <hr color="blue">
          <md-button class="md-raised" v-on:click.stop.prevent="createFirst">+New note</md-button>

          <div v-for="(sound, index) of sounds" v-bind:key="sound.id" v-on:click="reviewSoundAndNote(sound, sounds)" >
              <md-card v-bind:class="{'md-primary': sound.id == soundID }" md-with-hover >
                <md-ripple>
                  <md-card-header>
                    <div class="md-title">{{sound.title}}</div>
                    <div class="md-subhead">{{sound.start_time}}</div>
                  </md-card-header>
                  <md-card-actions>
                    <md-button v-on:click.stop="deleteSoundMoveNote(sound, index)">Delete</md-button>
                  </md-card-actions>
                </md-ripple>
              </md-card>
            </div>
        </md-list>
      </md-app-drawer>

      <md-app-content>

        <md-field md-inline v-for="item of items" v-bind:key="item.id"  >
          <md-input v-model="item.text" v-on:dblclick="getGapTime(item)" v-on:change="changeText(item)" ></md-input>
        </md-field>
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
import apiService from "../api-service";
import firebase from 'firebase/app';

export default {
  name: 'App',
  data() {
    return {
      isclicked : true,
      sounds: [],
      isRecording: false,
      audioRecorder: null,
      recordingData: [],
      dataUrl: '',
      soundID: 1,
      title: '',
      startTime: '',
      endTime: '',
      audioElement: null,
      blob: null,
      gapSeconds: 3,
      text: '',
      submit_time: '',
      items: [],
      userID: firebase.auth().currentUser.email,
      UID: firebase.auth().currentUser.uid,
    };
  },
  methods: {

    createFirst: async function(){
      this.items = [];
      this.title = '';
      this.dataUrl = '';
      this.startTime= '';
      this.endTime= '';
      this.isRecording = false ;
      await this.createSound();
      this.getSound();
    },

    changeTitle: async function() {
      console.log("title sound id=" , this.soundID);
      console.log(this.title);
      await this.putSoundInfo();
      this.getSound();
    },

    changeText: async function(item) {
      console.log("item.text=" , item.text);
      console.log(item.id);
      await this.putText(item);
      this.getNote();
    },

    reviewSoundAndNote: function(sound, sounds) {
        this.soundID = sound.id;
        this.startTime = sound.start_time;
        this.endTime = sound.end_time;
        this.title = sound.title;
        this.getNote();
        console.log("here",sound);
        console.log("here",sound.id);
        console.log("here",this.soundID);
        console.log("here sound.start_time",sound.start_time);
        console.log("here sound.start_time",sound.end_time);
        console.log("here",sounds);
        this.getSoundRaw();
    },

    getNote: function() {
      apiService.getNote({
        soundID: this.soundID,
        UID: this.UID,   
        })
        .then(items => {
          this.items = items;
        });
    },

    createSound: function() {
      console.log("UID =",this.UID);
      return apiService.createSound({
        title: this.title,
        startTime: new Date().toISOString(), //this 
        UID: this.UID,        
        }
      )
        .then(newsoundid => {
          this.soundID = newsoundid;
          return newsoundid
          console.log(newsoundid)
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
        });
    },

    getGapTime: function(item) {
      console.log("item.submit_time=",item.submit_time);
      console.log("startTime",this.startTime);
      console.log("endTime",this.endTime);
      let d2 = new Date(item.submit_time);
      let d1 = new Date(this.startTime);
      let d3 = new Date(this.endTime);
      if ((d2 - d1)>0 && (d3 - d2)>0 ){
        this.gapSeconds =  (d2 - d1)/1000;
        console.log(this.gapSeconds);
        this.goPlay();
      }else{
        console.log("submitTime", item.submit_time);
        console.log("startTime",this.startTime);
        console.log("endTime",this.endTime);
        console.log("out of time");
      }
    },

    getSoundInfo: function() {
      apiService.getSoundInfo({
        soundID: this.soundID,
        UID: this.UID,
      })
        .then( items=> {
          const { title, startTime, endTime} = items;
          // this.title = title;  //hosi
          // this.startTime = startTime;
          // this.endTime = endTime;
        });
    },

    getSound: function() {
      return apiService.getSound(this.UID)
        .then(sounds => {
          this.sounds = sounds;
          return sounds
        });
    },

    toggleRecording: async function() {
         if (!this.isRecording) {
          this.recording();
          console.log("1回目 rec")
          this.isRecording = !this.isRecording;
        }
        else {
          console.log("1回目 stop")
          await this.stoprecording();  //1 録音ストップ
          await this.sleep();
          await this.submitRecording(); //2　スタートとエンドの時間もBDへ入れる
          await this.sleep();
          await this.getSound();  //3　入れた後に、DBからとってきて　画面表示
          await this.sleep();
          await this.getSoundRaw(); // 4　なま音表示

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
      return new Promise((resolve, reject) => {
        this.audioRecorder.stop();
        this.audioRecorder.ondataavailable = function(event) {
          that.recordingData.push(event.data);
        };
        this.audioRecorder.onstop = function(event) {
          console.log('Media recorder stopped');
          that.blob = new Blob(that.recordingData, { type: 'audio/webm'});
          resolve();
        };
        this.setEndTime();
      });
    },


    getSoundRaw: function() {
      console.log("getSoundRawUID =",this.UID);
      return new Promise((resolve, reject) => {
        apiService.getSoundRaw({
          soundID: this.soundID,
          UID: this.UID,
        })
          .then(rblob => {
            console.log("rblob=", rblob);
            if (rblob.size > 0){
              this.dataUrl = window.URL.createObjectURL(rblob);
            }else{
              this.dataUrl = ""
            }
          });
          //this.getSoundInfo();
      });
    },

    setStartTime: function(){
      const startTime =  new Date()
      this.startTime = startTime.toISOString()
    },
    setEndTime: function(){
      const endTime =  new Date()
      this.endTime = endTime.toISOString()
    },

  
    sleep: function(){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("test");
          resolve();
        }, 2000);
      });
    },
    
    submitRecording: function() {
      return Promise.all([this.createSoundRaw(), this.putSoundInfo()]);
    },      

    createSoundRaw: function(evt) {
      return apiService.createSoundRaw({
        title: this.title,
        blob : this.blob,
        startTime: this.startTime,
        endTime: this.endTime},
        this.soundID
      )
        .then(newsoundid => {
          //this.items.push(newitem);
          console.log(newsoundid)
        });
    },
    
    putSoundInfo: function(){
      return apiService.putSoundInfo({
        title: this.title,
        startTime: this.startTime,
        endTime: this.endTime},
        this.soundID
      )
        .then(newsoundid => {
          return newsoundid ;
        });
    },

    putText: function(item){
      return apiService.putText({
        text: item.text,
        },
        item.id
      )
        .then(noteid => {
          return noteid ;
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
        });
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
        submit_time: new Date().toISOString()},
        this.soundID
      )
        .then(newitem => {
          this.items.push(newitem);
          this.text = '';
        })
        .catch(e => {
          console.log('error saving account. e = ', e);
          this.setMessage('There was an error adding your item');
        });
    },

    deleteSoundMoveNote:function(sound , index){
      this.reviewSoundAndNote(this.sounds[index + 1]); //端の処理がまだ
      this.deleteSound(sound);
    },

    deleteSound: function(sound) {
      apiService.deleteSound(sound)
        .then(() => {
          this.getSound();
        })
        .catch(e => {
          console.log('error deleting item. e = ', e);
        });
    },
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    },

  },
  mounted: function() {
    this.getSound().then(sounds => {
      this.soundID = sounds[0].id;
      this.title = sounds[0].title;
      this.startTime = sounds[0].start_time;
      this.endTime = sounds[0].end_time;
      this.getNote();
        // こっちは更新さ入れている。
    });
    // ここではまだsoudnidは更新されていない
  },
};
</script>


<style scoped>

  .md-layout {
    transition: .3s cubic-bezier(.25, .8, .25, 1);
  }

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
