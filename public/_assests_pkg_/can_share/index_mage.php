<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function debug_to_console( $data ) {
  $output = $data;
  if ( is_array( $output ) )
  $output = implode( ',', $output);
  echo "<script>console.log( '" . $output . "' );</script>";
}

//to show the instruction popup only first four times
$cookie_name = "CAMWEARA_COOKIE1";
$camweara_visit_count = 0;
if(!isset($_COOKIE[$cookie_name])) {
  $cookie_value = 1;
  setcookie($cookie_name, $cookie_value, time() + (86400 * 100));
  $camweara_visit_count = 1;
} else {
  setcookie($cookie_name, ++$_COOKIE[$cookie_name], time() + (86400 * 100));
  $camweara_visit_count = $_COOKIE[$cookie_name];
  debug_to_console("camweara_visit_count: ".$camweara_visit_count);
}

require_once '../../app/Mage.php';
Mage::app(); 

$prodIds = []; 
$prodSKUs = []; 
$prodURLs = []; 
$prodImagePaths = [];
$earringHeightsMM = []; 
$prodNames = [];
$prodCosts = []; 
$prodCats = []; 
$productCategory = "Necklaces";
$earringImagePaths = [];
$necklaceImagePaths = [];
$pendantImagePaths = [];
$indexesToRemove = [];
$prodPrices = [];
$necklaceSkus = [];
$earringSkus = [];
$pendantSkus = [];

$product_sku = $_GET['sku'];
  $product = Mage::getModel('catalog/product')->loadByAttribute('sku', $product_sku);
  if($product){
    if($product->getId()){
    }
    else{
      debug_to_console("product doesn't exist");
      echo "This product doesn't exist";
      exit;
    }
  }else{
     debug_to_console("product doesn't exists");
     echo "This product doesn't exist";
     exit;
  }
  $productHeight = $product->getData('height');
  $productCategory = $product->getAttributeText('candere_product_type');
  $product_id = $product->getId();
  array_push($prodIds, $product_id);
  array_push($prodSKUs, $product_sku);
  array_push($prodURLs, $product->getProductUrl());
  array_push($prodNames, $product->getName());
  array_push($prodPrices, $product->getPrice());
  /* for related product api*/
  $a=Mage::helper('all/apitagalys')->getSimilarProductsDetails($product_id);
  //$num = 0;
  foreach ($a['data']['results'] as $key => $pdt_id) {
      $model_rel = Mage::getModel('catalog/product'); //getting product model
      $_product_rel = $model_rel->load($pdt_id);
      $sku_rel_product = $_product_rel->getSku();
      array_push($prodIds, $pdt_id);
      array_push($prodSKUs, $sku_rel_product);
      array_push($prodURLs, $_product_rel->getProductUrl());
      array_push($prodNames, $_product_rel->getName());
  }

  //mysql query to get imagepath
  require "./comm/db/connect_db_read.php";

  for ($num = 0; $num <count($prodSKUs); $num++) {
      $sqlCommand = 'SELECT * FROM camweara_table WHERE sku="'.$prodSKUs[$num].'"';
      $results = $connection->query($sqlCommand);
      $_product_rel = $model_rel->load($prodIds[$num]);
      $sku_rel_product = $_product_rel->getSku();
      $productCategory = $_product_rel->getAttributeText('candere_product_type');
      if($row = $results->fetch()){
          if(strcmp($productCategory, "Necklaces") == 0){
            $imagepath = $row['imagepath'];
            array_push($necklaceImagePaths, $imagepath);
            array_push($prodImagePaths, $imagepath);
            array_push($prodCats, 0);
            array_push($necklaceSkus, $prodSKUs[$num]);
          }
          elseif(strcmp($productCategory, "Pendants") == 0){
            $imagepath = $row['imagepath'];
            array_push($pendantImagePaths, $imagepath);
            array_push($prodImagePaths, $imagepath);
            array_push($prodCats, 1);
            array_push($pendantSkus, $prodSKUs[$num]);
          }
          elseif (strcmp($productCategory, "Earrings") == 0){
              $imagepath = $row['imagepath']; 
              array_push($earringImagePaths, $imagepath);
              array_push($prodImagePaths, $imagepath);
              array_push($prodCats, 2);
              array_push($earringSkus, $prodSKUs[$num]);
              $height = $_product_rel->getData('height');
              if($height < 15) $height = 15;
              array_push($earringHeightsMM,  $height);
          }
          else{
            debug_to_console("other category");
            continue;
          }
          
      }
      else{
          debug_to_console("imagepath not found num: ".$num." sku: ".$prodSKUs[$num]);
          array_push($indexesToRemove, $num);
      }
      /*if(sizeof($prodImagePaths) > 6){
        break;
      }*/
  }

  foreach ($indexesToRemove as $key => $index) {
    $prodSKUs[$index] = "undefined";
    $prodIds[$index] = "undefined";
    $prodURLs[$index] = "undefined";
  }

  if(sizeof($prodImagePaths) < 1){
   // debug_to_console("product doesn't exist");
    echo "This product doesn't exist";
    exit;
  }

