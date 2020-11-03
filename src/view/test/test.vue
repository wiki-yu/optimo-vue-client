<template>
  <footer>
    <!-- Top level: menus -->
    <div class="menu">
      <div class="controlMenu">
      </div>
      <div class="videoContorl">
        <div class="timeLong">
          <em>Duration: </em>
          <span>{{videoLongTime}}</span>
        </div>
        <i class="iconfont icon-kuaijin-1" @click="prevPage"></i>
        <i class="iconfont icon-bofang" @click="play" v-if="bofangFlag"></i>
        <i class="icon-bofang1 iconfont" @click="stop" v-else></i>
        <i class="iconfont icon-kuaijin-" @click="nextpage"></i>
      </div>
    </div>
    <!-- Bottom level: display -->
    <div class="controlLine">
      <!-- 刻度 display -->
      <div class="dyc" id="pickeddeng">
        <div class="canFa" @mouseup="blueBgUp">
          <canvas id="canvas" :width="canvasWidth" height="80" @mousemove="showMoveImg"></canvas>
          <div class="signcircle" v-for="(item,index) in makeSignList" :key="index" :style="`left:${item.left}`" @click="signClick(item,index)"></div>
          <div class="blueBg" id="blueBg" ref="timeMove" @mousedown="blueBgDown" @mousemove="blueBgMove" @mouseup="blueBgUp">
            <!-- 当前视频时间 -->
            {{timeCurrentLeft}}
            <!-- 蓝色指针 -->
            <span class="turnDowm"></span> 
          </div>
        </div>
        <!-- background picture -->
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
    //   topMoveBox: null, //？可删 移动的蓝色时间盒子
      number: 5, //刻度对应秒数
    //   maxTimeLong: 360000, //除以10 即为刻度尺个刻度
      videoLongTime: "00:00:00",
      canvasWidth: 60000,
      cxt: null,
      config: {},
      timeCurrentLeft: "00:00:00:00", //当前距离左侧时间
      clickCurrentTime: null, //点击距离
      moveLeft: -40, //移动中bgleft坐标
      makeSignList: [], //标记列表
      coverBoxWidth: "0px",
      clickCurrentLeft: null, //点击打入时，距离左侧位置
      videoLong: 600,
      imgWidth: "0px", //图片的宽度
      pickeddeng: null,
      bofangFlag: true, //播放flag
      signFlag: false, //标记flag
      scrollFlag: false, //滚动标识
      target: 1400, //目标位置
      currentRunMsg: "run",
    };
  },

  created() {
    this.Event.$on("allTime", data => {
      console.log("Created() start!")
      console.log("video len: ", data); 
      this.videoLongTime = this.setTime(data);
      this.videoLong = data;
      this.maxTimeLong = Math.ceil(data) * 100;
      console.log("maxTimeLong: ", this.maxTimeLong)
      console.log("number: ", this.number)
      this.imgWidth = (this.videoLong / this.number) * 100 + "px"; //Thumbnail len matches with video length
      console.log("imgWidth: ", this.imgWidth)
      this.target = parseFloat(this.imgWidth) - 40;
      console.log("Created() over!")
    });
    this.setKeydown()
    console.log("setKeydown!")
  },

  mounted() {
    // 获取时间
    var canvas = document.getElementById("canvas");
    this.canvas = canvas;
    var cxt = canvas.getContext("2d");
    cxt.fillStyle = "#fff";
    this.cxt = cxt;
    var config = {
      height: 200,
      width: this.canvasWidth,
      // 刻度尺相关
      start: "00:00:00",
      end: "00:20:10",
      size: 300, // 刻度尺总刻度数
      x: 20, // 刻度尺x坐标位置
      y: 70, // 刻度尺y坐标位置
      w: 10, // 刻度线的间隔
      h: 10, // 刻度线基础长度
      // 事件相关
      mousedown: false
    };
    this.config = config;
    this.showCanvas();
    const timeMove = document.getElementsByClassName("blueBg")[0];
    this.topMoveBox = timeMove;
    timeMove.style.left = "-40px";

    // 设置图片盒子宽度：跟刻度指针移动有关
    this.imgWidth = (this.videoLong / this.number) * 100 + "px";
  },

  methods: {
    setKeydown() {
      document.addEventListener("keydown", this.keyboardEvent);
    },
    removerKeydown() {
      document.removeEventListener("keydown", this.keyboardEvent);
    },
    
    //重要：时间进度条移动
    blueBgDown(){
      this.stop();
      this.blueBgFlag = true;
    },

    //重要
    blueBgMove(e){
      if(!this.blueBgFlag){
        return;
      }
      var pickeddeng = document.getElementById("pickeddeng");
      var finleft = pickeddeng.scrollLeft + e.pageX - 40;
      // console.log(finleft)
      if(finleft>(parseFloat(this.imgWidth)-40) || finleft < -40){
        this.stop();
        this.$message.error("Exceed Limitation")
        return
      }
      document.getElementById("blueBg").style.left = finleft +  "px";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor(
              (this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100
            ) / 100
          ).toFixed(2)
        );
        this.Event.$emit("currentTime", this.timeCurrentLeft);
    },
    //重要
    blueBgUp(){
      this.blueBgFlag = false;
    },

    //重要：鼠标悬浮显示当前图片
    showMoveImg($event) {
      var currentTime = this.setDetailTime(
        ($event.offsetX - 20) * (this.number / 100)
      );
      this.Event.$emit("currentImg", currentTime);
      // console.log($event)
    },


    // Play
    play() {
      console.log("playing now!!!!")
      this.currentRunMsg = "run";
      this.running();
    },

    running() {
      this.bofangFlag = false;
      this.Event.$emit("play111", true); //播放视频
      const timeMove = document.getElementsByClassName("blueBg")[0];
      // var target = this.target;
      timeMove.style.left = this.target + "px";

      this.timeId = setInterval(() => {
        this.moveLeft = window.getComputedStyle(timeMove).left;
        // console.log(this.moveLeft);
        this.timeMoveNumber = parseInt(parseInt(this.moveLeft)/1600)
        if (parseFloat(this.moveLeft) / 1400 > this.countNumber) {
          this.countNumber = parseInt(parseFloat(this.moveLeft) / 1400) + 1;
        }
        if (parseFloat(this.moveLeft) + 40 > parseFloat(this.imgWidth)) {
          clearInterval(this.timeId);
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
        }
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
      }, 20);
      var pxecachS = this.number / 100; // 对应的每px所需要的秒
      var timeCount =
        (parseInt(this.target) - parseInt(this.moveLeft)) * pxecachS;
      timeMove.style.transition = `all ${timeCount}s linear`;
    },

    //pause
    stop() {
      console.log("stopping now!!!")
      this.Event.$emit("play111", false); //暂停视频
      this.bofangFlag = true;
      const timeMove = document.getElementsByClassName("blueBg")[0];
      this.moveLeft = window.getComputedStyle(timeMove).left;
      timeMove.style.left = this.moveLeft;
      timeMove.style.transition = `none`;
    },

    //previous frame
    prevPage() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      var movePX = (100 / this.number / 100) * 10;
      var currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      if (currentLeft <= -40) {
        timeMove.style.left = "-40px";
        timeMove.style.transition = "none";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
        return;
      }
      var fininal = currentLeft - movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("currentTime", this.timeCurrentLeft); //触发上一帧下一帧
    },

    // next frame
    nextpage() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      var movePX = (100 / this.number / 100) * 10;
      var currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      if (currentLeft >= parseFloat(this.imgWidth) - 40) {
        timeMove.style.left = parseFloat(this.imgWidth) - 40 + "px";
        timeMove.style.transition = "none";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
        return;
      }
      var fininal = currentLeft + movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("currentTime", this.timeCurrentLeft);
    },

    showCanvas() {
      var that = this;
      this.drawCan(this.cxt, this.config, that.number);
      // 鼠标按下时 记录状态及位置
      this.canvas.addEventListener("dblclick", function(e) {
        var scrollpd = document.getElementById("pickeddeng");
        var scrollLeft = scrollpd.scrollLeft;

        if (e.offsetX > parseInt(scrollLeft) + 1400) {
          that.$message.error("Exceed maximum, please select the left postion~");
          return;
        }
        that.stop();
        that.clickCurrentTime = e.offsetX;
        var timeMove = document.getElementById("blueBg");
        timeMove.style.left = e.offsetX - 60 + "px";

        that.timeCurrentLeft = that.setDetailTime(
          parseFloat(
            Math.floor((that.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );

        that.config.mousedown = true;
        that.config.start = [e.offsetX, e.offsetY];
        that.bofangFlag = true;
        that.Event.$emit("currentTime", that.timeCurrentLeft);
        // console.log(e.offsetX, e.offsetY)
      });
      // 鼠标放开时 重置状态
      this.canvas.addEventListener("mouseup", function(e) {
        that.config.mousedown = false;
        that.config.x += e.offsetX - that.config.start[0];
        // console.log(that.config.x);
        if (that.config.x > 10) {
          that.config.x = 20;
          that.drawCan(that.cxt, that.config, that.number);
        }
      });
      // 鼠标划出canvas时 重置状态
      this.canvas.addEventListener("mouseout", function(e) {
        that.config.mousedown = false;
      });
    },

    drawCan(cxt, config, number) {
      var size = 36000; //size/10则生成多少个刻度
      var x = config.x || 0;
      var y = config.y || 0;
      var w = config.w || 5;
      var h = config.h || 10;
      var offset = 3; // 上面数字的偏移量
      // 画之前清空画布
      cxt.clearRect(0, 0, config.width, config.height);
      // 设置画笔属性
      cxt.strokeStyle = "#fff";
      cxt.lineWidth = 1;
      cxt.font = 12;
      // console.log(size);
      for (var i = 0; i <= size; i++) {
        // 开始一条路径
        cxt.beginPath();
        // 移动到指定位置
        cxt.moveTo(x + i * w, y);
        // 满10刻度时刻度线长一些 并且在上方表明刻度
        if (i % 10 == 0 && this.number == 1) {
          // 区间为 1 s
          offset = 20;
          cxt.fillText(this.setTime(i / 10), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }

        if (i % 10 == 0 && this.number == 5) {
          // 区间为 5 s
          offset = 20;
          cxt.fillText(this.setTime(i / 2), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 10) {
          // 区间为 10 s
          offset = 20;
          // console.log(i * number, x + i * w - offset, y - h * 2.5)
          // 按照第一个参数递增
          cxt.fillText(this.setTime(i), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 30) {
          // 区间为 30 s
          offset = 20;
          cxt.fillText(this.setTime(i * 3), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 120) {
          // 区间为 120 s
          offset = 20;
          cxt.fillText(this.setTime(i * 12), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 600) {
          // 区间为 600 s
          offset = 20;
          cxt.fillText(this.setTime(i * 60), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        } else {
          // 满5刻度时的刻度线略长于1刻度的
          cxt.lineTo(x + i * w, y - (i % 5 === 0 ? 1.5 : 1) * h);
        }

        // 画出路径
        cxt.stroke();
      }
    },

    //set video length
    setTime(time) {
      var secondTime = parseInt(time); // seconds
      var minuteTime = 0; // mins
      var hourTime = 0; // hours
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime;
    },

    setDetailTime(time) {
      // console.log(time)
      var detail = null;
      if (time % 1 == 0) {
        detail = "00";
      } else {
        detail = String(parseFloat(parseInt(time * 100) / 100)).split(".")[1]; // 秒
      }
      if (String(detail).length == 1) {
        detail = String(detail + "0");
      }
      var secondTime = parseInt(time); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime >= 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime + "." + detail;
    },

    // 点击控制线控件
    onControl(index) {
      switch (index) {
        case 1: //START
        //   if (!this.mainFlag) {
        //     this.$message.error("您还没有选择视频~");
        //     return;
        //   }
          this.timeMove();
          this.clickmsg = this.clickmsg == "START" ? "END" : "START";
          break;
        case 3: //快速选段
          const moveLeft = document.getElementById("blueBg");
          this.moveLeft = window.getComputedStyle(moveLeft).left;
          console.log(this.moveLeft);
          var width = (this.quickChoseTime / this.number) * 100 + "px";
          this.$set(this.cutCoverList, this.cutCoverList.length, {
            clickFlag: true,
            text: "Section" + parseInt(parseInt(this.cutCoverList.length) + 1),
            left: parseFloat(this.moveLeft) + 40 + "px",
            width: width,
            startTime: this.getStartEndTime(parseFloat(this.moveLeft) + 40),
            endTime: this.getStartEndTime(
              parseFloat(this.moveLeft) + 40 + parseFloat(width)
            ),
            timeLong: this.getStartEndTime(parseFloat(width))
          });
          moveLeft.style.left =
            parseFloat(this.moveLeft) + parseFloat(width) + "px";
          // 设置当前时间
          this.timeCurrentLeft = this.setDetailTime(
            parseFloat(
              Math.floor(
                (this.number / 100) * (moveLeft.offsetLeft + 40) * 100
              ) / 100
            ).toFixed(2)
          );
          break;
        case 4: //自动选段
          this.dialogVisibleAuto = true;
          break;
      }
    },

    getStartEndTime(leftPX) {
      return this.setDetailTime(
        parseFloat(
          Math.floor((this.number / 100) * leftPX * 100) / 100
        ).toFixed(2)
      );
    },
  },

};
</script>

<style lang="less">
.weitiaoL,.weitiaoR{
    line-height: 0 !important;
    text-align: center;
    position: absolute;
    width: 70px;
    top: 0px;
    height: 20px;
    cursor: pointer;
    padding: 0;
    border: 0;
    z-index: 999;
    color: #666;
    >span{
        margin-left: -13px;
    }
  }
  .weitiaoL{
    
    left: 0;
  }
  .weitiaoR{
    right: 0;
  }
.autuSplice {
  
  .el-dialog {
    > div:nth-of-type(2) {
      text-align: center;
    }
    .el-radio-group {
      margin: 20px 0;
    }
  }
  .round {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: left;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    line-height: 40px;
    width: 300px;
    margin: 30px auto;
  }
}
footer {
  width: 100%;
  height: 250px;
  border-top: 2px solid #1d1e22;

  .menu {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background: #1d1e22;
    .controlMenu {
      width: 670px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      > div {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 30px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &::after {
          content: "";
          display: block;
          width: 1px;
          height: 20px;
          position: absolute;
          top: 5px;
          right: -10px;
          background-color: #ccc;
        }
        &:hover {
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
      .contorlBtn {
        margin: 0 0 0 20px;
        display: flex;
        &::after {
          width: 0;
        }
        button {
          color: #fff;
          border: 0;
        }
        button:nth-child(1) {
          background: -webkit-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(#8164d0, #3d67cd); /* 标准的语法 */
          &:hover {
            background: -webkit-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#967fd7, #6282d5); /* 标准的语法 */
          }
        }
        button:nth-child(2) {
          background: -webkit-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(#fa9710, #ff5f1e); /* 标准的语法 */
          &:hover {
            background: -webkit-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#fba83a, #ff7d45); /* 标准的语法 */
          }
        }
      }
    }
    .videoContorl {
      display: flex;
      color: #8c97b1;
      align-items: center;
      .timeLong {
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-right: 20px;
        em {
          font-style: normal;
          font-size: 16px;
          line-height: 30px;
          white-space: nowrap;
        }
        span {
          width: 100px;
          font-size: 18px;
          line-height: 30px;
          border: 1px solid #515257;
          border-radius: 10px;
          text-align: center;
        }
      }
      i {
        font-size: 25px;
        cursor: pointer;
        margin: 0 15px;
        &:hover {
          color: #f25915;
        }
      }
    }
    .rule {
      width: 390px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      .el-slider {
        width: 150px;
      }
      > span {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 22px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &:hover {
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .controlLine {
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
    background: #1d1e22;
    .signshowImg {
      width: 150px;
      height: 100px;
      background: #fff;
      position: absolute;
      top: -121px;
      z-index: 30;
      text-align: center;
      padding: 10px;
      transform: translateX(-50%);
      .text {
        font-size: 13px;
        color: #666;
      }
      > img {
        height: 80px;
        width: 100%;
      }
      .signDetail {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }
      .signClose {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 26px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }
    }
    .dyc {
      position: relative;
      overflow: auto;
      &::-webkit-scrollbar {
        height: 10px;
      }
      /*滚动条滑块*/
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
        width: 30px;
      }
      /*滚动条轨道*/
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        border-radius: 10px;
        background: #ccc;
      }
      .canFa {
        position: relative;
        .signcircle {
          width: 8px;
          height: 8px;
          background: orange;
          border-radius: 50%;
          position: absolute;
          top: 60px;
          cursor: pointer;
        }
        // overflow: hidden;
      }
      .imgbackground {
        left: 20px;
        height: 100px;
        background-repeat: repeat !important;
        background-size: contain !important;
        background: url("../../assets/videoCut/demo.jpg");
        position: relative;
        // .coverlistActive {
        //   // border-left: 3px solid #
        // }
        .coverlist {
          background: rgba(23, 149, 255, 0.3);
          position: absolute;
          top: 0;
          height: 100px;
          display: flex;
          flex-wrap: nowrap;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid;
          &:hover {
            border: 1px solid #ccc;
          }
          .dragLeft {
            width: 16px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: absolute;
            left: 0px;
            cursor: e-resize;
            text-align: center;
          }
          .dragRight {
            text-align: center;
            width: 16px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: absolute;
            right: 0px;
            cursor: w-resize;
          }

          > div {
            > div {
              font-size: 13px;
              color: #fff;
              cursor: pointer;
              width: 60px;
              margin: auto;
            }
            width: 100%;
            height: 100%;
            margin: 0 auto 0;
            padding:20px;
            box-sizing: border-box;
            text-align: center;
            // line-height: 50px;
            // display: flex;
            // flex-wrap: nowrap;
            // justify-content: center;
            overflow: hidden;
            span {
              color: #fff;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .blueBg {
      position: absolute;
      // height: 40px;
      cursor:move;
      box-sizing: content-box;
      text-align: center;
      line-height: 30px;
      width: 104.53px;
      padding: 0px 10px;
      border-radius: 5px;
      top: 0;
      left: -32px;
      // background: rgba(23, 149, 255);
      color: #fff;
    }
    .turnDowm {
      position: absolute;
      width: 0;
      height: 0;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-style: solid;
      border-width: 10px 5px 0 5px;
      border-color: #007bff transparent transparent transparent;
    }
    .block {
      width: 150px;
      margin: auto;
    }
  }
}
</style>

