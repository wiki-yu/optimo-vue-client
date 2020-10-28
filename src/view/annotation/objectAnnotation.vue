<template>
  <div>
    <Row style="padding-top: 10px">
      <Col span="24" style="padding-right: 5px">
      <Card>
        <div class="video-container" id="video-container">
          <h2>Object Detection</h2>
          <input id="input" v-on:change="loadFile" type="file" accept="video/*">
          <br><br>

          <div id="videoContainer">
            <video id="video" ref="video" class="video-js" controls preload="auto" poster="" data-setup="{}"
              hidden="true" autoplay="true">
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
              </p>
            </video>

            <!--canvas src="{% static "media/sample-image.png" %}"</canvas-->
            <canvas ref="canvas" id="canvas" width="200" height="200" @mousemove="canvasHover" @mousedown="canvasDown"
              @mouseup="canvasUp"></canvas>
            <div class="slidecontainer">
              <input id="slider" ref="slider" type="range" min="0" max="100" value="50" class="slider"
                @mousedown="sliderMouseDown" @mouseup="sliderMouseUp">
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

            <table class="table table-striped" id="table" ref="table">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Object </th>
                  <th scope="col">Bounds </th>
                  <th scope="col">Start </th>
                  <th scope="col">End </th>
                  <th scope="col"> </th>
                </tr>
              </thead>
              <tbody id=table-body v-for="boundingBox in boundingBoxes" :key="boundingBox.row" :row="boundingBox.row">
                <tr ref="row-key" class="row-unsaved">
                  <th scope='row'>{{ boundingBox.row }}</th>
                  <td ref="activity-key">
                    <input ref="text-input-key" class="activity" type="text" :value="`Object ${boundingBox.row}`">
                  </td>
                  <td class="bounds">
                    ({{ boundingBox.x1 }},{{ boundingBox.y1 }}),
                    ({{ parseFloat(boundingBox.x2)+parseFloat(boundingBox.x1) }},{{ parseFloat(boundingBox.y2)+parseFloat(boundingBox.y1) }})
                  </td>
                  <td ref="starttime-key">{{ boundingBox.start }}</td>
                  <td ref="endtime-key">{{ boundingBox.end }}</td>
                  <td ref="button-key">
                    <button class="btn btn-dark btn-sm" @click="updateButton(`${boundingBox.row}`, $event)">
                      Save
                    </button>
                    <br><br>
                    <button class="btn btn-dark btn-sm" @click="deleteButton(`${boundingBox.row}`, $event)">
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
      boundingBoxes: [],
      bounds: {
        'row': 0,
        'activity': '',
        'cycle': '',
        'bounds': '',
        'start': '',
        'end': '',
        'x1': 0,
        'y1': 0,
        'x2': 0,
        'y2': 0
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
      if (this.canvasMouseDown) {
        c.beginPath();
        c.lineWidth = "4";
        c.strokeStyle = "red";
        c.rect(parseFloat(this.bounds['x1']),
               parseFloat(this.bounds['y1']),
               parseFloat(this.bounds['x2']),
               parseFloat(this.bounds['y2']));
        c.stroke();
      }
      if (this.boundingBoxes.length > 0) {
        var currentTime = this.$refs.video.currentTime;
        var duration = this.$refs.video.duration;
        for (var i = 0; i < this.boundingBoxes.length; i++) {
            i = parseInt(i);
            var endTime = this.boundingBoxes[i].end;
            if (endTime == '') {
              endTime = duration;
            }
            if (Number(this.boundingBoxes[i].start) <= Number(currentTime) &&
                Number(endTime) > Number(currentTime)) {
                  var canvasBounds = parseFloat(this.$refs.canvas.getBoundingClientRect());
                  var bwidth = parseFloat(this.boundingBoxes[i].x2-this.boundingBoxes[i].x1);
                  var bheight = parseFloat(this.boundingBoxes[i].y2-this.boundingBoxes[i].y1);
                  var scaleX = parseFloat(c.width / bwidth),
                      scaleY = parseFloat(c.height / bheight);

                  c.beginPath();
                  c.lineWidth = "4";
                  c.strokeStyle = "red";
                  c.rect(parseFloat(this.boundingBoxes[i].x1),
                         parseFloat(this.boundingBoxes[i].y1),
                         parseFloat(this.boundingBoxes[i].x2),
                         parseFloat(this.boundingBoxes[i].y2));
                  c.stroke();
                }
          }
        }
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

    sliderMouseDown: function () {
      this.isClicked = true;
    },

    sliderMouseUp: function () {
      this.$refs.video.currentTime = this.$refs.slider.value;
      this.isClicked = false;
    },

    getMousePosition: function (e) {
      var canvasBounds = this.$refs.canvas.getBoundingClientRect();
      var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

      return {
        x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
      }
    },

    evaluateBounds: function (e) {
      if (this.canvasMouseDown) {
        var pos = this.getMousePosition(e);
        this.currentX = pos.x;
        this.currentY = pos.y;
        //setTimeout(this.updateBounds,50,e);
      }
    },

    updateBounds: function () {
      this.bounds['x2'] = this.currentX - this.bounds['x1'];
      this.bounds['y2'] = this.currentY - this.bounds['y1'];
      if (this.canvasMouseDown) {
        setTimeout(this.updateBounds, 10)
      }
    },

    canvasHover: function (e) {
      this.evaluateBounds(e);
    },

    canvasDown: function (e) {
      this.canvasMouseDown = true;
      this.evaluateBounds(e);
      this.bounds['x1'] = this.currentX;
      this.bounds['y1'] = this.currentY;
      this.evaluateBounds(e);
      this.updateBounds();
    },

    canvasUp: async function (e) {
      this.canvasMouseDown = false;
      this.bounds['x2'] = (this.currentX - this.bounds['x1']).toFixed(4);
      this.bounds['y2'] = (this.currentY - this.bounds['y1']).toFixed(4);
      this.bounds['x1'] = this.bounds['x1'].toFixed(4);
      this.bounds['y1'] = this.bounds['y1'].toFixed(4);

      var time = this.$refs.video.currentTime;

      time = this.roundToNearest(time, this.currentSPF).toFixed(4);
      this.bounds['start'] = time

      var nrows = table.rows.length;
      this.bounds['row'] = nrows

      this.boundingBoxes.push(Object.assign({}, this.bounds));
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
      this.boundingBoxes[id].end = endTime;
    },

    deleteButton: function (id, e) {
      id = parseInt(id) - 1;
      this.boundingBoxes.splice(id, 1);

      for (var i = 0; i < this.boundingBoxes.length; i++) {
        this.boundingBoxes[i].row = i+1;
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
      console.log(this.boundingBoxes.length)
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

    downloadTable: function () {
      var csv = [];
      var context = document.createElement('html')
      var rows = this.$refs[`row-key`];
      var row = [];

    //   <th scope="col">#</th>
    //                 <th scope="col">Object </th>
    //                 <th scope="col">Bounds </th>
    //                 <th scope="col">Start </th>
    //                 <th scope="col">End </th>
    //                 <th scope="col"> </th>

      row.push('Object');
      row.push('x1');
      row.push('y1');
      row.push('x2');
      row.push('y2');
      row.push('Start');
      row.push('End');
      csv.push(row.join(','));

      for (var i = 0; i < rows.length; i++) {
        context.innerHTML = rows[i];
        var tds = rows[i].getElementsByTagName('td');
        var row = [];
        row.push(tds[0].getElementsByTagName('input')[0].value); // object
        row.push(this.boundingBoxes[i].x1) // x1
        row.push(this.boundingBoxes[i].y1) // y1
        row.push(this.boundingBoxes[i].x2) // x2
        row.push(this.boundingBoxes[i].y2) // y2
        //row.push(tds[].innerHTML); // bounds
        row.push(tds[2].innerHTML); // start
        row.push(tds[3].innerHTML); // end
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
