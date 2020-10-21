let global_media_height = 480,
  global_media_width = 640,
  init_global_height = 480,
  hideCategoryKey = 0,
  borderRadius = 35;
var globalStatus = "medium-expand";
var isSafar12 = false;
var faceModel;
let isCameraON = false;
let camH;
let btnnames = [];
// catenum = [6, 6, 6, 4],
(added_favorite = []), (session_favorite_list = []), (buy_list = []);
let settab = 1,
  w = window.innerWidth,
  h = window.innerHeight,
  zoommain,
  favlistnum = 1,
  expandKey = 0;
  let loadclickdown = "";
let loadclickup = "";
let isLoc_storage = true;
var specialChar = "&";

let globselectedlist = {
  Earring: null,
  Necklace: null,
  NecklaceSet: null,
  Nosering: null,
  Tikka: null,
  // "Mangalsutras": null,
  // "PendantSets": null,
};
let prev_sel_prod;

let mc_ht, mc_wd;

// let earrings_pod = ["5552164&80.png","6992&42.png","JE01118-YGP900&21.png","103A8689&50.png"]
// let necklace_pod = ["necklace1&110&569.png","necklace2&26&467.png","C012119&15&452.png"]
// let necklace_set_pod = ["N5369&63&420&N5369&35.png"]

let catenum = [];
let crop_val = 160;

var cur_prod_id = 1;

let mobileCaseGlobId = null;

window.onload = function () {
  // if browser back and come forward, set flipCamera here
  flipMethod =FRONT_CAM;
}

function add_tab() {
  let add_tab = $(".nav-tabs");
  let cnt = 1;
  let s = "", actTab = "";
  let width = (screen.width<640) ? "100px" : "80px";
  console.log(width);
  for (var key in product_arr) {
    if (product_arr[key].length != 0) {
      s = cnt == 1 ? 'class="active"' : "";
      actTab = cnt == 1 ? 'class="tab-text active-tab-text"' : 'class="tab-text"';
      let add_li;
      if (key == "Earring") {
        // add_li = "<li " +s+' id="btn' +cnt +'"> <a href="#' +cnt +'" data-toggle="tab" id="tab' + cnt +'" style="padding: 0px;"> <img src="img/images/earring_tab.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
        add_li = "<li " +s+' id="btn' +cnt +'"> <a href="#' +cnt +'" data-toggle="tab" id="tab' + cnt +'" style="padding: 0px;"> <p ' + actTab + ' id="actTxt' + cnt + '">EARRING</p> </a> </li>';
      } else if (key == "Necklace") {
        // add_li ="<li " +s +' id="btn' +cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' +cnt +'" style="padding: 0px;"> <img src="img/images/new-necklace-tab.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
        add_li = "<li " +s+' id="btn' +cnt +'"> <a href="#' +cnt +'" data-toggle="tab" id="tab' + cnt +'" style="padding: 0px;"> <p ' + actTab + ' id="actTxt' + cnt + '">NECKLACE</p> </a> </li>';
      } else if(key == "NecklaceSet"){
        // add_li ="<li " +s +' id="btn' +cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' +cnt +'" style="padding: 0px;"> <img src="img/images/Sets.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
        add_li = "<li " +s+' id="btn' +cnt +'"> <a href="#' +cnt +'" data-toggle="tab" id="tab' + cnt +'" style="padding: 0px;"> <p ' + actTab + ' id="actTxt' + cnt + '">SETS</p> </a> </li>';
       }
       else if(key == "Nosering"){
        add_li ="<li " +s +' id="btn' +cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' +cnt +'" style="padding: 0px;"> <img src="img/images/nosering_tab.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
       }
       else if(key == "Tikka"){
        add_li ="<li " +s +' id="btn' +cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' +cnt +'" style="padding: 0px;"> <img src="img/images/maangtikka_tab.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
       }
       else if(key == "Pendant"){
        add_li ="<li " +s +' id="btn' +cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' +cnt +'" style="padding: 0px;"> <img src="img/images/pendants_tab.png" style="width: '+ width +'; height: auto;"/> </a> </li>';
       }
       else{
        add_li = "<li " + s +' id="btn' + cnt +'"> <a href="#' + cnt +'" data-toggle="tab" id="tab' + cnt +'"> ' + key +" </a> </li>";
       }

      add_tab.append(add_li);
      btnnames.push(key);
      catenum.push(product_arr[key].length);
      cnt++;
    }
  }
  for (let i = 1; i <= 3; i++) {
    if(is_mobile() && isMobileDevice.Android()) {
      if(checkBrowser() === 'safari' || checkBrowser() === 'chrome') {
        document.getElementById("actTxt" + i).classList.add("chrome-mobile-text-tab");
      }
    }
  }
}

let globalPixelRatio = window.devicePixelRatio;
let cntBrowser = checkBrowser();
let initRatioForPopupSize = 0.85;
// smallWords = document.getElementById("small_words");

let isMobileDevice = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

if (isMobileDevice.iOS()) {
  // document.getElementById("favlisttitle").style.fontSize = "15px";
  if (w < h) {
    // smallWords.style.marginLeft = "105px";
    // smallWords.style.fontSize = "9px";
  } else {
    // smallWords.style.marginLeft = "6px";
    // smallWords.style.fontSize = "6px";
    document
      .getElementById("category_title")
      .classList.add("iPhoneCategoryTitle");
  }
}

