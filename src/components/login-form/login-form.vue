<template>
  <div class="reg-login">
    <div v-if="!registerOn"> 
      <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
          <Input v-model="form.userName" placeholder="Please input the user name">
            <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" placeholder="Please input the password">
            <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit" type="primary" long>Login</Button>
        </FormItem>
        <FormItem>
          <Button @click="registerSwitch" type="primary" long>Register</Button>
        </FormItem>
      </Form>
    </div> 

    <div v-if="registerOn">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="E-mail" prop="email">
            <Input v-model="formValidate.email" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="Password" prop="password">
            <Input v-model="formValidate.password" placeholder="Enter your password"></Input>
        </FormItem>
        <FormItem>
          <Button @click="registerInfoSubmit" type="primary" long>Register</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: 'User name cannot be empty', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: 'Password cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      registerOn: false, //xuyong
      form: {
        userName: 'super_admin',
        password: ''
      },
      //add by xuyong
      formValidate: {
        name: '',
        email: '',
        password: '',
      },
      ruleValidate: {
          name: [
              { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          email: [
              { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
              { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
          ],
          password: [
              { required: true, message: 'The pwd cannot be empty', trigger: 'blur' }
          ],
}
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log("Login-form.vue page!!!", this.form.userName, this.form.password)
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    },

    registerSwitch () {
      this.registerOn = true
    },

    handleSubmitTest () {
       console.log(this.form.userName)
       console.log(this.form.password)
       axios
        .post('http://localhost:3000/login', this.form)
        .then(res => {
          console.log("[START]Login: Receiving data from backend!!!!!")
          console.log(res)
          console.log("[END]Receiving completed!!!!!")
        })
        .catch(err => {
          console.log(err)
        })
    },

    registerInfoSubmit () {
       console.log(this.formValidate.name)
       console.log(this.formValidate.email)
       console.log(this.formValidate.password)
       axios
        .post('http://localhost:3000/register', this.formValidate)
        .then(res => {
          console.log("[START]Receiving data from backend!!!!!")
          console.log(res)
          console.log("[END]Receiving completed!!!!!")
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
