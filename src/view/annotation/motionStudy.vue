<template>
  <div>
    <Row style="padding-top: 10px">
      <Col span="24" style="padding-right: 5px">
      <Card>
        <div class="video-container" id="video-container">
          <h2>Motion Study</h2>
          <input id="input" v-on:change="loadFile" type="file" accept="video/*">
          <br><br>
          <div class="videoContainer">

            <video id="video" ref="video" class="video-js" controls preload="auto" poster="" data-setup="{}"
              hidden="true" autoplay="true">
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
              </p>
            </video>

            <!--canvas src="{% static "media/sample-image.png" %}"</canvas-->
            <canvas ref="canvas" id="canvas" width="200" height="200"></canvas>
            <div class="slidecontainer">
              <input id="slider" ref="slider" type="range" min="0" max="100" value="50" class="slider"
                @mousedown="sliderMouseDown" @mouseup="sliderMouseUp"/>
            </div>
            <div id="timeRange" ref="timeRange">00:00.00 / 00:00.00</div>

            <br>

            <div class="container">
              <div class="row">
                <div class="col">
                  <svg id="i-start" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                    fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    style="cursor: pointer;" @click="skipBehind">
                    <path d="M8 2 L8 16 22 2 22 30 8 16 8 30" />
                  </svg>
                </div>
                <div class="col">
                  <svg id="i-chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                    fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    style="cursor: pointer;" @click="previousFrame">
                    <path d="M20 30 L8 16 20 2" />
                  </svg>
                </div>
                <div class="col">
                  <svg id="i-pause" v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32"
                    height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" style="cursor: pointer;" @click="playPause">
                    <path d="M23 2 L23 30 M9 2 L9 30" />
                  </svg>

                  <svg id="i-play" v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                    fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    style="cursor: pointer;" @click="playPause">
                    <path id="path-play-pause" d="M10 2 L10 30 24 16 Z" />
                  </svg>

                </div>
                <div class="col">
                  <svg id="i-chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32"
                    height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" style="cursor: pointer;" @click="nextFrame">
                    <path d="M12 30 L24 16 12 2" />
                  </svg>
                </div>
                <div class="col">
                  <svg id="i-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                    fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    style="cursor: pointer;" @click="skipAhead">
                    <path d="M24 2 L24 16 10 2 10 30 24 16 24 30" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
          <div>

            <br>
            <div class="input-group mb-3">
              <input id="input-fps" ref="inputFPS" type="text" class="form-control" placeholder="Current fps = 15"
                aria-label="" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button id="update-fps" ref="updateFPS" class="btn btn-outline-secondary" type="button"
                  @click="updateFPS">Update FPS</button>
              </div>
            </div>
            <br>

            <div>
              <button class="btn btn-dark btn-sm" id="addActivity" @click="addActivity">
                Add Activity
              </button>
            </div>

            <br>

            <table class="table table-striped" id="table" ref="table">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Activity </th>
                  <th scope="col">Cycle </th>
                  <th scope="col">Classification </th>
                  <th scope="col">Element </th>
                  <th scope="col">Distance </th>
                  <th scope="col">Mod </th>
                  <th scope="col">Hand </th>
                  <th scope="col">Start </th>
                  <th scope="col">End </th>
                  <th scope="col">Mod Total </th>
                  <th scope="col">Lean Classification</th>
                  <th scope="col"> </th>
                </tr>
              </thead>
              <tbody id=table-body v-for="activity in activities" :key="activity.row" :row="activity.row">
                <tr ref="row-key" class="row-unsaved">
                  <th scope='row'>{{ activity.row }}</th>
                  <td ref="activity-key">
                    <input ref="text-input-key" class="activity" type="text" :value="`Activity ${activity.row}`">
                  </td>
                  <td ref="row-cycle-key">
                    <div class="def-number-input number-input safari_only">
                      <input class="quantity cycle" min="0" name="quantity" value="1" type="number">
                    </div>
                  </td>
                  <td ref="row-classification-key">
                    <select name="select-class" id="class-key" value="value">
                      <option value="Unit Pick-Up/Transfer">Unit Pick-Up/Transfer</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Mixture Setup/Handling">Mixture Setup/Handling</option>
                      <option value="Operation">Operation</option>
                      <option value="Operation Trash">Operation Trash</option>
                      <option value="Material Setup/Handling">Material Setup/Handling</option>
                      <option value="Tool Setup/Handling">Tool Setup/Handling</option>
                    </select>
                  </td>
                  <td ref="element-key">
                    <input ref="text-element-key" class="element" type="text" value=""
                      @change="elementEvent(`${activity.row}`, $event)">
                  </td>
                  <td ref="distance-key">
                    <input ref="text-distance-key" class="distance" type="number" value="">
                  </td>
                  <td ref="mod-key">

                  </td>
                  <td ref="row-hand-key">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="`right-hand-${activity.row}`" value="-1"
                        @click="checkBox(`${activity.row}`, 'right')" ref="right-hand-key">
                      <label class="custom-control-label" :for="`right-hand-${activity.row}`">Right Hand</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="`left-hand-${activity.row}`" value="-1"
                        @click="checkBox(`${activity.row}`, 'left')" ref="left-hand-key">
                      <label class="custom-control-label" :for="`left-hand-${activity.row}`">Left Hand</label>
                    </div>
                  </td>
                  <td ref="starttime-key">{{ activity.start }}</td>
                  <td ref="endtime-key">{{ activity.end }}</td>
                  <td ref="modtotal-key">

                  </td>
                  <td ref="lean-classification-key">
                    <select name="select-class" id="class-key" value="value">
                      <option value="VA">VA</option>
                      <option value="NVA">NVA</option>
                      <option value="RNVA">RNVA</option>
                    </select>
                  </td>
                  <td ref="button-key">
                    <button class="btn btn-dark btn-sm" @click="updateButton(`${activity.row}`, $event)">
                      Save
                    </button>
                    <br><br>
                    <button class="btn btn-dark btn-sm" @click="deleteButton(`${activity.row}`, $event)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <div>
            <button class="btn btn-dark btn-sm" id="download" @click="downloadTable">Download
              csv
            </button>
          </div>

        </div>
      </Card>
      </Col>
    </Row>

  </div>
