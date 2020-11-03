<template>
  <div>
      <!-- window.location.href="www.baidu.com" -->
      <!-- <a href="www.google.com">Google</a> -->
      <!-- <img style="width: 100%; height: auto;" :src="jupyterNotebook" key="max-logo" /> -->
    <iframe src="http://localhost:8888/tree"  width="100%" 
    height="1000" frameborder="0" style="position:relative;" >
  </iframe>
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


