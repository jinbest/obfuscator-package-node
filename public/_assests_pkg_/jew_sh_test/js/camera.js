// *
// * Copyright 2020 Modaka Technologies ( https://modakatech.com )
// *
// * you are not use this file except in compliance with the License.
// * This file is used only for testing and none else can use any part of this code without agreement from Modaka Technologies.
// * Unless required by applicable law or agreed to in writing, software
// * See the License for the specific language governing permissions and
// * limitations under the License.

let stream = document.getElementById("inputVideo"),
  capture = document.createElement("canvas"),
  snapshot = document.createElement("div");
  globalCapturedStatus = false;
let FRONT_CAM = 1,
  BACK_CAM = 2;
let flipMethod = FRONT_CAM;
let ipad_size = 1024;
const LIVE_MODE = 0;
const UPLOAD_PIC_MODE = 1;
let MODE = LIVE_MODE;
let MODE_SWITCH_FIRST_TIME=false;
var canvasVideo, ctxVideo;
var imgUploaded;


snapshot.id = "snapshot";
snapshot.style.position = "absolute";
snapshot.style.overflow = "hidden";
snapshot.style.zIndex = 0;
snapshot.classList.add("hide");
document.getElementById("maincamera").appendChild(snapshot);

let cameraStream = null,
  global_random_qr_key;

function startStreaming(method) {
  // console.log("startStreaming")
  let mediaSupport = "mediaDevices" in navigator;
  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: screen.width > 640 ? 1280 : { ideal: 640 },
          height: screen.width > 640 ? 720 : { ideal: 480 },
          facingMode: method == 1 ? "user" : { exact: "environment" },
        },
      })
      .then(camSuccess)
      // .then(function (mediaStream) {
      //   cameraStream = mediaStream;
      //   // stream.srcObject = mediaStream;
      //   // stream.play();
      //   camSuccess()
      // })
      .catch(function (err) {
        CamFail();
        // show("nonecamera");
        // // setCanvasSize(null, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0),
        // //     $('#overlayVideo').get(0));
        // console.log("Unable to access camera: " + err);
        // hide("menu");
        // show("uploadbtn");
      });
  } else {
    alert("Your browser does not support media devices.");
    return;
  }
  // setCanvasSize(stream, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0),
  // $('#overlayVideo').get(0));
  // try{
  //   startProcessing()
  //   }
  // catch(e){
  //   console.log(e)
  // }
}

function stopStreaming() {
  if (null != cameraStream) {
    let track = cameraStream.getTracks()[0];
    track.stop();
    stream.load();
    cameraStream = null;
  }
}

function flipCamera() {
  // console.log("flipCamera");
  stopStreaming();
  if (flipMethod == FRONT_CAM) {
    startStreaming(BACK_CAM);
    // startProcessing();
    var inputVideo = document.getElementById("inputVideo");
    inputVideo.style.webkitTransform = "rotateY(" + 0 + "deg) ";
    inputVideo.style.mozTransform = "rotateY(" + 0 + "deg) ";
    inputVideo.style.transform = "rotateY(" + 0 + "deg) ";
    flipMethod = BACK_CAM;
  } else {
    startStreaming(FRONT_CAM);
    flipMethod = FRONT_CAM;
    // startProcessing();
    var inputVideo = document.getElementById("inputVideo");
    inputVideo.style.webkitTransform = "rotateY(" + 180 + "deg) ";
    inputVideo.style.mozTransform = "rotateY(" + 180 + "deg) ";
    inputVideo.style.transform = "rotateY(" + 180 + "deg) ";
  }
}
function camSuccess(stream) {
  cameraStream = stream;
  const videoEl = $("#inputVideo").get(0);
  if ("srcObject" in videoEl) {
    if(MODE == UPLOAD_PIC_MODE){
      isCameraON= false;
      stopStreaming();
      return;
    }
    videoEl.srcObject = stream;
    currentStream = stream;
  } else {
    console.log("srcObject doesn't exist in videoEl");
    videoEl.src = window.URL && window.URL.createObjectURL(stream);
  }
  videoEl.onloadedmetadata = function () {
    if(MODE == UPLOAD_PIC_MODE){
      isCameraON= false;
      stopStreaming();
      return;
    }

    videoEl.play();
    if (isCameraON) {
      //switch camera called
      setCanvasSize(
        videoEl,
        $("#overlay").get(0),
        $("#overlay2").get(0),
        $("#overlay3").get(0),
        $("#overlayVideo").get(0)
      );
      // setSwipeListeners();
      return;
    }
    document.getElementById("loadingAnim").style.display = "block";
    setCanvasSize(
      videoEl,
      $("#overlay").get(0),
      $("#overlay2").get(0),
      $("#overlay3").get(0),
      $("#overlayVideo").get(0)
    );

    isCameraON = true; // detectBrowser();
  };
}

