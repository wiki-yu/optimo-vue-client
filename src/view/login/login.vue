<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" 
            title="Welcome to Login" 
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">
            <Alert type="error"
                v-show="flag"
                show-icon>
              {{message}}
            </Alert>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { getmd5 } from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      flag: false,
      message: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),

    handleSubmit ({ userName, password }) {
      console.log("Login.vue page!!!",  userName, password)
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    }

    //  handleSubmit ({ userName, password }) {
    //   console.log("get started!!!!!!!!!!!!")
    //   console.log(userName)
    //   // password = getmd5(password)
    //   console.log(password)
    //   this.handleLogin({ userName, password }).then(res => {
    //     console.log(res)
    //     const data = res
    //     this.message = data.message// 获取后始返回消息显示
    //     if (data.check_login) { // 判断是否登录成功
    //       this.getUserInfo().then(res => {
    //         this.$router.push({
    //           name: this.$config.homeName
    //         })
    //       })
    //     } else {
    //       this.flag = true // 失败显示返回的消息
    //     }
    //   })
    // }

  }
}
</script>

<style>

</style>