</template>

<script src="https://vjs.zencdn.net/7.8.4/video.js"></script>
<script>
import videojs from 'video.js';

let videoWidth = 0;
let videoHeight = 0;
let isLoaded = false;

export default {
  data () {
    return {
      isPlaying: true,
      player: null,
      currentFPS: 15 ,
      isClicked: false,
      activities: [],
      activity: {
        'row': 0,
        'activity': '',
        'cycle': '',
        'bounds': '',
        'start': '',
        'end': ''
      },
      canvasMouseDown: false,
      currentX: 0,
      currentY: 0,
      index: 0
    }
  },

  computed: {
    currentSPF: {
      get: function () {
        return 1/this.currentFPS;
      }
    },
    currentTime: {
      get: function () {
        return this.$refs.video.currentTime;
      }
    }
  },

  methods: {

    sleep: function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    drawCanvas: function (v,c) {
      c.drawImage(v,0,0,videoWidth,videoHeight);
      setTimeout(this.drawCanvas,20,v,c);
    },

    roundToNearest: function (value, interval) {
      return Math.round(value/interval) * interval;
    },

    pad: function(number, length) {
      var str = '' + number;
      while (str.length < length) {
          str = '0' + str;
      }

      return str;
    },

    sliderLoop: function (slider, video, timeRange) {
      if (!this.isClicked) {
        slider.value = parseFloat(this.$refs.video.currentTime);
      }
      var time = video.currentTime;
      var minutes = Math.floor(time/60);
      var seconds = time%60;
      var currentTime = `${minutes}:${this.pad(seconds.toFixed(2),5)}`;
      time = video.duration;
      minutes = Math.floor(time/60);
      seconds = time%60;
      var endTime = `${minutes}:${this.pad(seconds.toFixed(2),5)}`;
      timeRange.innerHTML = `${currentTime} / ${endTime}`;
      setTimeout(this.sliderLoop,20,slider,video,timeRange);
    },

    updateFPS: function () {
      var fps = this.$refs.inputFPS;
      this.currentFPS = parseFloat(fps.value);
      fps.placeholder = `Current fps = ${fps.value}`;
    },

    addActivity: function () {
      var time = this.$refs.video.currentTime;

      time = this.roundToNearest(time, this.currentSPF).toFixed(4);
      this.activity['start'] = time

      var nrows = table.rows.length;
      this.activity['row'] = nrows

      this.activities.push(Object.assign({}, this.activity));
    },

    sliderMouseDown: function () {
      this.isClicked = true;
    },

    sliderMouseUp: function () {
      this.$refs.video.currentTime = this.$refs.slider.value;
      this.isClicked = false;
    },

    checkBox: function (id, hand) {
      id = parseInt(id) - 1;
      console.log(this.$refs[`${hand}-hand-key`][id])
      var currentValue = this.$refs[`${hand}-hand-key`][id].value
      this.$refs[`${hand}-hand-key`][id].value = parseInt(currentValue) * -1;
    },

    updateButton: function (id, e) {
      id = parseInt(id) - 1;
      var endTime = this.roundToNearest(this.$refs.video.currentTime, this.currentSPF).toFixed(4);
      this.activities[id].end = endTime;
    },

    deleteButton: function (id, e) {
      id = parseInt(id) - 1;
      this.activities.splice(id, 1);

      for (var i = 0; i < this.activities.length; i++) {
        this.activities[i].row = i+1;
      }
    },

    setupCanvas: function (video) {
      var canvas = this.$refs.canvas;

      var context = canvas.getContext('2d');

      let setWidthHeight = function () {
        videoWidth = parseFloat(video.videoWidth);
        videoHeight = parseFloat(video.videoHeight);
        canvas.width = Math.floor(videoWidth);
        canvas.height = Math.floor(videoHeight);
        isLoaded = true;
      }

      var timeRange = this.$refs.timeRange;
      timeRange.innerHTML = this.stringCurrentTime;

      var slider = this.$refs.slider;
      slider.step = 0.01;
      this.sliderLoop(slider, video, timeRange);

      video.onloadedmetadata = function() {
        setWidthHeight();
        slider.style.width = `${videoWidth}px`;
        slider.max = video.duration;
      }

      this.drawCanvas(video,context);
    },

    loadFile: function (event) {
      console.log('Load File...');
      console.log(this.activities.length)
      var video = this.$refs.video;
      var file = event.target.files[0];
      video.src = URL.createObjectURL(file);
      video.onload = function() {
        URL.revokeObjectURL(video.src); // free memory
      }
      var video = this.$refs.video;
      this.setupCanvas(video);
    },

    playPause: function () {
      var video = this.$refs.video;
      if (isLoaded) {
        if (this.isPlaying) {
          video.pause();
          this.isPlaying = false;
        } else {
          video.play();
          this.isPlaying = true;
        }
      }
    },

    roundToNearest: function (value, interval) {
      return Math.round(value/interval) * interval;
    },

    previousFrame: function () {
      if (isLoaded) {
        var video = this.$refs.video;
        video.currentTime = this.roundToNearest(video.currentTime, this.currentSPF);
        video.currentTime -= this.currentSPF;
      }
    },

    nextFrame: function () {
      if (isLoaded) {
        var video = this.$refs.video;
        video.currentTime = this.roundToNearest(video.currentTime, this.currentSPF);
        video.currentTime += this.currentSPF;
      }
    },

    skipAhead: function () {
      if (isLoaded) {
        var video = this.$refs.video;
        video.currentTime += 1;
      }
    },

    skipBehind: function () {
      if (isLoaded) {
        var video = this.$refs.video;
        video.currentTime -= 1;
      }
    },

    elementEvent: function (id, e) {
      var id = parseInt(id) - 1;
      console.log(id);
      var element = this.$refs[`text-element-key`][id].value;
      console.log(this.$refs['text-element-key'])
      console.log(element);

      if (element.length > 0) {

        var multiplier = 1;
        var indexOfMultiplication = element.indexOf('*');
        if (indexOfMultiplication > -1) {
          if (element.length > indexOfMultiplication+1) {
            multiplier = parseInt(element.charAt(indexOfMultiplication+1));
            element = element.substring(0, indexOfMultiplication);
          }
        }

        var matches = element.replace(/\D+/g, "");

        var mod = 0;
        for (let i = 0; i < matches.length; i++) {
          mod = mod + parseInt(matches[i]);
        }

        mod = mod * multiplier;
        var modTotal = mod * 0.129;

        console.log(mod);
        console.log(modTotal);

        this.$refs[`mod-key`][id].innerHTML = mod;
        this.$refs[`modtotal-key`][id].innerHTML = modTotal;
      }
    },

    downloadTable: function () {
      var csv = [];
      var context = document.createElement('html')
      var rows = this.$refs[`row-key`];
      var row = [];

      row.push('Activity');
      row.push('Cycle');
      row.push('Classification');
      row.push('Element');
      row.push('Distance');
      row.push('MOD');
      row.push('Left Hand');
      row.push('Right Hand');
      row.push('Start');
      row.push('End');
      row.push('MOD Total');
      row.push('Lean Classification');
      csv.push(row.join(','));

      for (var i = 0; i < rows.length; i++) {
        context.innerHTML = rows[i];
        var tds = rows[i].getElementsByTagName('td');
        var row = [];
        row.push(tds[0].getElementsByTagName('input')[0].value); // activity
        row.push(tds[1].getElementsByTagName('input')[0].value); // cycle
        row.push(tds[2].getElementsByTagName('select')[0].value); // classification
        row.push(tds[3].getElementsByTagName('input')[0].value); // element
        row.push(tds[4].getElementsByTagName('input')[0].value); // distnace
        row.push(tds[5].innerHTML); // MOD
        row.push(tds[6].getElementsByTagName('input')[0].value > 0); // left hand
        row.push(tds[6].getElementsByTagName('input')[1].value > 0); // right hand
        //row.push(tds[].innerHTML); // bounds
        row.push(tds[7].innerHTML); // start
        row.push(tds[8].innerHTML); // end
        row.push(tds[9].innerHTML); // MOD Total
        row.push(tds[10].getElementsByTagName('select')[0].value); // lean classification
        csv.push(row.join(','));
      }
      var csv_string = csv.join('\n');
      // Download it
      var filename = 'export_annotation_table_' + new Date().toLocaleDateString() + '.csv';
      var link = document.createElement('a');
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slidecontainer {
    width: 100%;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #4CAF50;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #4CAF50;
    cursor: pointer;
  }

  .activity {
    width: 75px;
  }

  .cycle {
    width: 40px;
  }

  .element {
    width: 75px;
  }

  .bounds {
    width: 150px;
  }

  .distance {
    width: 50px;
  }

  #canvas {
    cursor: crosshair;
  }

  #video-container {
    display: table;
    margin: 0 auto;
  }

  #videoContainer {
    display: table;
    margin: 0 auto;
  }

</style>