function captureSnapshot() {

  // stopSwing();
  globalCapturedStatus = true;
  let video = $('#inputVideo').get(0);

  if (MODE == LIVE_MODE) {
    global_random_qr_key = cameraStream
      ? Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      : "Nonecamera";
  }

  if (null != cameraStream || MODE != LIVE_MODE) {
    let ctx = capture.getContext("2d"),
      wh,
      ht,
      ratio;
    ratio =
      MODE == LIVE_MODE
        ? stream.videoWidth / stream.videoHeight
        : midcanvas.width / midcanvas.height;

    wh = global_media_width;
    ht = global_media_height;
    let delta = (ht * ratio - wh) / 2;
    if (ht * ratio >= wh) {
      console.log("ggg");
      capture.width = ht * ratio;
      capture.height = ht;
      if (flipMethod == FRONT_CAM) {
          console.log("g22gg");
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -ht * ratio, 0, ht * ratio, ht);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0, ht * ratio, ht);
      }

      // ctx.drawImage(leftcanvas, 0, 0, ht * ratio, ht);
      // ctx.drawImage(rightcanvas, 0, 0, ht * ratio, ht);
      // ctx.drawImage(midcanvas, 0, 0, ht * ratio, ht);

      snapshot.innerHTML = "";
      snapshot.appendChild(capture);
      snapshot.style.left = -delta + "px";
      snapshot.style.top = "0px";
      snapshot.style.width = ht * ratio + "px";
      snapshot.style.height = "100%";
      // snapshot.style.visibility = "hidden";
    } else {
      capture.width = wh;
      capture.height = wt / (ratio*0.5);
      delta = (wh / ratio - ht) / 2;
      // console.log(capture.width,capture.height);
      if (flipMethod == FRONT_CAM) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          canvasVideo,
          -capture.width,
          0,
          capture.width,
          capture.height
        );
        ctx.restore();
      } else {
        ctx.drawImage(canvasVideo, 0, 0, capture.width, capture.height);
      }
      ctx.drawImage(leftcanvas, 0, 0, capture.width, capture.height);
      ctx.drawImage(rightcanvas, 0, 0, capture.width, capture.height);
      ctx.drawImage(midcanvas, 0, 0, capture.width, capture.height);

      snapshot.innerHTML = "";
      snapshot.appendChild(capture);
      snapshot.style.left = "0px";
      snapshot.style.top = -delta + "px";
      snapshot.style.width = wh + "px";
      snapshot.style.height = capture.height - delta + "px";
    }
    show("snapshot");
    if(screen.width > ipad_size){
      show("logo");
    }

  }
  
  let selfieFile = dataURLtoFile(capture.toDataURL(), 'selfie-' + new Date().getTime() + '.png');
  console.log(selfieFile);
  s3upload(selfieFile);
}

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function s3upload(files) {
  var bucketName = 'image-testingobj';
  var bucketRegion = 'ap-south-1';
  var IdentityPoolId = 'ap-south-1:04354b3c-b0c9-4203-b05c-bf35ca16783c';

  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
  });

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
  });

  // var files = document.getElementById('fileUpload').files;
  if (files) 
  {
    var file = files;
    var fileName = file.name;
    var filePath = 'my-first-bucket-path/' + fileName;
    // var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/my-    first-bucket/' +  filePath;
    s3.upload({
        Key: filePath,
        Body: file,
        ACL: 'public-read'
      }, function(err, data) {
        if(err) {
          reject('error');
        }
        alert('Successfully Uploaded!');
      }).on('httpUploadProgress', function (progress) {
        var uploaded = parseInt((progress.loaded * 100) / progress.total);
        $("progress").attr('value', uploaded);
    });
  }
};

function show(id) {
  document.getElementById(id).classList.remove("hide");
  document.getElementById(id).classList.add("show");
}

function hide(id) {
  document.getElementById(id).classList.remove("show");
  document.getElementById(id).classList.add("hide");
}

function removeSnapshot() {
  globalCapturedStatus = false;
  hide("snapshot");
  hide("logo");
}