async function init() {
  $("#camera_div").modal("show");
  $(".modal").unbind("click");
  stopStreaming();
  add_tab();
  console.log("init");
  for (let i = 0; i < btnnames.length; i++) {
    document
      .getElementById("btn" + parseInt(i + 1))
      .addEventListener("click", function () {
        console.log("tab");
        setColorbtn(i + 1);
      });
  }
  setColorbtn(settab);
  // document.getElementById("category1" + "_image_" + settab).click();
  // if (index== 1 && settab ==1){
  // setNull(globselectedlist)
  // globselectedlist[btnnames[settab - 1]] = './img/jewelry/' + product_arr[btnnames[settab-1]][0];
  // // selectedCategory("category1");
  // document.getElementById("category1").classList.add("selectedCategory")
  // }
  createloadmorebtn();

  if (w > ipad_size) {
    let zoomRate = 1,
      zoommain = ((w * initRatioForPopupSize) / 963) * 100;
    if ((zoommain * 487) / 100 > h) {
      zoommain = ((h * initRatioForPopupSize) / 487) * 100;
    }
    if (cntBrowser == "firefox") {
      let marginleft = (w - 963) / 2 + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // document.getElementById("overlay2").style.marginLeft = marginleft;
      let margintop = (h - 487) / 2 + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${
        (zoommain * zoomRate) / 100
      })`;
    } else {
      let marginleft =
        ((w - (963 * zoommain * zoomRate) / 100) / 2) *
          (100 / zoommain / zoomRate) +
        "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // document.getElementById("overlay2").style.marginLeft = marginleft;
      let margintop =
        ((h - (487 * zoommain * zoomRate) / 100) / 2) *
          (100 / zoommain / zoomRate) +
        "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.zoom =
        zoommain * zoomRate + "%";
      // document.getElementById("overlay2").style.marginTop = margintop;
      // document.getElementById("overlay2").style.zoom = zoommain * zoomRate + "%";
    }
    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "520px";
    document.getElementById("camera_div").style.overflow = 'hidden';
    // document.getElementById("overlay2").style.width = "963px";
    // document.getElementById("overlay2").style.height = "487px";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "13px";
    document.getElementById("upload_livebtn").style.bottom = "16px";
    document.getElementById("shareBtn2").style.bottom = "55px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    show("loadmorediv");
    hide("loadupdiv");
    show("brandlogo");
    show("needhelp");
  } else {

    zoommain = ((w * 0.96) / 642) * 100;
    camH = ((h * 0.96) / zoommain) * 100;

    console.log("zoommain",zoommain, camH, camH - 301 , screen.height);


    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = camH - 301 + "px";

    document.getElementById("maincamera").style.height =
      camH - 101 + borderRadius + "px";
    document.getElementById("category_title").innerHTML = loadclickdown; //"Categories <a style='color:blue'>(-)</a>";
    document.getElementById("category_title").style.display = "none";
    // console.log(camH - 101 + borderRadius,"px")

    // document.getElementById("canvascontainer").style.height = 2+((camH - 301+ borderRadius)/camH)*100 + "%";

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    // Capture position change
    //document.getElementById("pentagon").style.bottom = "250px";
    //document.getElementById("menu").style.bottom = "250px";
    //document.getElementById("upload_livebtn").style.bottom = "250px";
    // document.getElementById("canvascontainer").style.transform = `scale(1, ${screen.height/(camH - 201 + borderRadius)})`;



    if (cntBrowser == "firefox") {
      document.getElementById("camera_div").style.marginTop =
        (h - camH) / 2 + "px"; //((h - camH) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft =
        (w - 642) / 2 + "px"; //((w - 642) / 2) + "px";
      document.getElementById("camera_div").style.transform = `scale(${
        (zoommain * 1.04) / 100
      })`; //`scale(${(zoommain/100)})`;
    } else {
      document.getElementById("camera_div").style.marginTop = "0%"; //"2%";
      document.getElementById("camera_div").style.marginLeft = "0%"; //"2%";
      document.getElementById("camera_div").style.zoom = zoommain * 1.04 + "%";
    }

    document.getElementById("favorite").style.height = camH - 301 + "px";
    document.getElementById("favourities").style.height = camH - 341 + "px";
    global_media_height = init_global_height = camH - 101 + borderRadius;

    // flipCamera Icon
   // document.getElementById("flipCamera").style.bottom = "240px";
    hide("needhelp");
    // show("small_words");

    // if(is_mobile()) {
    //   document.getElementById("upload_livebtn").style.left = "120px";
    // } else {
    //   document.getElementById("upload_livebtn").style.left = "20px";
    // }

  }
  // maincamera_ht = document.getElementById("maincamera").offsetHeight;

  if (is_mobile()) {
    // document.getElementById("menu").style.width = "80px";
    // document.getElementById("menu").style.height = "80px";
    show("flipCamera");
    show("tempdiv");
    show("share_bttn_on")
    hide("needhelp");
    if(cntBrowser === 'safari') {
      // console.log("check here")
      document.getElementById("flipCamera").style.bottom = "235px";
      document.getElementById("menu").style.bottom = "235px";
      document.getElementById("upload_livebtn").style.bottom = "235px";
    }
    MobileInitCaseAlignCustomize();
   // hide("brandlogo");
    // crop_val = 0
    // crop_val = (((640 - ((camH - 101 + borderRadius)/(16/9)/2))*(4/3)));
    // console.log("crop_val",crop_val)
  }

  // if (cntBrowser !== "firefox"){
  //    await tf.setBackend('wasm');
  // }
  //stopStreaming();
  startStreaming(FRONT_CAM); //global_media_width, global_media_height);
  // startProcessing();

  // faceModel = await facemesh.load({maxFaces: 1});
}

function loadbrowser(value_b, set_int){
  if(value_b && isCameraON){
    //click on first product written here: loadbrowser function.
      let i =1;
      while(true){
        try{
            document.getElementById("category"+i+"_image_" + settab).click();
            break;
        }catch(e){
            //do nothing
        }
        i++;
      }

        clearInterval(set_int);
          $(".loadingAnim").css("display", "none");
        // startProcessing();
      }
}

function onBackClick() {
  close();
  window.history.back();
}

function onShareClick() {
  console.log("onShareClick entered");

  let URL = window.location;
  if (screen.width < 480) {
    if (navigator.share) {
      navigator
        .share({ text: URL })
        .then(() => console.log("Share complete"))
        .error((error) => console.error("Could not share at this time", error));
    }
  } else {
    URL = encodeURIComponent(URL);
    var number = "number";
    URL = "https://api.whatsapp.com/send?phone=" + number + "&text=%20" + URL;
    window.open(URL, "_blank");
  }
}

function createdivfortabbtn(divname, containdiv, index) {
  let btndiv = document.createElement("div");
  btndiv.id = "btn" + index;
  btndiv.style.padding = "13px";
  btndiv.style.cursor = "pointer";
  btndiv.style.textAlign = "center";
  btndiv.style.marginTop = "5px";
  btndiv.style.marginLeft = "15px";
  btndiv.style.marginBottom = "10px";
  btndiv.style.width = btndiv.style.height = "fit-content";
  btndiv.style.borderRadius = "5px";
  btndiv.style.fontSize = "14px";
  let container = document.getElementById(containdiv);
  container.appendChild(btndiv);

  let span = document.createElement("span");
  span.innerHTML = divname;
  let btncontainer = document.getElementById(btndiv.id);
  btncontainer.appendChild(span);
}

function createloadmorebtn() {
  let loadmore = document.createElement("div");
  loadmore.id = "loadmorediv";
  document.getElementById("category").appendChild(loadmore);
  loadmore.classList.add("loadmore");

  let loadmoreimg = document.createElement("img");
  loadmoreimg.id = "loadmoreimg";
  loadmoreimg.style.width = "100%";
  loadmoreimg.style.height = "100%";
  loadmoreimg.src =
    window.innerWidth > ipad_size
      ? "img/images/loaddown.png"
      : "img/images/loaddown.png";
  document.getElementById(loadmore.id).appendChild(loadmoreimg);

  document.getElementById(loadmore.id).addEventListener("click", function () {
    if (window.innerWidth > ipad_size) {
      scrolldown();
    } else {
      // initialCategories();
      (expandKey) ? SwipeAnimate(
        parseInt(document.getElementById("camera_div").offsetHeight) - 300,
        301,
        1000,
        "expand-to-init"
      ) : SwipeToggle();
      console.log("expandKey", expandKey)
      // SwipeToggle();
      document.getElementById("category_title").innerHTML = loadclickdown; //"Categories <a style='color:blue'>(-)</a>";
      loadmore.classList.add("hide");
    }
  });

  let loadup = document.createElement("div");
  loadup.id = "loadupdiv";
  document.getElementById("category").appendChild(loadup);
  loadup.classList.add("loadup");
  // hide("loadupdiv");

  let loadupimg = document.createElement("img");
  loadupimg.id = "loadupimg";
  loadupimg.style.width = "100%";
  loadupimg.style.height = "100%";
  loadupimg.src =
    window.innerWidth > ipad_size
      ? "img/images/loadup.png"
      : "img/images/loadup.png";
  document.getElementById(loadup.id).appendChild(loadupimg);

  document.getElementById(loadup.id).addEventListener("click", function () {
    if (window.innerWidth > ipad_size) {
      scrollup();
    } else {
      // loadmoreCategories();
      // if (hideCategoryKey) return;
      (!hideCategoryKey) ? SwipeAnimate(
        301,
        parseInt(document.getElementById("camera_div").offsetHeight) - 300,
        1000,
        "init-to-expand"
      ) : SwipeToggle();
      document.getElementById("category_title").innerHTML = loadclickdown; //"Categories";
    }
  });
}

function loadmoreCategories() {
  if (hideCategoryKey) return;
  expandKey = 1;
  globalStatus = "fully-expand";
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = parseInt(parentdiv.style.height) - 300 + "px";
  cate.style.zIndex = 20;
  cates.style.height = parseInt(parentdiv.style.height) - 400 + "px";
  cate.style.top =
    parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.add("flex-categories");

  if (isMobileDevice.iOS()) {
    // smallWords.style.marginLeft = "145px";
  } else {
    // smallWords.style.marginLeft = "280px";
  }

  cates.onwheel = categoriesScrollWheeling;

  hide("loadupdiv");
  show("loadmorediv");
}

function initialCategories() {
  if (hideCategoryKey) return;
  expandKey = 0;
  globalStatus = "medium-expand";
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = "301px";
  cates.style.height = "201px";
  cate.style.top =
    parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.remove("flex-categories");
  // document.getElementById("maincamera").style.height = parseInt(parentdiv.style.height) - 301 + borderRadius + "px";
  document.getElementById("favorite").style.height =
    parseInt(parentdiv.style.height) - 301 + "px";
  document.getElementById("favourities").style.height =
    parseInt(parentdiv.style.height) - 341 + "px";

  if (isMobileDevice.iOS()) {
    // smallWords.style.marginLeft = "105px";
  } else {
    // smallWords.style.marginLeft = "250px";
  }

  cates.onwheel = MouseWheeling;

  show("loadmorediv");
  show("loadupdiv");
}

function SwipeToggle() {
  if (
    window.innerWidth > ipad_size ||
    parseInt(document.getElementById("categories").style.height) > ipad_size
  ) {
    return;
  }

  if (hideCategoryKey) {
    console.log("if");
    SwipeAnimate(101, 301, 1000, "hide-to-init");
    document.getElementById("category_title").innerHTML = loadclickdown; //"<a style='color:blue'>(-)</a>";
    //document.getElementById("pentagon").style.bottom = "250px";
    //document.getElementById("menu").style.bottom = "250px";
   /* document.getElementById("flipCamera").style.bottom = "240px";*/
    show("loadmorediv");
    show("loadupdiv");
  } else {
    console.log("else");
    (is_mobile()) ? SwipeAnimate(235, 101, 1000, "init-to-hide") : SwipeAnimate(301, 101, 1000, "init-to-hide");
    document.getElementById("category_title").innerHTML = loadclickup; //"<a style='color:blue'>(+)</a>";
    // Capture position change
    document.getElementById("pentagon").style.bottom = "110px";
    document.getElementById("menu").style.bottom = "110px";
    document.getElementById("flipCamera").style.bottom = "110px";
    show("loadmorediv");
    hide("loadupdiv");
  }
  document.getElementById("camera_div").style.overflowY = "hidden";
}

function toggleCategory() {
  if (
    window.innerWidth > ipad_size ||
    parseInt(document.getElementById("categories").style.height) > 201
  ) {
    return;
  }

  document.getElementById("categories").style.height =
    hideCategoryKey == 0 ? "2px" : "201px";
  document.getElementById("categories").style.display = "flex";

  let cntCategoryTop = document.getElementById("category").style.top,
    mainCameraHeight = document.getElementById("maincamera").style.height,
    favoriteHeight = document.getElementById("favorite").style.height,
    favouritiesHeight = document.getElementById("favourities").style.height;

  hideCategoryKey == 0
    ? (document.getElementById("category").style.top =
        parseInt(cntCategoryTop) + 200 + "px")
    : (document.getElementById("category").style.top =
        parseInt(cntCategoryTop) - 200 + "px");
  hideCategoryKey == 0
    ? (document.getElementById("category").style.height = "100px")
    : (document.getElementById("category").style.height = "301px");
  // (hideCategoryKey==0) ? document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) + 201 + "px" :
  //                        document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) - 201 + "px";
  hideCategoryKey == 0
    ? (document.getElementById("favorite").style.height =
        parseInt(favoriteHeight) + 201 + "px")
    : (document.getElementById("favorite").style.height =
        parseInt(favoriteHeight) - 201 + "px");
  hideCategoryKey == 0
    ? (document.getElementById("favourities").style.height =
        parseInt(favouritiesHeight) + 201 + "px")
    : (document.getElementById("favourities").style.height =
        parseInt(favouritiesHeight) - 201 + "px");
  // global_media_height = parseInt(document.getElementById("maincamera").style.height);

  hideCategoryKey == 0 ? (hideCategoryKey = 1) : (hideCategoryKey = 0);

  // if (hideCategoryKey) {
  //   hide("loadmorediv");
  //   show("loadupdiv");
  // } else {
  //   hide("loadmorediv");
  //   show("loadupdiv");
  // }
}

let enablescrolldown, enablescrollup, enablescrollright, enablescrollleft;

function scrolldown() {
  if (window.innerWidth > ipad_size) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop + 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });

    enablescrollup = top > 0;
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    // console.log(scrollHeight - top - clientHeight, enablescrolldown, enablescrollup);
    if (!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if (!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft + 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: "smooth",
    });

    enablescrollleft = left > 0;
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(
      scrollWidth - left - clientWidth,
      enablescrollleft,
      enablescrollright
    );
  }
}

function scrollup() {
  if (window.innerWidth > ipad_size) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop - 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });

    enablescrollup = top > 10;
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    console.log(
      scrollHeight - top - clientHeight,
      enablescrolldown,
      enablescrollup
    );
    if (!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if (!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft - 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: "smooth",
    });

    enablescrollleft = left > 0;
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(
      scrollWidth - left - clientWidth,
      enablescrollleft,
      enablescrollright
    );
  }
}

ListeningMouseWheeling();

function ListeningMouseWheeling() {
  document
    .getElementById("categories")
    .addEventListener("mousewheel", MouseWheeling);
}

function MouseWheeling() {
  // console.log("MouseWheeling\n");
  if (window.innerWidth > 640) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight;

    enablescrollup = scrollTop > 10;
    enablescrolldown = scrollHeight - scrollTop > clientHeight + 10;

    // console.log(enablescrolldown, enablescrollup);
    // console.log(scrollHeight, scrollTop, clientHeight, scrollHeight - scrollTop);

    if (!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if (!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    const slider = document.getElementById("categories"),
      e = window.event;
    slider.scrollLeft += (e.deltaY / Math.abs(e.deltaY)) * 100;
  }
}

(function () {
  function scrollHorizontally(e) {
    console.log("scrollHorizontally");
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    document.getElementById("tabbtn").scrollLeft -= delta * 40; // Multiplied by 40
    e.preventDefault();
  }

  if (document.getElementById("tabbtn").addEventListener) {
    document
      .getElementById("tabbtn")
      .addEventListener("mousewheel", scrollHorizontally, false);
    document
      .getElementById("tabbtn")
      .addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    document
      .getElementById("tabbtn")
      .attachEvent("onmousewheel", scrollHorizontally);
  }
})();

(function () {
  function scrollHorizontally(e) {
    if (window.innerWidth > ipad_size) {
      return;
    }
    console.log("scrollHorizontally");
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    document.getElementById("categories").scrollLeft -= delta * 40;
    e.preventDefault();
  }

  if (document.getElementById("categories").addEventListener) {
    document
      .getElementById("categories")
      .addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    document
      .getElementById("categories")
      .addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    // IE 6/7/8
    document
      .getElementById("categories")
      .attachEvent("onmousewheel", scrollHorizontally);
  }
})();

function CloseCustomModal() {
  // console.log("adASD")
  document.getElementById("viewdetail_modal").style.display = "none";
}

function createdivforcategory(divname, containdiv, index) {
  // console.log("ASYNC EEEEEEEEEEEEEEEEEEE");
  let catediv = document.createElement("div");
  catediv.id = "category" + index;
  document.getElementById(containdiv).appendChild(catediv);
  document.getElementById(catediv.id).classList.add("category_div");
  document.getElementById(catediv.id).classList.add("image");

  // let titlediv = document.createElement('div');
  // titlediv.id = "title" + index;
  // // titlediv.innerHTML = divname + " " + index;
  // document.getElementById(catediv.id).appendChild(titlediv);
  // document.getElementById(titlediv.id).classList.add("cattitle_div");

  let buttonGroup = document.createElement("div");
  buttonGroup.id = "buttonGroup" + index;
  buttonGroup.classList.add("buttonGroup");
  document.getElementById(catediv.id).appendChild(buttonGroup);

  let imgdiv = document.createElement("div"),
    imgsrc;
  imgdiv.id = catediv.id + "_image_" + settab;

  console.log("btnnames[settab - 1]: ", btnnames[settab - 1]);

  imgsrc = IMG_URL + product_arr[btnnames[settab - 1]][index - 1];

  if(screen.width < ipad_size){
      imgdiv.innerHTML =
    "<img  class='lazy-image' src=./img/images/loading2.gif data-src=" + imgsrc +" style='height: 70%; width: 100%; object-fit: contain' onError='removeProdImg("+catediv.id+", "+index+")'>";

  }
  else{
      imgdiv.innerHTML =
    "<img  class='lazy-image' src=./img/images/loading2.gif data-src=" + imgsrc +" style='height: 65%; width: 100%; object-fit: contain' onError='removeProdImg("+catediv.id+", "+index+")'>";

  }

  document.getElementById(catediv.id).appendChild(imgdiv);
  document.getElementById(imgdiv.id).classList.add("catimg_div");
  // document.getElementById(imgdiv.id).classList.add("lazy-image");

  // Add Button Here
  let addfavdiv = document.createElement("div");
  addfavdiv.id = "addfavbtn" + index;
    let heartsvg = `<img src="img/images/NonWishlistHeart.png" class="heart"
                  id="${btnnames[settab - 1]}_addfavbtn_${index}" />
                  <img src="img/images/addToWishlist.png" style="width: 66px; height: 28px; position: absolute; top: 1px; left: -20px; display: contents;"
                  id="${btnnames[settab - 1]}_addfavbtn_${index}_hover" />`;
  document.getElementById(buttonGroup.id).appendChild(addfavdiv);
  document.getElementById(addfavdiv.id).innerHTML = heartsvg;
  document.getElementById(addfavdiv.id).classList.add("cataddfavbtn_div");
  if (isMobileDevice.iOS()) {
    document.getElementById(addfavdiv.id).classList.add("iPhoneAddBtn");
  }

  if(!isLoc_storage){
    $("#"+addfavdiv.id).css("visibility", "hidden");
  }

  $(document).ready(function () {
    $(`#${addfavdiv.id}`).hover(
      function () {
        if (is_mobile()) return;
        for (let i = 0; i < session_favorite_list.length; i++) {
          if (
            session_favorite_list[i].type === btnnames[settab - 1] &&
            session_favorite_list[i].index === index && session_favorite_list[i].imagename === product_arr[btnnames[settab-1]][index-1]
          ) {
            $(`#${btnnames[settab - 1]}_addfavbtn_${index}`).css({
              transform: "scale(1.2)",
            });
            return;
          }
        }
        $(`#${btnnames[settab - 1]}_addfavbtn_${index}_hover`).css({
          display: "block",
          transform: "scale(1.3)",
        });
        $(`#${btnnames[settab - 1]}_addfavbtn_${index}`).css({
          display: "contents",
        });
      },
      function () {
        $(`#${btnnames[settab - 1]}_addfavbtn_${index}_hover`).css({
          display: "contents",
          transform: "scale(1)",
        });
        $(`#${btnnames[settab - 1]}_addfavbtn_${index}`).css({
          display: "block",
          transform: "scale(1)",
        });
      }
    );
  });

  document.getElementById(addfavdiv.id).addEventListener("click", function () {
    let a, b;
    a = document.getElementById("favourities").children.length;
    for (let i = 0; i < a; i++) {
      let c = document.getElementById("favourities").children[i].id;
      if (imgsrc ===  $("#" + c).find("img").attr("src")) {
        b = document.getElementById("favourities").children[i].id;
      }
    }
    for (let i = 0; i < session_favorite_list.length; i++) {
      if (session_favorite_list[i].type == btnnames[settab - 1] && session_favorite_list[i].index == index && session_favorite_list[i].imagename === product_arr[btnnames[settab-1]][index-1]) {
          session_favorite_list = session_favorite_list.filter(function (item) {
            if (item.type == btnnames[settab - 1] && item.index == index && item.imagename === product_arr[btnnames[settab-1]][index-1]){
                document.getElementById(btnnames[settab - 1] + "_addfavbtn_" + index).src = "./img/images/NonWishlistHeart.png";
            }else{
              return item;
            }
          });
          //   session_favorite_list = session_favorite_list.filter(function(item) {
          //   if(item.favname != btnnames[settab - 1] + index) {
          //     return item;
          //   }

          try{
            // window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
            window.localStorage.setItem(hostname, JSON.stringify(session_favorite_list));
          }catch(e){
            //do nothing
          }
          document.getElementById(b).remove();
          // console.log("added_favorite: ", added_favorite, "\nsession_favorite_list", session_favorite_list);
        return;
      }
    }

    // let value = { type: btnnames[settab - 1], index: index };
    // added_favorite.push(value);
    $("#" + addfavdiv.id).find(`#${btnnames[settab - 1]}_addfavbtn_${index}`).attr("src", "./img/images/Heart.png");

    console.log("pushing unique id", uniqueIds[index-1]);
    let storeImgsrc = document.createElement('a');
    storeImgsrc.href = imgsrc;
    let session_value = {"imagesrc": storeImgsrc.href,
        "favname": divname + index, "setindex": settab, "index": index,
        "imagename":product_arr[btnnames[settab-1]][index-1], "type": btnnames[settab - 1],
          "uniqueId": uniqueIds[index-1] + ""};
    session_favorite_list.push(session_value);

    try{
          // window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
      window.localStorage.setItem(hostname, JSON.stringify(session_favorite_list));
      }catch(e){
      }

      // console.log("added_favorite: ", added_favorite, "\nsession_favorite_list", session_favorite_list);
      createfavlist(imgsrc, divname, settab, index);
  });

  // View Detail Button
  let viewbtndiv = document.createElement("div");
  viewbtndiv.id = "viewbtndiv" + index;
  document.getElementById(buttonGroup.id).appendChild(viewbtndiv);
  // document.getElementById(catediv.id).appendChild(viewbtndiv);
  document.getElementById(viewbtndiv.id).classList.add("viewbtndiv");
  if (isMobileDevice.iOS()) {
    document.getElementById(viewbtndiv.id).classList.add("iPhoneViewBtn");
  }

