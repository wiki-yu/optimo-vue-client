<template>
  <div>
    <Row style="padding-top: 5px">
      <Col span="24" style="padding-right: 5px" >
        <Card>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
             Upload Video
          </p>
          <div style="height: 200px">
            <div class="file-upload">
            <input type="file" @change="onFileChange" />
            <div v-if="progress" class="progess-bar" :style="{'width': progress}">{{progress}}</div>
            <button @click="onUploadFile" class="upload-button" :disabled="!this.selectedFile">Upload file</button>
            </div>
        </div>
        </Card>
      </Col>
    </Row>

    <Row style="padding-top: 5px">
      <Col span="24" style="padding-right: 5px" >
        <Card>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
             Video
          </p>
          <div v-if="selectedFile !== ''" style="height: 600px">
            <video-player  class="video-player-box"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              customEventName="customstatechangedeventname"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied">
          </video-player>
        </div>
        </Card>
      </Col>
    </Row>
    <Row>
      <!-- <Slider v-model="value" range /> -->
      <button @click="previous">Previous</button>
      <button @click="next">Next</button>
    </Row>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import axios from "axios";

export default {
  components: {
    videoPlayer,
  },
  data () {
    let self = this;
    return {
       selectedFile: "",
       progress: 0,
       value: 0,
      //  playerOptions: {
      //     // videojs options
      //     muted: true,
      //     language: 'en',
      //     playbackRates: [0.7, 1.0, 1.5, 2.0],
      //     sources: [{
      //       type: "video/mp4",
      //       // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
      //       // src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-webm-file.webm"
      //       // src: "../../../assets/images/sample-webm-file.webm"
      //       src: this.
      //     }],
      //     poster: "/static/images/author.jpg",
      //   }
    }
  },
  mounted () {
    console.log('this is current player instance object')
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    playerOptions() {
      return {
          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
            // src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-webm-file.webm"
            // src: "../../../assets/images/sample-webm-file.webm"
            src: this.selectedFile
          }],
          poster: "/static/images/author.jpg",
        }
    }
  },
  methods: {
    // onPlayerEnded(player) {
    //   console.log('player end!', player)
    // },
    // onPlayerWaiting(player) {
    //   console.log('player wait!', player)
    // },
    // onPlayerPlaying(player) {
    //   console.log('player playing!', player)
    // },
    // onPlayerCanplay(player) {
    //   console.log('player canplay!', player)
    // },
    // onPlayerCanplaythrough(player) {
    //   console.log('player can play through!', player)
    // },
    // onPlayerLoadeddata(player) {
    //   console.log('player loadeddata!', player)
    // },

    // listen event
    onPlayerPlay(player) {
      console.log('player play!', player)
    },
    onPlayerPause(player) {
      console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    },
    previous() {
      const currentTime = this.player.currentTime();
      this.player.currentTime(currentTime - 1);
    },
    next() {
      const currentTime = this.player.currentTime();
      this.player.currentTime(currentTime + 1);
    },

    //yuxuyong add fileupload methods
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      console.log(selectedFile)
      this.progress = 0;
      const source = URL.createObjectURL(selectedFile);
      console.log(source);
      this.selectedFile = source;
      // this.playerOptions.sources[0].src = source;
    },
    onPlayerTimeupdate(e) {
      const currentTime = this.player.currentTime();
      console.log(currentTime);
      // this.value = parseInt(currentTime, 10);
    },
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile); // appending file

      // sending file to backend
      axios
        .post("http://localhost:4500/upload", formData, {
          onUploadProgress: ProgressEvent => {
            let progress =
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              "%";
            this.progress = progress;
          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}

input,
div,
button {
  margin-top: 2rem;
}

.progess-bar {
  height: 1rem;
  width: 0%;
  background-color: #151618;
  color: rgb(109, 99, 99);
  padding: 2px;
  font-weight: bold;
}

.upload-button {
  width: 7rem;
  padding: 0.5rem;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}

.upload-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}
</style>