function downSnapshot() {
  // console.log("downSnapshot");
  if (!cameraStream && MODE == LIVE_MODE) {
    // console.log("downSnapshot");
    return;
  }
  if (MODE != LIVE_MODE) {
    captureSnapshot();
    removeSnapshot();
  }
  let a = document.createElement("a"),
    ctx = capture.getContext("2d");

  ctx.drawImage(
    document.getElementById("logoimg"),
    capture.width - 130,
    10,
    120,
    50
  );

  a.href = capture.toDataURL("image/jpg");
  a.download = "camweara.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setCanvasSize(videoEl, canvas, canvas2, canvas3, canvas4){
   // console.log("setCanvasSize",videoEl.videoWidth,videoEl.videoHeight)
   if (videoEl == null){
      // console.log("null")
      width =  (screen.width>640) ? 1280 : 480;
      height = (screen.width>640) ? 720  : 640;
   }else{
       width = videoEl.videoWidth //* faceWidthCropRatio;
       height = videoEl.videoHeight //* faceHeightCropRatio;
   }

   if (MODE != LIVE_MODE){
     width =  (screen.width>640) ? 1280 : 480;
     height = (screen.width>640) ? 720  : 640;
   }
   // console.log("set",document.getElementById("maincamera").style.width)

   // console.log(width,height)
   canvas.width = width;
   canvas.height = height;
   canvas2.width = width;
   canvas2.height = height;
   canvas3.width = width;
   canvas3.height = height;
   canvas4.width = width;
   canvas4.height = height;
   canvasVideo = document.getElementById("overlayVideo");

   if (MODE == LIVE_MODE){
     if (flipMethod == FRONT_CAM){
         console.log("qqqq",flipMethod)
         if (screen.width< 640){
            // stream.style.transform = 'rotateY(' + 180 + 'deg) ';
         }else{
            stream.style.transform = 'rotateY(' + 180 + 'deg)';
         }
         canvasVideo.style.transform = 'rotateY(' + 180 + 'deg)';
     }else{
         // console.log("flip",flipMethod)
         stream.style.transform = 'rotateY(' + 0 + 'deg) ';
         canvasVideo.style.transform = 'rotateY(' + 0+ 'deg)';
     }
   }
   else{
     // stream.style.transform = 'rotateY(' + 0 + 'deg)';
     canvasVideo.style.transform = 'rotateY(' + 0+ 'deg)';
   }
   ctxVideo = canvasVideo.getContext("2d");
   canvasVideoWidth = canvasVideo.width;
   canvasVideoHeight = canvasVideo.height;
}

function CamFail() {
  // show("nonecamera");
  MODE = UPLOAD_PIC_MODE;
  console.log("Unable to access camera: ");
  hide("menu");
  hide("flipCamera");
  show("uploadbtn");
  setCanvasSize(
    null,
    $("#overlay").get(0),
    $("#overlay2").get(0),
    $("#overlay3").get(0),
    $("#overlayVideo").get(0)
  );
  document.getElementById("maincamera").style.backgroundColor = "white";
  // ctx = canvas_overlay4.getContext('2d');
  imgUploaded = new Image();
  imgUploaded.src = "./img/images/no-photo1.png";
  imgUploaded.onload = function () {
    drawImageScaled(imgUploaded, ctxVideo);
  };
}

function upload_live(){
  // $('#upload_livebtn').prop('disabled', true);
  document.getElementById('upload_livebtn').style.pointerEvents = 'none';
  // $("#upload_livebtn *").attr("disabled", "disabled").off('click');
  try{
    stopSwing();
    clearCanvas();
    ctxVideo.clearRect(0,0,canvasVideo.width, canvasVideo.height);
  }catch(e){
    //nothing
  }
  if (MODE == LIVE_MODE){
    MODE = UPLOAD_PIC_MODE;
    MODE_SWITCH_FIRST_TIME = true;
    hide("menu");
    hide("flipCamera")
    show("img_upload");
    stopStreaming();
    setCanvasSize(null, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0),
    $('#overlayVideo').get(0));
    // $("#upload_livebtn").find('img').attr('src', "./img/images/live.png")
    setTimeout(function(){
      clearCanvas();
      ctxVideo.clearRect(0,0,canvasVideo.width, canvasVideo.height);

      imgUploaded = new Image();
      imgUploaded.src = "./img/images/no-photo1.png";
      imgUploaded.onload = function () {
        drawImageScaled(imgUploaded, ctxVideo);
      };
      onUploadClick();
    },0)

  }else{
    MODE_SWITCH_FIRST_TIME = false;
    onUploadClick();
  }
}

function onRetriveUpload() {

    hide("nonecamera");
    show("menu");
    hide("img_upload");
    if(is_mobile()) show("flipCamera");
    flipMethod = FRONT_CAM;
    setTimeout(function(){
      startStreaming(flipMethod);
      clearCanvas();
      ctxVideo.clearRect(0,0,canvasVideo.width, canvasVideo.height);
    },0)
    // $("#upload_livebtn").find('img').attr('src', "./img/images/upload.png")
    document.getElementById("maincamera").style.backgroundColor = "white";
    MODE = LIVE_MODE;
    MODE_SWITCH_FIRST_TIME = true;
    document.getElementById('upload_livebtn').style.pointerEvents = 'auto';
}

