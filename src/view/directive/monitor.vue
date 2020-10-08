<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Upload
          multiple
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/">
          <div style="padding: 20px 0">
              <Icon type="ios-add-circle" size="52" style="color: #3399ff"></Icon>
              <p>Click here to add IP Camera</p>
          </div>
        </Upload>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            REAL-TIME CAMERA
          </p>
          <!-- <div style="height: 500px"> -->
          <div>
            <WebCam 
              ref="webcam"
              :deviceId="deviceId"
              width="100%"
              height="80%"
              @cameras="onCameras"
              @camera-change="onCameraChange"
              :isFrontCam="frontCam"
              :googleKey="googleKey"
              >
          </WebCam>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <div class="btnGrp" style="margin-bottom: 20px;">
            <ButtonGroup size="large" style="justify-content: center;">
                <Button type="primary" icon="md-arrow-back" @click="previous_fast"></Button>
                <Button type="primary" icon="ios-skip-backward" @click="previous"></Button>
                <Button type="primary" icon="md-arrow-dropright-circle" @click="getVideoPic"></Button>
                <Button type="primary" icon="ios-skip-forward" @click="next"></Button>
                <Button type="primary" icon="md-arrow-forward" @click="next_fast"></Button>
            </ButtonGroup>
            <ButtonGroup size="large">
                <Button type="primary" icon="ios-color-wand-outline"></Button>
                <Button type="primary" icon="ios-sunny-outline"></Button>
                <Button type="primary" icon="ios-crop"></Button>
                <Button type="primary" icon="ios-color-filter-outline"></Button>
            </ButtonGroup>
          </div>
      </i-col>
    </Row>

  </div>
</template>

<script>
// import { WebCam } from "vue-web-cam"
import { WebCam } from 'vue-cam-vision'

export default {
  components: {
    WebCam
  },
  data () {
    return {
      captures: [],
      imgReport: [],
      frontCam: false,
      webcam: null,
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      googleKey: config.googleVisionKey
    }
  }
}
</script>

<style scoped>
.btnGrp {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100px;
  border: 3px solid gray; */
}
</style>
