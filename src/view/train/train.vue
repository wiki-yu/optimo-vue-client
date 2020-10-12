<template>
  <div>
      <!-- window.location.href="www.baidu.com" -->
      <!-- <a href="www.google.com">Google</a> -->
      <img style="width: 100%; height: auto;" :src="jupyterNotebook" key="max-logo" />
  </div>
</template>

<script>
import jupyterNotebook from '@/assets/images/jupyter.png'
export default {
        data(){
            return {
                files:null,//上传的文件
                fileName:'',
                jupyterNotebook,
            }
        },
        methods:{
                
        }
    }
</script>