function drawImageScaled(img, ctx) {
  let canvas = ctx.canvas;
  let hRatio = canvas.width / img.width;
  let vRatio = canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  let centerShift_x = (canvas.width - img.width * ratio) / 2;
  let centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

let fileUploadEvent = document.getElementById('fileUpload');

function onUploadClick() {
  previous_LM = [];
  // if(!isModelLoaded){
  //   return;
  // }
  try{
    stopStreaming();
  }catch(e){
    //nothing
  }
  setTimeout(function(){
      clearCanvas();
      ctxVideo.clearRect(0,0,canvasVideo.width, canvasVideo.height);

      imgUploaded = new Image();
      imgUploaded.src = "./img/images/no-photo1.png";
      imgUploaded.onload = function () {
        drawImageScaled(imgUploaded, ctxVideo);
      };
  },0)

  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: "Upload Click",
  });

  // document.getElementById('upload_livebtn').style.pointerEvents = 'none';
  document.getElementById("fileUpload").click();
}

fileUploadEvent.onclick = fileUploadValidate;

function fileUploadValidate()
{
    // console.log("fileUploadValidate======");
    function checkFileInput(){
      if(fileUploadEvent.value.length){
        //nothing fileuplaoded
        // console.log("file == uplaoded");
      } else{
        // file not uplaoded
        // console.log("file not uplaoded");
        document.getElementById('upload_livebtn').style.pointerEvents = 'auto';
      }
    }
    document.body.onfocus = checkFileInput;
}


function readURL(input) {
  console.log("readURL");
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    hide("nonecamera");
    // show("download_bttn_up");

    reader.onload = function (e) {
      imgUploaded = new Image();
      imgUploaded.src = e.target.result;

      imgUploaded.onload = function () {
        processImage(imgUploaded, false);
        // drawImageScaled(imgUploaded,ctxVideo);
      };
    };

    reader.readAsDataURL(input.files[0]);
  }
}

async function processImage(img, isFirstImg) {
 console.log("processImage");
 try{
   clearCanvas();
 }catch(e){
   //nothing
 }
 let imageData;
 flipMethod = BACK_CAM;
 // document.getElementById("loadingAnim").style.display = "block";
 let canvas_overlay2 =  document.querySelector('#overlayVideo');
 let ctx2 = canvas_overlay2.getContext('2d');
 if(!isFirstImg){
   // console.log("if")
   ctxVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
   drawImageScaled(img, ctxVideo);
   imageData = ctxVideo.getImageData(0, 0, canvasVideo.width, canvasVideo.height);
   // srcMat.data.set(imageData.data);
 }
 else{
   // console.log("else")
   let canvas = document.createElement('canvas');
   let context = canvas.getContext('2d');
   canvas.width = canvasVideo.width;
   canvas.height = canvasVideo.height;
   context.drawImage(img, 0, 0 );
   imageData = context.getImageData(0, 0, canvasVideo.width, canvasVideo.height);
   // srcMat.data.set(imageData.data);
 }

   var predict = await faceModel.estimateFaces(imageData);

   if (predict.length>0){
     for (let i=0; i<5;i++){
         predict = await faceModel.estimateFaces(imageData);
     }

     try{
       var keypoints = predict[0].annotations.silhouette;
       var box = predict[0].boundingBox;
       var nosetip = predict[0].annotations.noseTip;
       keypoints.push(nosetip[0]);
       var keypoints_rel = predict[0].annotations.rightEyeLower1;
       var keypoints_lel = predict[0].annotations.leftEyeLower1;
       for (var i=0 ; i <keypoints_rel.length;i++){
         keypoints.push(keypoints_rel[i]);
       }
       for (var i=0 ; i <keypoints_lel.length;i++){
         keypoints.push(keypoints_lel[i]);
       }
       var midpt = predict[0].annotations.midwayBetweenEyes;
       keypoints.push(midpt[0])
       let keypointsTemp = predict[0].scaledMesh;
       keypoints.push(keypointsTemp[134]);
       keypoints.push(keypointsTemp[360]);

       HandelProduct(keypoints);
       previous_LM = keypoints;
     }catch(e){
       clearCanvas();
       ctxVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
       show("nonecamera");
       document.getElementById('upload_livebtn').style.pointerEvents = 'auto';
     }

   }else{
     // drawFaceNotFound("./img/images/face1.jpg");
     clearCanvas();
     ctxVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
     show("nonecamera");
     document.getElementById('upload_livebtn').style.pointerEvents = 'auto';
     // hide("download_bttn_up");

 }
 // document.getElementById("loadingAnim").style.display = "none";
 // document.getElementById('upload_livebtn').style.pointerEvents = 'auto';
}

function changeJewelryPrevValues() {
  isScreenshot = true;
  if (previous_LM.length>0){
      HandelProduct(previous_LM);
  }
}
