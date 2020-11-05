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
    <Card title="Video" style="margin-top: 10px;">
      <div>
        <div class="playVideo">
          <video src="../../assets/videoCut/demo.mp4" id="myVideo"></video>
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
      showVideo: false,
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      playerOptions: {
        autoplay: false,
        controls: false,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: '',
        }],
      }
    }
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
        vedio.play(); //播放
      } else {
        vedio.pause(); //暂停
      }
    });
    //设置当前时间
    this.Event.$on("currentTime", time => {
      var x = document.getElementById("myVideo");
      x.currentTime = String(this.formData(time))
    });
    // 分段播放
    this.Event.$on("subSectionPlay", value => {
      var x = document.getElementById("myVideo");
      x.currentTime = String(this.formData(value.startTime))
    });

  },
  mounted(){
    // this.$store.dispatch('changeVideo',d);
  },
  methods: {
    formData(time){
      var h = time.split(":")[0];
      var m = time.split(":")[1];
      var s = time.split(":")[2];
      var ms = time.split(".")[1];
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + "." + ms;
    }
  }
};
</script>

<style lang="less">
.playVideo{
    display: flex;
    .quickey{
        width: 500px;
        height: auto;
    }
.playVedio {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.playVedio video {
  height: 100%;
  width: auto;
}
}

</style>


