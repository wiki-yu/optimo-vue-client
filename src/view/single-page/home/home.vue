<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="Image Annotation Amount"/>
        </Card>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="Saved Video Analysis"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import axios from 'axios'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: 'User Number', icon: 'md-person-add', count: 21, color: '#2d8cf0' },
        { title: 'Annotations', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: 'Revenue', icon: 'md-help-circle', count: 14200, color: '#ff9900' },
        { title: 'Videos', icon: 'md-share', count: 57, color: '#ed3f14' },
      ],
      pieData: [
        { value: 335, name: 'Motion1' },
        { value: 310, name: 'Motion2' },
        { value: 234, name: 'Motion3' },
        { value: 135, name: 'Motion4' },
        { value: 1548, name: 'Motion5' }
      ],
      barData: {
        Mon: 1325,
        Tue: 3425,
        Wed: 2621,
        Thu: 1240,
        Fri: 2443,
        Sat: 122,
        Sun: 134
      },
      form: {
        userName: '',
        password: ''
      },
    }
  },

  methods:{
    // handle() {
    //   console.log('haha');
    //   this.barData.Mon = 3000;
    // }
  },

  mounted () {
    const sendPostRequest = async () => {
      this.form.userName = "test1"
      this.form.password = "test1"
      console.log("test11111")
      try {
          const resp = await axios.post('http://localhost:3000/fetchData', this.form)
          console.log("previous", this.barData.Mon)
          console.log(JSON.stringify(resp.data));
          this.barData.Mon = resp.data.user.is_admin
          console.log("after", this.barData.Mon)
      } catch (err) {
          console.error(err);
      }
    };
   sendPostRequest();
   console.log('haha')
  },

  created () {

  },

}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
