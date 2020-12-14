<template>
  <div>
    <Card title="Insturction">
      <el-steps :active="1">
        <el-step title="Step 1" icon="el-icon-upload"></el-step>
        <el-step title="Step 2" icon="el-icon-edit"></el-step>
        <el-step title="Step 3" icon="el-icon-picture"></el-step>
      </el-steps>
    </Card>

    <Card title="Upload Video" style="margin-top: 10px;">
      <Row>
        <Upload action="" :before-upload="handleBeforeUpload" accept=".avi, .mp4">
          <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">Upload Files</Button>
        </Upload>
         <Button type="primary" @click="onUploadFile" class="upload-button" :disabled="!this.file">Send file</Button>
      </Row>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="ios-stats"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"></Icon>
              <span>OK!</span>
            </div>
          </Progress>
        </transition>
      </Row>
    </Card>

      <!-- <button v-if="!detectVideoLoading" @click="onUploadVideo" class="upload-button" :disabled="!this.selectedVideo">DETECT</button> -->
      <!-- <Button v-else type="primary" loading>Video Processing...</Button> -->
    <div v-if="videoUploaded">
      <Row :gutter="20" style="margin-top: 10px;" type="flex">
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <p slot="title" class="card-title" >
              <Icon type="md-desktop" size:="20"/>
              Input Video
            </p>
            <div v-if="hasVideo">
              <video-player class="vjs-custom-skin" id= "myVideo1" ref="videoPlayer1" :options="playerOptions1"></video-player>
            </div>
          </Card>
        </i-col>
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <p slot="title" class="card-title" >
              <Icon type="md-desktop" size:="20"/>
              Output Video
            </p>
            <div v-if="hasVideo">
              <video-player class="vjs-custom-skin" id= "myVideo2" ref="videoPlayer2" :options="playerOptions2"></video-player>
            </div>
          </Card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import excel from '@/libs/excel'
import axios from 'axios'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
   components: {
    videoPlayer,
  },
  data() {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,

      tableData: [],
      tableTitle: [],
      tableLoading: false,

      // imgUploaded: true,
      previewImg1: '',
      previewImg2: '',
      url: '',
      serverUrl: '',

      selectedVideo: "",
      videoUploaded: false,
  
      detectVideoLoading: false,


      playerOptions1: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: '',
        }],
      },
      playerOptions2: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: '',
        }],
      }
    };
  },
  computed: {
    // player () {
    //   return this.$refs.videoPlayer.player
    // },
    hasVideo() {
      return !!this.playerOptions1.sources[0].src;
    }
  },

  methods: {
    initUpload () {
      this.file = null
      this.showProgress = false
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile () {
      this.initUpload()
    },
    handleRemove () {
      this.initUpload()
      this.$refs.videoPlayer1.src = '',
      this.$refs.videoPlayer2.src = '',
      // imgUploaded = false
      this.$Message.info('Uploaded file has been deleted!')
    },

    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'mp4' || fileExt === 'avi') {
        this.file = file
        this.url = URL.createObjectURL(file);
        console.log("url", this.url)
        if (this.url !== null) {
          this.showProgress = true
          this.progressPercent = 100
          this.showRemoveFile = true
          // this.previewImg1 = this.url;
          // document.getElementById("myVideo2").src='';
          this.$Message.info('Read Video successfully!')
        }
     
      } else {
        this.$Notice.warning({
          title: 'Wrong file type!',
          desc: 'File：' + file.name + 'not jpg or png file'
        })
      }
      return false
    },

    onUploadFile () {
      const formData = new FormData()
      formData.append('file', this.file) // appending file
      // Ready to play the video after uploading
      var video = document.getElementById('myVideo1');
      const source = URL.createObjectURL(this.file)
      this.playerOptions1.sources[0].src = source
      this.videoUploaded = true
      axios
        .post('http://localhost:4000/uploadVideo', formData)
        .then(res => {
          console.log("res.status:..........", res.status)
          if (res.status === 200){
            this.$Message.info('File has been uploaded!')
          } else {
            this.$Message.info('File failed to upload!')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

  },
  created () {

  },
  mounted () {

  }
}
</script>
