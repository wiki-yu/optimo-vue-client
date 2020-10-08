<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;" type="flex">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <div class="add-cam" v-if="!pressBtn">
          <!-- <Button class="item" type="info" shape="circle" icon="ios-add-circle-outline" @click="getCamInput"></Button> -->
          <Button type="primary" icon="md-arrow-back" @click="previous_fast"></Button>
          <p class="item">Add an IP Camera</p>
        </div>
        <div v-if="pressBtn">
          <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
            <FormItem
                    v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="index"
                    :label="'Item ' + item.index"
                    :prop="'items.' + index + '.value'"
                    :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                <Row>
                    <Col span="18">
                        <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
                    </Col>
                    <Col span="4" offset="1">
                        <Button @click="handleRemove(index)">Delete</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="12">
                        <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>
                <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>
            </FormItem>
          </Form>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  components: {
  },
    data () {
      return {
        pressBtn = false,
        index: 1,
        formDynamic: {
            items: [
                {
                    value: '',
                    index: 1,
                    status: 1
                }
            ]
        }
      }
    },
  methods: {
    previous_fast () {
      console.log("test~~~~~~~~~~~~~~~~~~~~~~~")
      this.pressBtn = true
    },
  },
}
</script>

<style scoped>
.add-cam {
  box-shadow: 2px 2px 4px 2px #ccc;
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
  align-content: center;/*定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用
}
.container{
  box-shadow: 2px 2px 4px 2px #ccc;
  width: 100%;
  display: flex;/*设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效*/
  flex-direction: column;/*容器内项目的排列方向(默认横向排列 row)*/
  flex-wrap: nowrap;/*容器内项目换行方式*/
  justify-content: center;/*项目在主轴上的对齐方式*/
  align-items: center;/*项目在交叉轴上如何对齐*/
  align-content: center;/*定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用*/
}
.item{
  /* width: 80px;
  height: 50px; */
  margin: 5px;
}
</style>
