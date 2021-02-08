<template>
    <div>
         <Collapse v-model="value1">
        <Panel name="1">
            Instruction
            <p slot="content">1. The left side is the real-time video stream from the camera</p>
            <p slot="content">2. The right window displays the processed video stream after detection</p>
        </Panel>
        </Collapse>
        <Row :gutter="20" style="margin-top: 10px;" type="flex">
            <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <p slot="title" class="card-title" >
                        <Icon type="md-desktop" size:="20"/>
                        Camera Live Stream
                    </p>
                    <div class='cam-form'>
                        <img src="http://localhost:5000/motionDetection"/>
                    </div>
                </Card>
            </i-col>
            <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <p slot="title" class="card-title" >
                    <Icon type="md-desktop" size:="20"/>
                    Processed Live Stream 
                    </p>
                    <div class='cam-form'>
                        <img src="http://localhost:5000/motionDetection1"/>
                    </div>
                </Card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;" type="flex">
            <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
            <Card shadow>
                <p slot="title" class="card-title" >
                <Icon type="md-desktop" size:="20"/>
                Control Menu 
                </p>
                <div class='cam-form'> 
                    <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
                    <button type="button" class="btn btn-danger" @click="onStop">Stop Camera</button>
                    <button type="button" class="btn btn-success" @click="onStart">Start Camera</button>
                </div>
            </Card>
            </i-col>
        </Row>
    </div>


</template>

<script>
import { WebCam } from "vue-web-cam";
export default {
    name: "App",
    components: {
        "vue-web-cam": WebCam
    },
    data() {
        return {
            img: null,
            camera: null,
            deviceId: null,
            devices: [],
            value1: "1"
        };
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        }
    },
    methods: {
        onCapture() {
            this.img = this.$refs.webcam.capture();
        },
        onStarted(stream) {
            console.log("On Started Event", stream);
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        }
    }
};
</script>

<style scoped>
.cam-form {
  display: flex;
  justify-content: center;
}
</style>