/*  if (w > ipad_size) {
    $("#" + viewbtndiv.id).css("visibility", "hidden");
  }*/

  let p = document.createElement("p");
  p.innerHTML = "View";
  document.getElementById(viewbtndiv.id).appendChild(p);
  $("#" + viewbtndiv.id).css("visibility", "hidden");


  document.getElementById(viewbtndiv.id).addEventListener("click", function () {
    document.getElementById("viewdetail_modal").style.display = "block";
    // document.getElementById("viewdetailtitle_modal").innerHTML = btnnames[settab - 1] + " " + index;
    // document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + btnnames[settab - 1] + index + '"</b>.';
    document.getElementById("viewdetailimage_modal").src = imgsrc;
  });

  ///
  // Buy Now Button
  let buybtndiv = document.createElement("div");
  buybtndiv.id = "buybtndiv" + index;
  document.getElementById(buttonGroup.id).appendChild(buybtndiv);
  document.getElementById(buybtndiv.id).classList.add("buybtndiv");

  document.getElementById(buybtndiv.id).innerHTML = `
    <img src="img/images/buynow.png" style="width: 100%; height: 100%" />
  `;

  document.getElementById(buybtndiv.id).addEventListener("click", function () {
    buy_list.push({ type: btnnames[settab - 1], index: index });
    console.log("buy:", { type: btnnames[settab - 1], index: index });
    if (btnnames[settab - 1] == "Earring") {
      console.log("prodName: ", earringImagePaths[index - 1]);
      window.parent.postMessage("buynow", "*");
    }
  });

  // img.div click event
  document.getElementById(imgdiv.id).addEventListener("click", function () {
    setNull(globselectedlist);
    cur_prod_id = index;
    prev_sel_prod = imgdiv.id;
    globselectedlist[btnnames[settab - 1]] = imgsrc;
    // console.log("", catediv.id);
    // console.log("Newly globselectedlist", globselectedlist);
    if (MODE != LIVE_MODE) {
      // console.log("yes")
      changeJewelryPrevValues();
    }
    selectedCategory(catediv.id);
    selectedfavCategory();
    mobileCaseGlobId = index;
    // document.getElementById(catediv.id).scrollIntoView();
  });

  ///
}

