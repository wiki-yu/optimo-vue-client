<template>
  <div>
      <!-- <img :src="'../assets/images/jupyter.png'"> -->
      <!-- <img style="width: 100%; height: auto;" :src="@/assets/images/jupyter.png" alt="">  -->
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
            uploadSucess(response) {//上传成功钩子
                if(response.msg == '上传成功') {
                    this.$Message.success('导入成功')
                }else {
                    this.$Message.error(response.msg)
                }
                this.files=null
                this.fileName = ''
            },
            uploadError() {//失败
                this.$Message.error('导入失败')
            },
            uploadBefore(file) {//上传前钩子
                this.files=file
                this.fileName = file.name
                return false
                // return new Promise((resolve,reject) => {
                //     this.$Modal.confirm({
                //         title:'确认窗口',
                //         content:`<p>目标环境：${this.targetEnv}</p><p>文件名：${file.name}</p>`,
                //         onOk:() => {
                //             resolve()
                //         },
                //         onCancel:() => {
                //             reject()
                //         }
                //     })
                // })
            },
importExcel(url){
                this.modalImport = true;
                this.$refs.upload.clearFiles();//清除上次上传记录
                this.file = [];
                this.uploadFile = [];
            },
            uploadSuccess(response, file, fileList){
                this.$Message.info(response.msg);
                // this.modalImport = false
                debugger
                this.init(0, 20);
            },
            clear(){
                this.$refs.upload.clearFiles();//清除上次上传记录
            },
            handleUpload (file) { // 上传文件前的事件钩子
                
                // 选择文件后 这里判断文件类型 保存文件 自定义一个keyid 值 方便后面删除操作
                let keyID = Math.random().toString().substr(2);
                file['keyID'] = keyID;
                // 保存文件到总展示文件数据里
                this.file.push(file);
                // 保存文件到需要上传的文件数组里
                this.uploadFile.push(file)
                // 返回 falsa 停止自动上传 我们需要手动上传
                //如果需要手动上传文件，需要把这里注释放开并放开上面代码块中的被注释的两个按钮，就可以进行手动上传了
                //return false
            },
            upload () { // 上传文件
                for (let i = 0; i < this.uploadFile.length; i++) {
                    let item = this.file[i]
                    this.$refs.upload.post(item);
                }
                
            },
        }
    }
</script>