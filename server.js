const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const fs_extra = require("fs-extra");
const JavaScriptObfuscator = require('javascript-obfuscator');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const port_number = process.env.PORT || 8001;

app.use(express.static("public"));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.listen(port_number, () =>
  console.log(`This project is listening on port ${port_number}!`)
);


let replacement = [];

app.post("/api/data", function(req, res) {
  let submitData = req.body;
  console.log("submitData", submitData, __dirname);
  let combinedData = '';

  let combinedObfuscatorOption = {
    compact: submitData.transformOption.compact,
    controlFlowFlatteningThreshold: submitData.transformOption.controlFlowFlatteningThreshold,
    numbersToExpressions: submitData.transformOption.numbersToExpressions,
    simplify: submitData.transformOption.simplify,
    stringArrayThreshold: submitData.transformOption.stringArrayThreshold,
    // stringArrayEncoding: 'rc4',
    splitStrings: submitData.transformOption.splitStrings,
    splitStringsChunkLenght: submitData.transformOption.splitStringsChunkLenght,
    shuffleStringArray: submitData.transformOption.shuffleStringArray,
    controlFlowFlattening: true
  }

  // Copy all files in the selected Package from '_assests_pkg_' to '_results_pkg_'.
  fs_extra.copy(__dirname + '/public/_assests_pkg_/' + submitData.pkgName, __dirname + '/public/_results_pkg_/' + submitData.pkgName, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success to copy package! '" + submitData.pkgName + "'");

      // Encrypting or Obfuscating here.
      let assestRootPath = 'public/_assests_pkg_/', 
          pkgName = submitData.pkgName + '/', 
          resultRootPath = 'public/_results_pkg_/';
      for (let i = 0; i < submitData.willEncryptItems.length; i++) {
        fs.readFile(assestRootPath + pkgName + submitData.willEncryptItems[i], 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if(submitData.option === 'seperated') {
            let obfuscationResult = JavaScriptObfuscator.obfuscate(
              data,
              combinedObfuscatorOption
            );
            let resultContentPath = resultRootPath + pkgName + submitData.willEncryptItems[i];
            
            fs.unlink(resultContentPath, function(err){
              if(err) return console.log(err);
              console.log('file deleted successfully: ' + resultContentPath);

              let cntJS = submitData.willEncryptItems[i], cntJSArray = cntJS.split("."), replaced_JS_path = "";
              // cntJSArray[cntJSArray.length-2] = cntJSArray[cntJSArray.length-2] + "_o";
              for (let k = 0; k < cntJSArray.length-2; k++) {
                replaced_JS_path += cntJSArray[k] + ".";
              }
              let letter_3_Array = cntJSArray[cntJSArray.length-2].split("/"), let_3_path = "";
              for (let u = 0; u < letter_3_Array.length-1; u ++) {
                let_3_path += letter_3_Array[u] + "/";
              }
              let_3_path += (letter_3_Array[letter_3_Array.length-1].length >= 3) ? letter_3_Array[letter_3_Array.length-1].substring(0, 3) :
                                                                             letter_3_Array[letter_3_Array.length-1];
              replaced_JS_path += let_3_path + "_o.js";
              // replaced_JS_path += cntJSArray[cntJSArray.length-1];

              replacement.push([submitData.willEncryptItems[i], replaced_JS_path]);
              if(i === submitData.willEncryptItems.length - 1) {
                replaceIndexFile(submitData.pkgName, submitData.filename, replacement);
              }

              let resultCntReplacedPath = resultRootPath + pkgName + replaced_JS_path;
              fs.writeFile(resultCntReplacedPath, obfuscationResult.getObfuscatedCode(), (err) => {
                if (err) {
                  console.log(err + " in '" + resultCntReplacedPath + "'");
                  return;
                }
                console.log("Successfully Written to File: " + resultCntReplacedPath);
              });

            });
            
          } else {
            combinedData += data;

            if(i == submitData.willEncryptItems.length - 1) {
              removePathIndexFile(pkgName, submitData.filename, submitData.willEncryptItems);
              let resultContentPath = resultRootPath + pkgName + 'js/comb_o.js',
                  pathArray = resultContentPath.split('/'), dir = '';
              for (let j = 0; j < pathArray.length-1; j++) {
                dir += pathArray[j] + '/';
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir);
                }
              }
              var obfuscationResult = JavaScriptObfuscator.obfuscate(
                combinedData,
                combinedObfuscatorOption
              );
              fs.writeFile(resultContentPath, obfuscationResult.getObfuscatedCode(), (err) => {
                if (err) throw err;
              });
              console.log("Obfuscated into '" + pkgName + "js/comb_o.js' combined successfully!");
            }
          }
        });

      }

    }
  });
  
  res.set("Content-Type", "application/json");
  res.send(`Obfuscated with "${submitData.option}" method successfully!`);
  res.end("ok");
});