function setAll(obj, val) {
  Object.keys(obj).forEach(function (index) {
    obj[index] = val;
  });
}

function setNull(obj) {
  setAll(obj, null);
}

function selectedCategory(id) {
  let catnum = catenum[settab - 1];
  for (let i = 1; i <= catnum; i++) {
    try{
      // console.log("category" + i)
      if (id == "category" + i) {
        document.getElementById(id).classList.add("selectedCategory");
      } else {
        document.getElementById( "category" + i).classList.remove("selectedCategory");
      }
    }catch(e){
      //nothing
    }

  }
}

function selectedfavCategory(id) {
  let catnum = document.getElementById("favourities").children.length;
  // console.log("selectedfavCategory",catnum)

  for (let i = 1; i <= catnum; i++) {
    // try{
    document
      .getElementById("favourities")
      .children[i - 1].classList.remove("selectedCategory");
    // }catch(e){}
  }
  try {
    document.getElementById(id).classList.add("selectedCategory");
  } catch (e) {}
}

// function selectedCategory(id, ) {
//   let catnum = catenum[settab - 1];
//   console.log(id,"category1" )
//   for (let i = 1; i <= catnum; i++) {
//     // console.log("category" + i)
//     if (id == "category" + i) {
//       document.getElementById(id).classList.add("selectedCategory");
//     } else {
//       document.getElementById("category" + i).classList.remove("selectedCategory");
//     }
//   }
// }

