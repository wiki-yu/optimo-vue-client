<template>
  <div>
    <Card title="Upload Image">
      <Row>
        <Upload action="" :before-upload="handleBeforeUpload" accept=".jpg, .png">
          <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">Upload Files</Button>
        </Upload>
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

     <div v-if="imgUploaded">
      <Row :gutter="20" style="margin-top: 10px;" type="flex">
          <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
            <Card shadow>
              <p slot="title" class="card-title" >
                <Icon type="ios-desktop-outline" :size="20" />
                CLIENT IMAGE
              </p>
              <img id="img1" style="width: 100%; height: auto;" :src="previewImg1" alt="">
            </Card>
          </i-col>
          <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
            <Card shadow>
              <p slot="title" class="card-title" >
                <Icon type="ios-easel-outline" :size="20"/>
                SERVER IMAGE
              </p>
              <img id="img2" style="width: 100%; height: auto;" :src="previewImg2" alt="">
            </Card>
          </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import excel from '@/libs/excel'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,

      tableData: [],
      tableTitle: [],
      tableLoading: false,

      imgUploaded: true,
      previewImg1: '',
      previewImg2: '',
      url: '',
      serverUrl: '',
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
      document.getElementById("img1").src = '';
      document.getElementById("img2").src = '';
      imgUploaded = false
      this.$Message.info('Uploaded file has been deleted!')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'jpg' || fileExt === 'png') {
        
        this.file = file
        this.url = URL.createObjectURL(file);
        console.log("url", this.url)
        if (this.url !== null) {
          this.showProgress = true
          this.progressPercent = 100
          this.showRemoveFile = true
          this.previewImg1 = this.url;
          document.getElementById("img2").src='';
          this.$Message.info('Read Image successfully!')
        }
     
      } else {
        this.$Notice.warning({
          title: 'Wrong file type!',
          desc: 'File：' + file.name + 'not jpg or png file'
        })
      }
      return false
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
