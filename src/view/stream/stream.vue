<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow>
        <div class="add-cam" v-if="!pressAddCamBtn">
          <Button type="info" shape="circle" icon="ios-add-circle-outline" @click="getCamInput"></Button>
          <!-- <Button type="primary" icon="md-arrow-back" @click="previous_fast"></Button> -->
          <p class="item">Add an IP Camera</p>
        </div>
        <div class="cam-form" v-if="pressAddCamBtn">
          <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="Camera IP">
                    <Icon type="md-camera" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="text" v-model="formInline.password" placeholder="Port">
                    <Icon type="md-arrow-dropright-circle" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
                <Button @click="goBackAddIp" style="margin-left: 8px">Reset</Button>
            </FormItem>
          </Form>
        </div>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <div v-if="camAdded">
          <Card shadow>
            <p slot="title" class="card-title" >
              <Icon type="md-desktop" size:="20"/>
              IP Camera
            </p>
            <div>
              <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions"
              @loadeddata="onPlayerLoadeddata()"></video-player>
            </div>
          </Card>
        </div>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <div v-if="addCanvas">
          <Card shadow>
            <p slot="title" class="card-title" >
              <Icon type="md-desktop" size:="20"/>
              Frame Display
            </p>
            <div>
              <canvas id="myCanvas" ref="myCanvas" style="width: 100%" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove"> </canvas>
            </div>
          </Card>
        </div>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <div class="btnGrp" style="margin-top: 20px;" v-if="camAdded">
          <Button type="primary" size="large" icon="ios-power" @click="startStudy"></Button>
          <ButtonGroup size="large" style="margin-left: 8px">
              <Button type="primary" icon="md-arrow-back" @click="previous_fast"></Button>
              <Button type="primary" icon="ios-skip-backward" @click="previous"></Button>
              <Button type="primary" icon="md-arrow-dropright-circle" @click="getVideoPic"></Button>
              <Button type="primary" icon="ios-skip-forward" @click="next"></Button>
              <Button type="primary" icon="md-arrow-forward" @click="next_fast"></Button>
          </ButtonGroup>
          <ButtonGroup size="large" style="margin-left: 8px">
              <Button icon="ios-color-wand-outline"></Button>
              <Button icon="ios-sunny-outline"></Button>
              <Button icon="ios-crop"></Button>
              <Button icon="ios-color-filter-outline"></Button>
          </ButtonGroup>
        </div>
      </i-col>
      <video controls>
        <source src="../../assets/images/project-ori.mp4" type="video/mp4" />
      </video>
    </Row>
    
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import streamVideo from '@/assets/images/project-ori.mp4'
export default {
  components: {
    videoPlayer,
    streamVideo
  },
    data () {
      return {
        pressAddCamBtn: false,
        addCanvas: false,
        camAdded: false,
        sliderMax: 100,
        sliderStep: 1,

        formInline: {
          user: '',
          password: ''
        },

        ruleInline: {
            user: [
                { required: true, message: 'Please fill in the Camera IP', trigger: 'blur' }
            ],
            password: [
                { required: true, message: 'Please fill in the Port Number.', trigger: 'blur' },
            ]
        },

        playerOptions: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: ("@/assets/images/sample.webm")
          }],
        },
        sliderMax: 100,
        sliderStep: 1,
        url: '',
        previewImg: '',
        dataurl: '',
        showTable: true,
        form: {
          start: '',
          end: '',
          coord: '',
          label: ''
        },
        sliderVal: 0, // the slider
        sliderValEnd: 0,
        show: true,
        flag: false,
        x: 0,
        y: 0,
        x_leftUpper: 0,
        y_leftUpper: 0,
        x_lowerRight: 0,
        y_lowerRight: 0,
      }
    },

  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
  },

  methods: {
    getCamInput () {
      this.pressAddCamBtn = true
    },
    goBackAddIp () {
      this.pressAddCamBtn = false
      this.camAdded = false
      this.addCanvas = false
    },
    startStudy () {
      console.log("&&&&&&&&&&&&")
      this.addCanvas = true
      console.log(addCanvas)
    },
    handleSubmit(name) {
      console.log("********************")
      console.log(this.camAdded)
      this.camAdded = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.$Message.success('Success!');
        } else {
            this.$Message.error('Fail!');
        }
      })
    },

    getVideoPic () {
      this.addCanvas = true
      let video = document.getElementsByClassName('vjs-tech')[0]
      // let video = document.querySelector('video'); // an alternative to replace the code above
      // let canvas = document.createElement('canvas') //when use img element
      var canvas = document.getElementById('myCanvas')
      let w = video.videoWidth
      let h = video.videoHeight
      // let w = window.innerWidth
      // let h = window.innerHeight
      canvas.width = w
      canvas.height = h
      console.log(canvas)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, w, h)
      // this.previewImg = canvas.toDataURL('image/png')
      // var dataUrl = canvas.toDataURL("image/png");
      // document.createElement('img').src=dataUrl;
      // console.log(this.previewImg)
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 1
      ctx.strokeRect(this.x_leftUpper, this.y_leftUpper, this.x_lowerRight, this.y_lowerRight)
    },

    drawRect (e) {
      if (this.flag) {
        console.log('Drawing!!')
        const canvas = this.$refs.myCanvas
        let video = document.getElementsByClassName('vjs-tech')[0]
        var ctx = canvas.getContext('2d')
        let x = this.x
        let y = this.y
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let w = video.videoWidth
        let h = video.videoHeight
        canvas.width = w
        canvas.height = h
        ctx.drawImage(video, 0, 0, w, h)

        ctx.beginPath()
        ctx.strokeStyle = '#00ff00' // set up the rectangle line color
        ctx.lineWidth = 3 // set up the rectangle line width

        ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y)
        this.x_leftUpper = x
        this.y_leftUpper = y
        this.x_lowerRight = e.offsetX - x
        this.y_lowerRight = e.offsetY - y
        var coordinates = x.toString() + ' ' + y.toString() + ' ; ' + this.x_lowerRight.toString() + ' ' + this.y_lowerRight.toString() + ';' 
        this.form.coord = coordinates
      }
    },

    mousedown (e) {
      console.log('mouse down')
      this.flag = true
      this.x = e.offsetX // the X coordinate when mouse down
      this.y = e.offsetY // the Y coordinate when mouse down
    },

    mouseup (e) {
      console.log('mouse up')
      this.flag = false
    },

    mousemove (e) {
      this.drawRect(e)
    },

    previous () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime - 1 / 30)
      this.player.pause()
      this.getVideoPic()
    },

    next () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime + 1 / 30)
      this.player.pause()
      this.getVideoPic()
    },

    previous_fast () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime - 1)
      this.player.pause()
      this.getVideoPic()
    },

    next_fast () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime + 1)
      this.player.pause()
      this.getVideoPic()
    },

    on_input () {
      console.log(this.sliderVal)
      this.player.currentTime(this.sliderVal)
      this.getVideoPic () 
      this.form.start = this.sliderVal
    },

    on_input_end () {
      console.log(this.sliderVal)
      this.player.currentTime(this.sliderValEnd)
      this.getVideoPic () 
      this.form.end = this.sliderValEnd
    },

    onSubmit (evt) {
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      // const resp = await dataRequest();
      this.col1 = this.form.start
      this.col2 = this.form.end
      this.col3 = this.form.coord
      this.col4 = this.form.label
      console.log(this.col1)
      this.fillTable()
    },

    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.start = ''
      this.form.end = ''
      this.form.label = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    fillTable: function () {
      // this.items = [];
      this.items.push({ Start: this.col1, End: this.col2, Coord: this.col3, Lable: this.col4 })
      console.log(this.items)
    },

    onPlayerLoadeddata (e) {
      this.setSliderMax(this.player.duration())
    },
    
    setSliderMax (max) {
      this.sliderMax = max
    },

    setSliderStep (step) {
      if (!step) {
        return
      }
      this.sliderStep = Number(step)
    },

  },
}
</script>

<style scoped>
.add-cam {
  /* box-shadow: 2px 2px 4px 2px #ccc; */
  border-radius: 0rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  font-size: 1rem;
  width: 100%;
  margin: 100 auto;
  flex-direction: column;/*容器内项目的排列方向(默认横向排列 row)*/
  flex-wrap: nowrap;/*容器内项目换行方式*/
  justify-content: center;/*项目在主轴上的对齐方式*/
  align-items: center;/*项目在交叉轴上如何对齐*/
  align-content: center;
}

.cam-form {
  /* box-shadow: 2px 2px 4px 2px #ccc; */
  border-radius: 0rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  font-size: 1rem;
  width: 100%;
  margin: 100 auto;
  flex-direction: column;/*容器内项目的排列方向(默认横向排列 row)*/
  flex-wrap: nowrap;/*容器内项目换行方式*/
  justify-content: center;/*项目在主轴上的对齐方式*/
  align-items: center;/*项目在交叉轴上如何对齐*/
  align-content: center;
}

.item{
  /* width: 80px;
  height: 50px; */
  margin: 5px;
}

.ivu-card {
  height: 100%;
}
</style>