function createfavlist(imagesrc, category, setindex, index) {
  console.log("createfavlist:category", category);
  let favdiv = document.createElement("div");
  favdiv.id = "favlist" + "_" + setindex + "_" + favlistnum;
  favdiv.style.width = "220px";
  favdiv.style.height = "130px";
  favdiv.style.borderRadius = "10px";
  favdiv.style.marginLeft = "20px";
  favdiv.style.cursor = "pointer";
  favdiv.style.marginTop = "15px";
  favdiv.style.backgroundColor = "white";
  favdiv.style.border = "1px solid rgba(0,0,0,0.1)";
  favdiv.style.position = "relative";
  /*favdiv.data-category = category;*/

  let container = document.getElementById("favourities");
  container.appendChild(favdiv);

  // console.log("asds",document.getElementById("favourities").children.length)

  // let titlediv = document.createElement("div");
  // titlediv.id = "title"+ favlistnum;
  // titlediv.style.width = "100%";
  // titlediv.style.height = "15px";
  // titlediv.style.marginLeft = "15px";
  // titlediv.style.marginTop = "10px";
  // titlediv.style.fontSize = "12px";
  // titlediv.innerHTML = favname;
  // titlediv.style.textAlign = "left";
  // document.getElementById(favdiv.id).appendChild(titlediv);

  let imgdiv = document.createElement("div");
  imgdiv.style.width = "100%";
  imgdiv.style.height = "115px";
  imgdiv.style.top = "24px";
  imgdiv.innerHTML = `<img id="img-${favdiv.id}" src="${imagesrc}" style='height: 70%;'>`;
  imgdiv.style.textAlign = "center";
  imgdiv.style.position = "absolute";
  document.getElementById(favdiv.id).appendChild(imgdiv);

  //onclick
  document.getElementById("img-" + favdiv.id).addEventListener("click", function () {
      console.log("clicked fav img: img-" + favdiv.id);
      // console.log("clicked category: ", $("#" + favdiv.id).data('category'));
      setNull(globselectedlist);
      let tempArr = imagesrc.split("/");
      let tempname = tempArr[tempArr.length-1].substring(0, tempArr[tempArr.length-1].length-4);
      tempArr = tempname.split(specialChar);
      if(tempArr.length > 2){
        globselectedlist["Necklace"] = $("#" + favdiv.id).find("img").attr("src");
      }
      else{
        globselectedlist["Earring"] = $("#" + favdiv.id).find("img").attr("src");
      }
      if (MODE != LIVE_MODE) {
      // console.log("yes")
        changeJewelryPrevValues();
      }
      selectedCategory();
      selectedfavCategory(favdiv.id);
    });

  // Remove Fav Btn
  let removefavdiv = document.createElement("div");
  removefavdiv.id = "removefavbtn" + favlistnum;
  removefavdiv.style.position = "absolute";
  removefavdiv.style.top = "2px";
  removefavdiv.style.right = "0px";
  document.getElementById(favdiv.id).appendChild(removefavdiv);
  removefavdiv.innerHTML = `
      <img src="img/images/close.png" style="width: 26px; height: 22px;"/>
    `;

  document.getElementById(removefavdiv.id).addEventListener("click", function () {
      let value = { type: btnnames[setindex - 1], index: index , imagename: product_arr[btnnames[settab-1]][index-1] };
      session_favorite_list = session_favorite_list.filter(function (item) {
        if (item.type == value.type && item.index == value.index && item.imagename == value.imagename ) {
          // console.log("remove item", value);
          if (settab == setindex) {
            console.log("remove");
            document.getElementById(item.type + "_addfavbtn_" + item.index).src = "./img/images/NonWishlistHeart.png";
          }
        } else {
          return item;
        }
      });

    try{
        // window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
        window.localStorage.setItem(hostname, JSON.stringify(session_favorite_list));
      }catch(e){
      }

      document.getElementById(favdiv.id).remove();


    });

  // Buy Now Fav Button
  let buybtnfavdiv = document.createElement("div");
  buybtnfavdiv.id = "buybtnfavdiv" + favlistnum;
  document.getElementById(favdiv.id).appendChild(buybtnfavdiv);
  document.getElementById(buybtnfavdiv.id).classList.add("buybtnfavdiv");
  // buybtnfavdiv.style.marginLeft = "175px";
  buybtnfavdiv.innerHTML = `
    <img src="img/images/buynow.png" style="width: 100%; height: 100%" />
  `;

  document
    .getElementById(buybtnfavdiv.id)
    .addEventListener("click", function () {
      buy_list.push({ type: btnnames[setindex - 1], index: index });
      console.log("buy parm imgsrc:", imagesrc);
      console.log("index parm imgsrc:", index-1);
      // console.log("buynow uniqueId:", session_favorite_list[index-1].uniqueId);
      console.log("Length sess:", session_favorite_list.length);
      // console.log("buynow sess src:", session_favorite_list[index-1].imagesrc);
      // console.log("buynow uniqueId:", session_favorite_list[index-1].uniqueId);
      // window.open("https://psylishera.myshopify.com/cart/add?id="+
      //   session_favorite_list[index-1].uniqueId, "_blank");
    });

  // View Detail Fav Button
  let viewbtnfavdiv = document.createElement("div");
  viewbtnfavdiv.id = "viewbtnfavdiv" + favlistnum;
  document.getElementById(favdiv.id).appendChild(viewbtnfavdiv);
  document.getElementById(viewbtnfavdiv.id).classList.add("viewbtnfavdiv");
  // viewbtnfavdiv.style.marginLeft = isMobileDevice.iOS() ? "210px" : "210px";
  let p = document.createElement("p");
  p.innerHTML = "View";
  document.getElementById(viewbtnfavdiv.id).appendChild(p);
  $("#" + viewbtnfavdiv.id).css("visibility", "hidden");

  document
    .getElementById(viewbtnfavdiv.id)
    .addEventListener("click", function () {
      document.getElementById("viewdetail_modal").style.display = "block";
      // document.getElementById("viewdetailtitle_modal").innerHTML = favname;
      // document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + favname + '"</b>.';
      document.getElementById("viewdetailimage_modal").src = imagesrc;
    });

  favlistnum++;

  if (image_map.get(imagesrc) == undefined) {
    getBase64Image_util(imagesrc, function (base64image) {
      let tempArr = imagesrc.split("/");
      image_map.set(tempArr[tempArr.length-1], base64image);
    });

    if (imagesrc.split(specialChar).length > 3) {
      let arr = imagesrc.split(specialChar);
      let img_name = arr.slice(3, 5).join(specialChar);
      let new_img = IMG_URL + img_name;
      getBase64Image_util(new_img, function (base64image) {
        image_map.set(img_name, base64image);
      });
    }
  }
}

