<template>
  <div>
    <Row>
      <Col span="12" style="padding-right: 5px" >
        <Upload
          multiple
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click here to add IP Camera</p>
          </div>
      </Upload>
     </Col>
    </Row>
    <Row style="padding-top: 10px">
      <Col span="12" style="padding-right: 5px" >
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
