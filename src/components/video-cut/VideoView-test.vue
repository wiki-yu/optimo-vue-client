<template>
  <div>
    <Card title="Upload Data">
      <Row>
        <Upload type="drag" action="" :before-upload="handleBeforeUpload" accept="">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" :loading="uploadLoading" @click="handleUploadFile"></Icon>
                <p>Click or drag videos here to upload</p>
            </div>
        </Upload>
      </Row>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="md-barcode"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"></Icon>
              <span>OK</span>
            </div>
          </Progress>
        </transition>
        <!-- <Button type="primary" @click="onUploadFile" class="upload-button" :disabled="!this.file">Send  file</Button> -->
      </Row>
    </Card>
    <Card title="Video">
      <div>
        <!-- <video width="1280" height="auto" src="../../assets/videoCut/demo.mp4" id="myVideo"></video> -->
        <!-- <video id="video" width="320" height="240"></video> -->
        <div v-if="hasVideo">
            <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" ></video-player>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import excel from '@/libs/excel'
import axios from 'axios'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      playerOptions: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: '',
        }],
      }
    }
  },

  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    hasVideo() {
      return !!this.playerOptions.sources[0].src;
    }
  },

  methods: {
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
    },
    handleUploadFile () {
      this.initUpload()
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info('Uploaded file has been removed！')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'mp4' || fileExt === 'webm') {
        console.log("start to read file!!!")
        this.uploadLoading = false
        this.showRemoveFile = true
        this.file = file
        // Ready to play the video after uploading
        const source = URL.createObjectURL(this.file)
        this.playerOptions.sources[0].src = source
        console.log("test!!!!!!!!!!!!!!!1111111111")
      } else {
        this.$Notice.warning({
          title: 'Incorrect file type!',
          desc: 'File：'+ file.name+'is not the supported video type!'
        })
      }
      return false
    },

    onUploadFile () {
      const formData = new FormData()
      formData.append('file', this.file) // appending file
      // sending file to backend
      axios
        .post('http://localhost:4000/uploadVideo', formData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      this.$Message.info('File has been uploaded!')
    },

  },
  
  created() {
    this.$nextTick(() => {
      var vedio = document.getElementById("myVideo");
      var that = this;
      vedio.oncanplay = function() {
        that.Event.$emit("allTime", vedio.duration);
        console.log(vedio.duration);
      };
    });
    // 开始和暂停播放视频
    this.Event.$on("paly", data => {
      var vedio = document.getElementById("myVideo");
      if (data) {
        // vedio.play(); //播放
        this.player.play()
      } else {
        // vedio.pause(); //暂停
        this.player.pause()
      }
    });
    //设置当前时间
    this.Event.$on("currentTime", time => {
      var x = document.getElementById("myVideo");
      x.currentTime = String(this.formData(time))
    });
  },
  mounted () {

  }

}
</script>