checkSession();

async function checkSession() {
  try{
    // added_favorite = JSON.parse(window.localStorage.getItem("added_favorite")) || [];
    session_favorite_list = JSON.parse(window.localStorage.getItem(hostname)) || [];
  }catch(e){
    isLoc_storage = false;

    $(".Wishlist").css("visibility", "hidden");
  }
  // console.log("Current_Session: \n", added_favorite, session_favorite_list);

  if(session_favorite_list.length) {
    for(let i = 0; i < session_favorite_list.length; i++) {
      let imagesrc = session_favorite_list[i].imagesrc,
          favname = session_favorite_list[i].favname,
          setindex = session_favorite_list[i].setindex,
          index = session_favorite_list[i].index,
          imgename = session_favorite_list[i].imagename;
       if(isCheckValidImage(imagesrc,imgename))
        createfavlist(imagesrc, favname, setindex, index);
    }
  }

}

function isCheckValidImage(imagesrc,imgename){
  try{
    let parser = document.createElement('a');
    parser.href = imagesrc;
    let isMatched = false;
    if(window.location.href.indexOf(parser.host)> -1){
      //for (var key in product_arr){
        /* if(product_arr[key].length != 0 ){
           for (let i=0; i< product_arr[key].length; i++){
              if(imgename.trim() == product_arr[key][i].trim()){
                isMatched = true;
                break;
              }
            }
         }*/
      //}
     // return isMatched;
     return true;
    }
    else{
      return false;
    }

  }catch(e){
    return false;
  }
}

function isCheckValidImage_ProdList(imagesrc,imgename){
  try{
    let parser = document.createElement('a');
    parser.href = imagesrc;
    let isMatched = false;
    if(window.location.href.indexOf(parser.host)> -1){
      for (var key in product_arr){
         if(product_arr[key].length != 0 ){
           for (let i=0; i< product_arr[key].length; i++){
              if(imgename.trim() == product_arr[key][i].trim()){
                isMatched = true;
                break;
              }
            }
         }
      }
      return isMatched;
    }
    return isMatched;

  }catch(e){
    return false;
  }
}

function setColorbtn(index) {
  // cur_cat_id = index;
  console.log("setTab");
  settab = index;
  for (let i = 1; i <= btnnames.length; i++) {
    if (i == index) {
      document.getElementById("btn" + i).classList.add("active");
      document.getElementById("actTxt" + i).classList.add("active-tab-text");
      document.getElementById("tab" + i).style.color = "black";
    } else {
      document.getElementById("btn" + i).classList.remove("active");
      document.getElementById("actTxt" + i).classList.remove("active-tab-text");
      document.getElementById("tab" + i).style.color = "dimgrey";
    }
  }
  document
    .getElementById("btn" + index)
    .scrollIntoView(window.innerWidth > ipad_size ? { inline: "center" } : "");
  document.getElementById("categories").innerHTML = "";
  // createdivforcategory(btnnames[settab - 1], "categories", j);
  for (let j = 1; j <= catenum[settab - 1]; j++) {
    createdivforcategory(btnnames[settab - 1], "categories", j);
    document.getElementById(btnnames[settab - 1] + "_addfavbtn_" + j).src = "./img/images/NonWishlistHeart.png";
    // classList.remove("heart_added_favourite");
    for (let k = 0; k < session_favorite_list.length; k++) {
        let item = session_favorite_list[k];
        // console.log(item.imagename ,"===check====", product_arr[btnnames[settab-1]][index-1]);
      if (item.type == btnnames[settab - 1] && item.index == j ) {
        let imagesrc = item.imagesrc,
            favname = item.favname,
            setindex = item.setindex,
            index = item.index,
            imgename = item.imagename;
            if(isCheckValidImage_ProdList(imagesrc,imgename))
              document.getElementById(item.type + "_addfavbtn_" + item.index).src = "./img/images/Heart.png";
        // classList.add("heart_added_favourite");
        }
      }
  }
  if (prev_sel_prod) {
    try {
      document.getElementById(prev_sel_prod).click();
    } catch (e) {}
  }
  //lazy laoding call
  mainLazyChange();
  // lazyChange();
  if(is_mobile()) {
    (expandKey) ? MobileInitCaseCustomize_remove(index) : MobileInitCaseCustomize(index);
    mobileCaseGlobId = null;
  }
}

function is_mobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  }
  return false;
}

function consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm) {
  console.log("zoomRate", zoomRate);
  console.log("cntW", cntW, "\ncntH", cntH);
  console.log("margin", marginleft, margintop);
  console.log("cntZm", cntZm);
}

$(window).resize(function () {
  console.log("hwew");
  let cntW = window.innerWidth,
    cntH = window.innerHeight;
  zoomRate = is_mobile() ? 1 : window.devicePixelRatio / globalPixelRatio;

  let imgsrc =
    cntW > ipad_size ? "img/images/loaddown.png" : "img/images/loaddown.png";
  document.getElementById("loadmorediv").innerHTML =
    "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";
  imgsrc = cntW > ipad_size ? "img/images/loadup.png" : "img/images/loadup.png";
  document.getElementById("loadupdiv").innerHTML =
    "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";

  if (cntW > ipad_size) {
    let cntZm = ((cntW * initRatioForPopupSize) / 963) * 100;
    if ((cntZm * 487) / 100 > cntH) {
      cntZm = ((cntH * initRatioForPopupSize) / 487) * 100;
    }
    initialCategories();
    show("loadmorediv");
    show("loadupdiv");

    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "520px";
    document.getElementById("category").style.top = "0px";
    document.getElementById("category").style.height = "480px";
    document.getElementById("categories").style.height = "400px";
    document.getElementById("maincamera").style.height = "480px";
    document.getElementById("favorite").style.height = "480px";
    document.getElementById("favourities").style.height = "438px";
    // document.getElementById("category_title").innerHTML = "Categories";

    if (cntBrowser == "firefox") {
      let marginleft = (cntW - 963) / 2 + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      let margintop = (cntH - 487) / 2 + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${
        (cntZm * zoomRate) / 100
      })`;
    } else {
      let margintop =
        ((cntH - (487 * cntZm * zoomRate) / 100) / 2) *
          (100 / cntZm / zoomRate) +
        "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      let marginleft =
        ((cntW - (963 * cntZm * zoomRate) / 100) / 2) *
          (100 / cntZm / zoomRate) +
        "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    }

    document.getElementById("categories").style.display = "block";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "13px";
    document.getElementById("upload_livebtn").style.bottom = "16px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    global_media_height = 480;

    // show("small_words");

    if (isMobileDevice.iOS()) {
      // smallWords.style.marginLeft = "6px";
      // smallWords.style.fontSize = "6px";
      document
        .getElementById("category_title")
        .classList.add("iPhoneCategoryTitle");
    } else {
      // smallWords.style.marginLeft = "6px";
    }
    show("needhelp");
    // consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm);
  } else {
    let cntZm = ((cntW * 0.96) / 642) * 100,
      camH = ((cntH * 0.96) / cntZm) * 100;

    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top =
      hideCategoryKey == 0 ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("category").style.height =
      hideCategoryKey == 0 ? "301px" : "100px";

    document.getElementById("categories").style.height =
      hideCategoryKey == 0 ? "201px" : "2px";
    document.getElementById("categories").style.display = "flex";

    document.getElementById("maincamera").style.height =
      camH - 101 + borderRadius + "px";
    document.getElementById("favorite").style.height =
      hideCategoryKey == 0 ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("favourities").style.height =
      hideCategoryKey == 0 ? camH - 341 + "px" : camH - 141 + "px";
    document.getElementById("category_title").innerHTML =
      hideCategoryKey == 0 ? loadclickdown : loadclickup;

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    // Capture position change

    if (parseInt(document.getElementById("category").style.height) > 300) {
      hide("loadmorediv");
      show("loadupdiv");
      //document.getElementById("pentagon").style.bottom = "250px";
      //document.getElementById("menu").style.bottom = "250px";
      //document.getElementById("upload_livebtn").style.bottom = "250px";
     // document.getElementById("flipCamera").style.bottom = "240px";
    }
    if (parseInt(document.getElementById("category").style.height) < 300) {
      hide("loadmorediv");
      show("loadupdiv");
      //document.getElementById("pentagon").style.bottom = "250px";
      //document.getElementById("menu").style.bottom = "250px";
      //document.getElementById("upload_livebtn").style.bottom = "250px";
      //document.getElementById("flipCamera").style.bottom = "240px";
    }

    // if(is_mobile()) {
    //   document.getElementById("upload_livebtn").style.left = "120px";
    // } else {
    //   document.getElementById("upload_livebtn").style.left = "20px";
    // }

    if (cntBrowser == "firefox") {
      // let marginleft = ((cntW - 642) / 2) + "px";
      let marginleft = 0 + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // let margintop = ((cntH - camH) / 2) + "px";
      let margintop = 0 + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${
        (cntZm * zoomRate * 1.04) / 100
      })`; //`scale(${(cntZm*zoomRate/100)})`;
    } else {
      // let margintop = ((cntH - camH * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      let margintop = 0 + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      // let marginleft = ((cntW - 642 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      let marginleft = 0 + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom =
        cntZm * zoomRate * 1.04 + "%";
    }

    global_media_height = camH - 101 + borderRadius;

    // show("small_words");

    if (isMobileDevice.iOS()) {
      // smallWords.style.marginLeft = "105px";
      // smallWords.style.fontSize = "9px";
      document
        .getElementById("category_title")
        .classList.remove("iPhoneCategoryTitle");
    } else {
      // smallWords.style.marginLeft = "250px";
    }
    hide("needhelp");
  }
});

