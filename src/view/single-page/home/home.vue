<template>
  <div>
    <Row style="padding-top: 10px">
      <Col span="24" style="padding-right: 5px" >
        <Card>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
             Video
          </p>
            <div style="height: 600px">
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

    <!-- <Row style="padding-top: 10px">
      <Col span="24" style="padding-right: 5px" >
        <Card>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            REAL-TIME CAMERA
          </p>
          <div style="height: 500px">
            <WebCam
              ref="webcam"
              :deviceId="deviceId"
              width="auto"
              height="100%"
              @cameras="onCameras"
              @camera-change="onCameraChange"
              :isFrontCam="frontCam"
              :googleKey="googleKey"
              >
          </WebCam>
          </div>
        </Card>
      </Col>
    </Row> -->


  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import excel from '@/libs/excel'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
// import { WebCam } from "vue-web-cam"
import { WebCam } from 'vue-cam-vision'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    videoPlayer,
    WebCam
  },
  data () {
    return {
      // captures: [],
      // imgReport: [],
      // frontCam: false,
      // webcam: null,
      // img: null,
      // camera: null,
      // deviceId: null,
      // devices: [],
      // googleKey: config.googleVisionKey,
       playerOptions: {
          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
            // src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-webm-file.webm"
            // src: "../../../assets/images/sample-webm-file.webm"
          }],
          poster: "/static/images/author.jpg",
        }
    }
  },
  mounted () {
    console.log('this is current player instance object', this.player)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