$productCategory = $prodCats[0];

?>
<!-- // *
// * Copyright 2020 Modaka Technologies ( https://modakatech.com )
// *
// * you are not use this file except in compliance with the License.
// * This file is used only for testing and none else can use any part of this code without agreement from Modaka Technologies.
// * Unless required by applicable law or agreed to in writing, software
// * See the License for the specific language governing permissions and
// * limitations under the License.
 -->
 <!DOCTYPE html>
 <html>
   <head>
     <title>CamWeara - Jewelry Virtual Try On || Jewellery Tryon</title>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <link rel="stylesheet" href="css/tryon7.css" />
     <link rel="stylesheet" href="css/pentagon.css" />
     <link rel="stylesheet" href="css/lazy.css" />
     <link rel="stylesheet" href="css/bootstrap.min.css"/>
     <link rel="icon" href="img/images/logo.png" type="image/x-icon" />
     <script src="js/ext/jquery-3.3.0.min.js"></script>
     <script src="js/ext/bootstrap.min.js"></script>
   </head>
   <body oncontextmenu="return false;">
     <div class="body" id="body">
       <div class="camera_div modal fade " id="camera_div" role="dialog">
         <div class="loadingAnim" id="loadingAnim">
           <div id="utm_newsletter_spinner123" class="spinner-main-wrap">
             <div class="text-primary" style="color: #fff;">
               <span id="process_txt">Please wait</span>
             </div>
             <div class="spinner1">
               <div class="rect1"></div>
               <div class="rect2"></div>
               <div class="rect3"></div>
               <div class="rect4"></div>
               <div class="rect5"></div>
             </div>
           </div>
         </div>
         <!-- <div class="loader">Loading...</div> -->
         <div class="maincamera" id="maincamera">
          <div id="videodiv">
              <video id="inputVideo" autoplay="true" playsinline muted crossorigin="Anonymous"></video>
          </div>
           <div class="canvascontainer " id="canvascontainer">
             <canvas
               id="overlayVideo"
             ></canvas>
             <canvas
               id="overlay"
             ></canvas>
             <canvas id="overlay2" class="animated"></canvas>
             <canvas id="overlay3" class="animated"></canvas>
           </div>
           
           <p
             id="nonecamera"
             class="hide"
             style="
               position: absolute;
               top: 45%;
               left: 6%;
               font-size: 18px;
               color: grey;
               font-weight: bolder;
             "
           >
             Face could not be detected,<br />
             Please make sure your eyes, mouth and ears are clearly visible.
           </p>
           <div class="Wishlist" onclick="showfavorite()">
             <img
               class="favourite_heart"
               viewBox="0 0 32 29.6"
               src="./img/images/Heart.png"
             />
           </div>
           <div class="share_bttn_on hide" id="share_bttn_on" onclick="onShareClick()">
             <img
               style="width: 100%; height: 100%;"
               src="img/images/share_on.png"
             />
           </div>

           <div
             id="logo"
             class="hide"
             style="
               width: 120px;
               height: 50px;
               position: absolute;
               left: 10px;
               top: 10px;
               cursor: pointer;
               z-index: 5;
             "
           >
             <img
               crossorigin="Anonymous"
               style="width: 100%; height: 100%;"
               id="logoimg"
               src="img/images/logo.png"
               alt="The Scream"
             />
           </div>
           <div id="pentagon" class="hide">
             <div id="download_bttn" onclick="downSnapshot()">
               <img
                 style="width: 100%; height: 100%;"
                 src="img/images/download1.png"
               />
             </div>
             <div id="share_bttn" onclick="onShareClick()">
               <img
                 style="width: 100%; height: 100%;"
                 src="img/images/share2.png"
               />
             </div>
             <div id="back" onclick="hidePentagon()">
               <img
                 style="width: 100%; height: 100%;"
                 src="img/images/back2.png"
               />
             </div>
           </div>
           <div id="menu" class="show" onclick="showPentagon()">
             <img
               style="width: 100%; height: 100%;"
               src="img/images/camera.png"
             />
           </div>
           <div
             id="flipCamera"
             class="hide"
           >
             <img
               style="width: 100%; height: 100%;"
               src="img/images/flipCamera.png"
               onclick="flipCamera()"
             />
           </div>
           <input
             type="file"
             id="fileUpload"
             onchange="readURL(this);"
             style="display: none;"
             accept="image/jpg, image/jpeg, image/png"
           />
           <div id="upload_livebtn" class="show" onclick="upload_live()">
            <img style="width: 100%; height: 100%;" src="img/images/upload.png">
          </div>
          <div id = "img_upload" class="hide">
            <div id= "download_bttn_up" title="Download"
                 onclick="downSnapshot()" >
              <img style="width: 100%; height: 100%;" src="img/images/Download.png">
            </div>
            <div id="uploadbtn" title="Upload Pic" onclick="onRetriveUpload()">
              <img style="width: 100%; height: 100%;" src="img/images/video-new.png">
            </div>
          </div>

           <div id="mobile-init-buynow" class="hide" onclick="onBuyNowCurrentProduct()">
		           <img class="mobile-init-buynow-class" src="img/images/buynow-new.png" />
          </div>
         </div>
         <div class="favourite hide" id="favorite">
           <div
             style="
               width: 100%;
               height: 40px;
               text-align: center;
               border: 1px solid rgba(0, 0, 0, 0.1);
               background-color: rgb(242, 242, 242);
               border-radius: 0 20px 0 0;
             "
           >
             <img
               src="img/images/wishlist_new.png"
               style="width: 35%; margin-top: 0px;"
             />
             <div
               style="
                 width: 25px;
                 height: 25px;
                 position: absolute;
                 right: 5px;
                 top: 6px;
                 cursor: pointer;
               "
               onclick="hidefavorite()"
             >
               <img
                 style="width: 100%; height: 100%;"
                 src="img/images/close.png"
               />
             </div>
           </div>
           <div class="favourities" id="favourities"></div>
         </div>
         <div class="category" id="category">
           <div class="tab" id="tab">
             <div id = "tempdiv" class="show" 
               style="
                 width: fit-content;
                 height: 59px;
                 text-align: left;
                 margin-top: -20px;
                 cursor: pointer;
                 display: flex;
               "
              >
               <h3 id="category_title" onclick="SwipeToggle()"></h3>
               <div
                 id="brandlogo"
               >
                 <img
                   crossorigin="Anonymous"
                   style="width: 100%; height: 100%;"
                   id="logoimg"
                   src="img/images/logo.png"
                   alt="The Scream"
                 />
               </div>
             </div>
             <div class="tabbtn" id="tabbtn">
               <ul class="nav nav-tabs" style="display: flex; border-bottom: none; margin-bottom: 1px; align-items: center;">
                
               </ul>
             </div>
           </div>
           <div class="categories gallery" id="categories"></div>
           <div class="needhelp" id="needhelp">

           <img
             src="./img/images/camweara1.png"
             style="width: 40%; margin-top: 5px;"
           />
         </div>
         </div>
         <div class="Close" onclick="onBackClick()">
           <img style="width: 100%; height: 100%;" src="img/images/close.png" />
         </div>
         <!-- <div class="needhelp" id="needhelp">

           <img
             src="./img/images/camweara1.png"
             style="width: 100%; margin-top: 0em;"
           />
         </div> -->
       </div>
     
       <div id="viewdetail_modal" class="customizedModal">
         <div class="customizedModal-content">
           <span class="customClose" onclick="CloseCustomModal()">&times;</span>
           <h4 id="viewdetailtitle_modal"></h4>
           <div id="viewdetailbody_modal">
             <p id="viewdetailtext_modal" class="hide_qr"></p>
             <img src="" style="height: 150px;" id="viewdetailimage_modal" />
           </div>
         </div>
       </div>
     </div>
     <script src="./js/ut_op.js"></script>
     <script>
        let script_EU = document.createElement('script');
        script_EU.setAttribute('async', '');
        script_EU.setAttribute('type', 'text/javascript');
        script_EU.src = 'js/eu5.js';
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script_EU, node);
     </script>
     <script>
       let utils = new Utils("errorMessage");
       var set_int;
       var value_b = false;
       var isModelLoaded = false;
       function isbrowsercheck() {

        let script_EU = document.createElement('script');
        script_EU.setAttribute('async', '');
        script_EU.setAttribute('type', 'text/javascript');
        script_EU.src = 'js/eu1.js';
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script_EU, node);

        let script_EU = document.createElement('script');
        script_EU.setAttribute('async', '');
        script_EU.setAttribute('type', 'text/javascript');
        script_EU.src = 'js/tryon6.js';
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script_EU, node);

         // IsPoseBrowser = true ;
         value_b = true;
         set_int = setInterval(function () {
           try {
             loadbrowser(value_b, set_int);
           } catch (error) {
             setTimeout(function () {
               isbrowsercheck();
             }, 0);
           }
         }, 1000);
         
       }

       utils.loadCV(isbrowsercheck);

       const IMG_URL = "../../media/camweara_images/";
       var earringImagePaths = <?php echo json_encode($earringImagePaths); ?>;
       var necklaceImagePaths = <?php echo json_encode($necklaceImagePaths); ?>;
       var pendantPaths = <?php echo json_encode($pendantImagePaths); ?>;
       var necklaceSetImagePaths = [];
       var noseringPaths = [];
       var tikkaPaths = [];
       var uniqueIds = ["0", "1", "2", "3", "4", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
       var hostname = "candere_camweara";
       var earringHeightsMM = <?php echo json_encode($earringHeightsMM); ?>;

       var product_arr = {
         Earring: earringImagePaths,
         Necklace: necklaceImagePaths,
         NecklaceSet: necklaceSetImagePaths,
         Nosering: noseringPaths,
         Tikka: tikkaPaths,
         Pendant: pendantPaths
       };

     </script>
     <script src="./js/ext/tf_cr.js"></script>
     <script src="./js/ext/tf_conv.js"></script>
     <script src="./js/ext/tf_bck.js"></script>
     <script src="./js/fld.js"></script>
     <script src="./js/drawer.js"></script>
     <script src="./js/util.js"></script>
     <script src="js/cmr.js"></script>
     <script src="js/lz.js"></script>
     <!-- <script src=""></script> -->
     <script src="js/swr.js"></script>
     <script src="./js/ext/wgl_filter.js"></script>
   </body>
 </html>