async function replaceIndexFile(pkgname, filename, replaceArray) {
  console.log("replace", pkgname, replaceArray);

  let someFile = 'public/_results_pkg_/' + pkgname + '/' + filename;
  try {
    fs.readFile(someFile, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      let result = '';
      for (let i = 0; i < replaceArray.length; i++) {
        result = data.replace(replaceArray[i][0], replaceArray[i][1]);
        data = result;
      }
      fs.writeFile(someFile, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  } catch (err) {
    console.error(err + " in replacement of index file");
  }  

}


async function removePathIndexFile(pkgName, filename, removePh) {
  console.log("remove", pkgName, filename, removePh);
  for (let i = 0; i < removePh.length; i++) {
    fs.unlink('public/_results_pkg_/' + pkgName + removePh[i], function(err){
      if(err) return console.log(err);
      console.log('file deleted successfully: ' + 'public/_results_pkg_/' + pkgName + removePh[i]);
    });
  }
  
  let someFile = 'public/_results_pkg_/' + pkgName + '/' + filename;
  try {
    fs.readFile(someFile, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      let result = '';
      for (let i = 0; i < removePh.length-1; i++) {
        result = data.replace(removePh[i], '');
        data = result;
      }
      result = data.replace(removePh[removePh.length-1], 'js/comb_o.js');
      fs.writeFile(someFile, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  } catch (err) {
    console.error(err + " in replacement of index file");
  } 

}


app.post("/api/placeindex", function(req, res) {
  let submitData = req.body;
  fs.access("./public/_results_pkg_/" + submitData.pkgName, function(error) {
    if (error) {
      console.log("Directory does not exist.");
    } else {
      console.log("Directory exists.");
      let allFilePath = getFiles("./public/_results_pkg_/" + submitData.pkgName);
      console.log(allFilePath);
      for (let i = 0; i < allFilePath.length; i++) {
        let cntPath = allFilePath[i], cntPathArray = cntPath.split("/"), cntDirPath = "";
        for (let j = 0; j < cntPathArray.length-1; j++) {
          cntDirPath += cntPathArray[j] + "/";
        }
        if(cntDirPath === "./public/_results_pkg_/" + submitData.pkgName + "/") {
          continue;
        } else {
          fs.writeFile(cntDirPath + "index.php", '', function (err) {
            if (err) throw err;
            console.log('"index.php" is created inside of "' + cntDirPath + '" folder successfully.');
          });
        }        
      }
    }
  });
  res.set("Content-Type", "application/json");
  res.send(`Successed in the request!`);
  res.end("ok");
});


app.post("/api/remove-unreferred-files", function(req, res) {
  let submitData = req.body;
  fs.access("./public/_results_pkg_/" + submitData.pkgName, function(error) {
    if (error) {
      console.log("Directory does not exist.");
    } else {
      console.log("Directory exists.");
      let allFilePath = getFiles("./public/_results_pkg_/" + submitData.pkgName);
      removeUnReferredFiles(allFilePath, submitData);
    }
  });
  res.set("Content-Type", "application/json");
  res.send(`Successed to remove un-referred files!`);
  res.end("ok");
});

function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}

function removeUnReferredFiles(allFilePath, submitData) {
  // console.log(allFilePath, submitData);
  for (let i = 0; i < allFilePath.length; i++) {
    if (allFilePath[i].split(".").slice(-1)[0] == "js") {
      let cntFile = allFilePath[i], referred = false;
      for (let j = 0; j < submitData.referedFiles.length; j++) {
        if (cntFile.includes(submitData.referedFiles[j])) {
          referred = true;
          break;
        }
      }
      // console.log(cntFile, referred, submitData.referedFiles);
      if (!referred) {
        fs.unlink(cntFile, function(err){
          if(err) return console.log(err);
          console.log('file deleted successfully: ' + cntFile);
        });
      }
    }
  }
}