function hidefavorite() {
  hide("favorite");
  // document.getElementById("flipCamera").style.left = "22px";
  if(is_mobile()) {
    if (MODE == LIVE_MODE){
      show("flipCamera");
    }
    show("brandlogo");


  }
}

function showfavorite() {
  show("favorite");
  // document.getElementById("flipCamera").style.left = "335px";
  if(is_mobile()) {
    hide("flipCamera");
    hide("brandlogo");
  }
}

function showPentagon() {
  // if(!isModelLoaded){
  //   return
  // }
  show("pentagon");
  hide("menu");
  hide("upload_livebtn");

  if(is_mobile()) {
    document.getElementById("flipCamera").style.left = "47%";
    //hide("mobile-init-buynow");
    hide("flipCamera");
  }
  if(!is_mobile()) {
    hide("flipCamera");
    hide("shareBtn2");
  }
  /*document.getElementById("flipCamera").innerHTML = `
    <img class="new-buynow" src="img/images/buynow-new_old.png" onclick="onBuyNowCurrentProduct()"/>
  `;*/
  captureSnapshot();
}

function hidePentagon() {
  hide("pentagon");
  show("menu");
  show("upload_livebtn");

  if(is_mobile()) {
    document.getElementById("flipCamera").style.left = "22px";
   // show("mobile-init-buynow");
    show("flipCamera");
  }
  if(!is_mobile()) {
    hide("flipCamera");
    show("shareBtn2");
  }
  document.getElementById("flipCamera").innerHTML = `
    <img style="width: 100%; height: 100%;" src="img/images/flipCamera.png" onclick="flipCamera()"/>
  `;
  removeSnapshot();
}

function onBuyNowCurrentProduct() {
    console.log("onBuyNowCurrentProduct entered");
        let imagename, index;
      if(globselectedlist["NecklaceSet"] != null){
          imagename = globselectedlist["NecklaceSet"]
           tempArr = imagename.split("/");
          imagename = tempArr[3].substring(0, tempArr[3].length-4);
           index = searchStringInArray(tempArr[3], necklaceSetImagePaths);
          console.log("imagename:"+imagename+" index:"+index);
          /*if(screen.width < winsize){
            let url = "https://devijewellers.lk/camweara/index.php?imgs=" + imagename;
              enquireOnWhatsapp(url);
           }
           else{
                window.open(necklaceUrlArray[index], '_blank');
           }*/
      }
      else if(globselectedlist["Earring"] != null ){
          imagename = globselectedlist["Earring"];
          tempArr = imagename.split("/");
          imagename = tempArr[tempArr.length-1].substring(0, tempArr[tempArr.length-1].length-4);
          index = searchStringInArray(tempArr[tempArr.length-1], earringImagePaths);
          console.log("imagename:"+imagename+" index:"+index);

      }
      else if(globselectedlist["Necklace"] != null){
          imagename = globselectedlist["Necklace"];
          tempArr = imagename.split("/");
          imagename = tempArr[tempArr.length-1].substring(0, tempArr[tempArr.length-1].length-4);
          index = searchStringInArray(tempArr[tempArr.length-1], necklaceImagePaths);

      }else if(globselectedlist["Nosering"] != null ){
          imagename = globselectedlist["Nosering"];
          imagename = tempArr[tempArr.length-1].substring(0, tempArr[tempArr.length-1].length-4);
          index = searchStringInArray(tempArr[tempArr.length-1], necklaceImagePaths);
          console.log("imagename:"+imagename+" index:"+index);
      }else if(globselectedlist["Tikka"] != null ){
          imagename = globselectedlist["Tikka"];
          imagename = tempArr[3].substring(0, tempArr[3].length-4);
          index = searchStringInArray(tempArr[3], necklaceImagePaths);
          console.log("imagename:"+imagename+" index:"+index);
      }
      else if(globselectedlist["Pendant"] != null){
          imagename = globselectedlist["Pendant"];
          imagename = tempArr[3].substring(0, tempArr[3].length-4);
          index = searchStringInArray(tempArr[3], necklaceImagePaths);
          console.log("imagename:"+imagename+" index:"+index);
      }

}

function searchStringInArray (str, arr){
  for (var j=0; j<arr.length; j++)
  {
    if (arr[j].match(str)) return j;
  }
  return -1;
}

function onNextClick() {
  console.log("onNextClick");
  if (cur_prod_id == catenum[settab - 1]) {
    cur_prod_id = 1;
  } else {
    cur_prod_id = cur_prod_id + 1;
  }

  let change_prod = document.getElementById(
    "category" + cur_prod_id + "_image_" + settab
  );
  change_prod.click();
}

function onPrevClick() {
  console.log("onprevClick");

  if (cur_prod_id == 1) {
    cur_prod_id = catenum[settab - 1];
  } else {
    cur_prod_id = cur_prod_id - 1;
  }

  let change_prod = document.getElementById(
    "category" + cur_prod_id + "_image_" + settab
  );
  change_prod.click();
}

let sliders = ["categories", "tabbtn", "favourities"];

