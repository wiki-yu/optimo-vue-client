<template>
  <div> 
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Video Upload
          </p>
          <div style="height: 150px">
           <div class="file-upload">
              <input type="file" @change="onFileChange" />
              <div v-if="progress" class="progess-bar" :style="{'width': progress}">{{progress}}</div>
              <button @click="onUploadFile" class="upload-button" :disabled="!this.selectedFile">Upload file</button>
            </div>
          </div>
        </Card>
      </i-col>
            <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Video Info
          </p>
          <div>
            <Form :model="formTop" label-position="top">
                <FormItem label="Title">
                    <Input v-model="formTop.input1"></Input>
                </FormItem>
                <FormItem label="Title name">
                    <Input v-model="formTop.input2"></Input>
                </FormItem>
                <FormItem label="Aligned title">
                    <Input v-model="formTop.input3"></Input>
                </FormItem>
            </Form>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Video Play
          </p>
          <div style="margin-top: 10px;">
             <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions"></video-player>
          </div>
          <div style="text-align:center">
            <b-button-toolbar key-nav aria-label="Toolbar with button groups">
              <b-button-group class="mx-1">
                <b-button @click="previous_fast">&laquo;</b-button>
                <b-button @click="previous">&lsaquo;</b-button>
              </b-button-group>
                <b-button-group class="mx-1">
                  <b-button  @click="getVideoPic"> Snap </b-button>
                </b-button-group>
              <b-button-group class="mx-1">
                <b-button @click="next">&rsaquo;</b-button>
                <b-button @click="next_fast">&raquo;</b-button>
              </b-button-group>
            </b-button-toolbar>
          </div>
        </Card>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Frame Display
          </p>
          <div>
            <img style="width: 100%; height: auto;" :src="previewImg" alt="">
          </div>
        </Card>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Annotation
          </p>
          <div>
            <!-- <form>
              <label for="fname">Total Time:</label><br>
              <input type="text" id="fname" name="fname"><br>
              <label for="lname">Current Time:</label><br>
              <input type="text" id="lname" name="lname">
            </form>
            <button @click="related"> Related </button> -->
          <!-- <div>
            <Slider v-model="value" range />
          </div> -->
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <b-form-group id="input-group-1" label="Start Time:" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="form.start"
                  required
                  placeholder="Enter start time"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2" label="End Time:" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="form.end"
                  required
                  placeholder="Enter end time"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-3" label="Label:" label-for="input-3">
                <b-form-input
                  id="input-3"
                  v-model="form.label"
                  required
                  placeholder="Enter the label"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Add</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </div>
        </Card>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title" class="card-title" >
            <Icon type="android-wifi"></Icon>
            Annotation Table
          </p>
          <div>
            <b-table v-if="showTable" striped hover :items="items" sticky-header="100%"></b-table>
          </div>
          <Button icon="md-download" :loading="exportLoading" @click="exportExcel">Export File</Button>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
// import { dataRequest } from '../request/dataRequest';
import axios from "axios";
import excel from '@/libs/excel'
export default {
  components: {
    videoPlayer,
  },

  data () {
    return {
      formTop: {
        input1: '',
        input2: '',
        input3: ''
      },
      url: "",
      previewImg: "",
      dataurl: "",
      selectedFile: "",
      progress: 0,
      items: [],
      col1: [],
      col2: [],
      col3: [],
      showTable: true,
      form: {
      start: '',
      end: '',
      label: '',

      },
      show: true,
      playerOptions: {
        autoplay: false,
        controls: true,
        sources:[{
            type: "video/mp4",
            // src: ""
            src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-webm-file.webm"
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
            // src: this.selectedFile
        }]
      },
    }
  },

  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },

  methods: {
    handleApply () {
        this.playerOptions.sources[0].src = this.url
    },

    related() {
      // var text = document.getElementById("fname").value;
      console.log(this.player.currentTime())
      document.getElementById("fname").value = this.player.duration();
      document.getElementById("lname").value = this.player.currentTime();
    },

    // onFileChange(e) {
    //   const selectedFile = e.target.files[0]; // accessing file //what does e mean here?
    //   this.selectedFile = selectedFile;
    //   this.progress = 0;
    //   const source = URL.createObjectURL(selectedFile);
    //   this.selectedFile = source;
    //   this.playerOptions.sources[0].src = source; 
    // },

    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      this.progress = 0;
    },

    //without this function, the uploaded video will not show up 
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile); // appending file
      // sending file to backend
      axios
        .post("http://localhost:4500/upload", formData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
        alert("Uploaded")
      
      // Ready to play the video after uploading
      const source = URL.createObjectURL(this.selectedFile);
      this.selectedFile = source;
      this.playerOptions.sources[0].src = source; 
    },
    getVideoPic() {
      let video = document.getElementsByClassName('vjs-tech')[0]
      // let video = document.querySelector('video');
      console.log(video)
      let canvas = document.createElement('canvas')
      // let w = window.innerWidth

      // let h = window.innerWidth / 16 * 9
      let w = video.videoWidth;
      let h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      console.log(canvas)
      const ctx = canvas.getContext('2d')

      ctx.drawImage(video, 0, 0, w, h)
      ctx.drawImage(video, 0, 0, w, h);
      this.previewImg = canvas.toDataURL('image/png')
      // var dataUrl = canvas.toDataURL("image/png");
      // document.createElement('img').src=dataUrl;
      console.log(this.previewImg)
    },
    previous () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime - 1/30)
      this.player.pause();
      this.getVideoPic();
    },

    next () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime + 1/30)
      this.player.pause();
      this.getVideoPic();
    },

    previous_fast () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime - 1)
      this.player.pause();
      this.getVideoPic();
    },

    next_fast () {
      const currentTime = this.player.currentTime()
      this.player.currentTime(currentTime + 1)
      this.player.pause();
      this.getVideoPic();
    },

    onSubmit(evt) {
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      // const resp = await dataRequest();
      this.col1 = this.form.start;
      this.col2 = this.form.end;
      this.col3 = this.form.label;
      console.log(this.col1)
      this.fillTable();
    },

    onReset(evt) {
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

    fillTable: function() {
      // this.items = [];
      this.items.push({Start: this.col1, End: this.col2, Label: this.col3});
      console.log("111111111111")
      console.log(this.items)
      alert(JSON.stringify(this.items))
      console.log("22222222222222")
    },

    exportExcel () {
      let tableData = [];
      tableData = JSON.stringify(this.items)
      // if (this.tableData) {
      if(1) {
        this.exportLoading = true
        const params = {
          title: ['start', 'end', 'label'],
          key: ['Start', 'End', 'Label'],
          data: tableData,
          autoWidth: true,
          filename: 'labelling'
        }
        console.log("***************")
        console.log(tableData)
        console.log("***************")
        excel.export_json_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('Table cannot be empty')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.file-upload {
  box-shadow: 2px 2px 4px 2px #ccc;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  margin: 0 auto;
}

.col {
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

/* input, */
/* div, */
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

.control-label {
    display: flex;
}

</style>