for (let i = 0; i < 3; i++) {
  const slider = document.getElementById(sliders[i]);
  let isDown = false;
  let startX, startY;
  let scrollLeft, scrollTop;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    startY = e.pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 10;
    slider.scrollLeft = scrollLeft - walk;
    if ((i == 2 || window.innerWidth > ipad_size || expandKey) && i != 1) {
      const y = e.pageY - slider.offsetTop;
      const walkY = (y - startY) * 10;
      slider.scrollTop = scrollTop - walkY;
      if(!is_mobile() && window.innerWidth > 1024) {
        if (slider.scrollTop < 10) {
          hide("loadupdiv");
        } else {
          show("loadupdiv");
        }
        if (slider.scrollHeight - slider.scrollTop > slider.clientHeight + 10) {
          show("loadmorediv");
        } else {
          hide("loadmorediv");
        }
      }
    }
  });
}

function categoriesScrollWheeling(e) {
  e.preventDefault();

  const slider = document.getElementById("categories");
  slider.scrollTop += (e.deltaY / Math.abs(e.deltaY)) * 100;
  slider.scrollLeft += (e.deltaY / Math.abs(e.deltaY)) * 100;
}

for (let i = 0; i < 3; i++) {
  let slider = document.getElementById(sliders[i]),
    isTouch = false,
    startX,
    scrollLeft,
    startY,
    scrollTop;
  slider.addEventListener("touchstart", (e) => {
    // console.log("touch start", e.changedTouches[0].pageX);
    isTouch = true;
    slider.classList.add("active");
    startX = e.changedTouches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    startY = e.changedTouches[0].pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener("touchcancel", () => {
    // console.log("touch cancel");
    isTouch = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("touchmove", (e) => {
    // console.log("touch move");
    if (!isTouch) return;
    e.preventDefault();
    const x = e.changedTouches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;

    if ((i == 2 || window.innerWidth > ipad_size || expandKey) && i != 1) {
      const y = e.changedTouches[0].pageY - slider.offsetTop;
      const walkY = (y - startY) * 2;
      slider.scrollTop = scrollTop - walkY;

      if(!is_mobile() && window.innerWidth > 1024) {
        if (slider.scrollTop < 10) {
          hide("loadupdiv");
        } else {
          show("loadupdiv");
        }
        if (slider.scrollHeight - slider.scrollTop > slider.clientHeight + 10) {
          show("loadmorediv");
        } else {
          hide("loadmorediv");
        }
      }
    }
  });
}

function checkBrowser() {
  // Opera
	var sBrowser, sUsrAg = navigator.userAgent;

  // Firefox
	if (sUsrAg.indexOf("Firefox") > -1) {
	  sBrowser = "firefox";
	} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
	  sBrowser = "Samsung Internet";
	} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
	  sBrowser = "opera";
	} else if (sUsrAg.indexOf("Trident") > -1) {
	  sBrowser = "IE";
	} else if (sUsrAg.indexOf("Edge") > -1) {
	  sBrowser = "Edge";
	} else if (sUsrAg.indexOf("Chrome") > -1) {
	  sBrowser = "chrome";
	} else if (sUsrAg.indexOf("Safari") > -1) {
	  sBrowser = "safari";
  // Safari
			let navUserAgent = navigator.userAgent;
			let browserName  = navigator.appName;
			var safariVersion  = ''+parseFloat(navigator.appVersion);
			let tempVersionOffset,tempVersion;

			if ((tempVersionOffset=navUserAgent.indexOf("Safari"))!=-1) {
    safariVersion = navUserAgent.substring(tempVersionOffset+7);
			 if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1)
      safariVersion = navUserAgent.substring(tempVersionOffset+8);
			}
			if ((tempVersion=safariVersion.indexOf(";"))!=-1)
			   safariVersion=safariVersion.substring(0,tempVersion);
			if ((tempVersion=safariVersion.indexOf(" "))!=-1)
			   safariVersion=safariVersion.substring(0,tempVersion);
			if(parseFloat(safariVersion) < 13){
        isSafar12 = true;
      }
			//alert("isSafar12 = " + isSafar12);

	} else {
	  sBrowser = "unknown";
  }

  // Internet Explorer
	if(sBrowser != null && sBrowser != "unknown"){
  // Edge 20+
		return sBrowser;
  // Chrome
	}else{
  // Edge (based on chromium) detection

  // Blink engine detection

  return "noneBrowser";
	}
}

// alert("safari=="+cntBrowser)
init();

$(document).ready(function () {
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")

  // pro_arr = [
  //   "Please Wait..",
  //   "Please maintain good light..",
  //   "You are one step away!!",
  // ];
  // var i = 0;
  // setInterval(function () {
  //   // console.log("dddddddddddddddddddd")
  //   var txt = pro_arr[i++];
  //   $("#process_txt").text(txt);
  //   $("#process_txt").hide(txt);
  //   $("#process_txt").fadeIn("slow");
  //   if (i >= pro_arr.length) i = 0;
  // }, 5000);
});

function removeProdImg(prodId, index){
  // $( "#"+prodId.id).remove();
    try{
      // if(document.getElementById(prodId.id).classList.contains("selectedCategory")){
      //   document.getElementById("category"+index+1).classList.add("selectedCategory")
      // }
      $( "#"+prodId.id).remove();
    }catch(e){
      //nothing
    }
}


function MobileInitCaseCustomize(settabnum) {
  for (let i = 1; i <= catenum[settabnum-1]; i++) {
    document.getElementById("buttonGroup" + i).classList.add("visible-hide");
    document.getElementById("category" + i).classList.add("mobile-init-category");
    document.getElementById("category" + i + "_image_" + settabnum).classList.add("mobile-init-cate-image-div");
  }
  if(!globalCapturedStatus){
	  //alert("cc"+globalCapturedStatus);
	  //show("mobile-init-buynow");
  }

}


function MobileInitCaseAlignCustomize() {
  document.getElementById("category").style.top = camH - 235 + "px";
  document.getElementById("category").style.height = "235px";
  document.getElementById("categories").style.height = "135px";
  document.getElementById("categories").style.borderBottom = "none";
  document.getElementById("menu").style.bottom = "240px";
  document.getElementById("upload_livebtn").style.bottom = "240px";
  document.getElementById("uploadbtn").style.bottom = "236px";
  document.getElementById("download_bttn_up").style.bottom = "290px";
  document.getElementById("flipCamera").style.bottom = "240px";
  document.getElementById("pentagon").style.bottom = "240px";
  document.getElementById("viewDetailsMobile").style.bottom = "240px";
  document.getElementById("loadmorediv").style.display = "block!important";
}


function MobileInitCaseCustomize_remove(settabnum) {
  for (let i = 1; i <= catenum[settabnum-1]; i++) {
    document.getElementById("buttonGroup" + i).classList.remove("visible-hide");
    document.getElementById("category" + i).classList.remove("mobile-init-category");
    document.getElementById("category" + i + "_image_" + settabnum).classList.remove("mobile-init-cate-image-div");
  }

  // hide("mobile-init-buynow");
}


function MobileHideCaseAlignCustomize() {
  document.getElementById("viewDetailsMobile").style.bottom = "105px";
  document.getElementById("menu").style.bottom = "105px";
  document.getElementById("upload_livebtn").style.bottom = "105px";
  document.getElementById("uploadbtn").style.bottom = "101px";
  document.getElementById("download_bttn_up").style.bottom = "155px";
  document.getElementById("flipCamera").style.bottom = "105px";
  document.getElementById("pentagon").style.bottom = "110px";
}


function MobileInitCaseBuyNow() {

  if(!mobileCaseGlobId) {
    console.log("Please select one item before click 'buynow'");
  } else {
    console.log("buy:", { type: btnnames[settab - 1], index: mobileCaseGlobId });
  }
}

function UpdateRunTime() {
  let alignSliderArrow = setInterval(function() {
    let catHeight = parseInt(document.getElementById("category").style.height);
    if (catHeight < 120) {
      hide("loadmorediv");
      show("loadupdiv");
    } else if(catHeight < 250) {
      show("loadmorediv");
      show("loadupdiv");
    } else {
      show("loadmorediv");
      hide("loadupdiv");
    }
  }, 100);
}

if(is_mobile()) {
  UpdateRunTime();
}
