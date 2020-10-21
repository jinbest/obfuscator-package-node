function sendDataToServer(data) {
    if(!data.willEncryptItems.length) {
        alert("Please load file or choose at least one item before 'EncryptHandle' Click!");
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/api/data', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert(this.responseText);
        }
    }
    xhr.send(JSON.stringify(data));
}

// let option = {
//     compact: false,
//     controlFlowFlattening: true,
//     controlFlowFlatteningThreshold: 1,
//     numbersToExpressions: true,
//     simplify: true,
//     shuffleStringArray: true,
//     splitStrings: true,
//     stringArrayThreshold: 1
// }

// function encry(content, option) {
//     var obfuscationResult = JavaScriptObfuscator.obfuscate( content, option );
//     return obfuscationResult.getObfuscatedCode();
// }

let listing = document.getElementById('listing');
let indexfile = document.getElementById('indexfile');

let listJS = {}, filename = '';

indexfile.addEventListener('change', e => {
    listing.innerHTML = "";
    for (let file of Array.from(e.target.files)) {
        readFileContent(file).then(content => {
            filename = file.name;
            let array = content.split("<script");
            for (let i = 0; i < array.length; i ++) {
                let arrayItem = (array[i].includes("</script>")) ? array[i].split("</script>")[0] : "";
                if(arrayItem.length && arrayItem.includes("src=")) {
                    let jsItem = arrayItem.split('"')[1] || arrayItem.split("'")[1];
                    console.log(jsItem);
                    if (!jsItem || jsItem === "" || jsItem === "./") {
                        continue;
                    } else {
                        jsItem = (jsItem[0] === ".") ? jsItem.substring(1) : jsItem;
                        jsItem = (jsItem[0] === "/") ? jsItem.substring(1) : jsItem;                    
                        listJS[`${i}-js`] = {"content": jsItem, "checked": false};
                        let liItem = document.createElement('li');
                        liItem.innerHTML = `
                            <div class="custom-control custom-checkbox" id="${i}-js" onclick="CheckStatus(this.id, 1)">
                                <input type="checkbox" class="custom-control-input" id="${i}-js-input" style="cursor: pointer;" onclick="CheckStatus('${i}-js', 0)">
                                <label class="custom-control-label" style="cursor: pointer;">${jsItem}</label>
                            </div>
                        `;
                        listing.appendChild(liItem);
                    }                    
                }
            }
        }).catch(error => console.log(error));
        
    };
});

let checkedJsItems = [];
function CheckStatus(id, key) {    
    if(!key) {
        document.getElementById(`${id}-input`).checked = !document.getElementById(`${id}-input`).checked;
        return;
    }
    document.getElementById(`${id}-input`).checked = !document.getElementById(`${id}-input`).checked;
    listJS[id].checked = !listJS[id].checked;    
    console.log(id, listJS[id].content, listJS[id].checked);
}

function EncryptHandle() {
    if(!document.getElementById('pkgname').value) {
        alert("Please input 'Package Name' before submit");
        return;
    }
    console.log(document.getElementById('pkgname').value);
    let willEncryptItems = [];
    for (key in listJS) {
        if (listJS.hasOwnProperty(key)) {
            if(listJS[key].checked) willEncryptItems.push(listJS[key].content);
        }
    }
    let option = (document.getElementById("Combined").checked) ? "combined" : "seperated";
    let transformOption = {
        stringArray: document.getElementById("stringArray").checked,
        rotateStringArray: document.getElementById("rotateStringArray").checked,
        shuffleStringArray: document.getElementById("shuffleStringArray").checked,
        splitStrings: document.getElementById("splitStrings").checked,
        stringArrayThreshold: parseFloat(document.getElementById("stringArrayThreshold").value),
        stringArrayWrappersCount: parseFloat(document.getElementById("stringArrayWrappersCount").value),
        compact: document.getElementById("compact").checked,
        simplify: document.getElementById("simplify").checked,
        numbersToExpressions: document.getElementById("numbersToExpressions").checked,
        transformObjectKeys: document.getElementById("transformObjectKeys").checked,
        controlFlowFlatteningThreshold: parseFloat(document.getElementById("controlFlowFlatteningThreshold").value),
        splitStringsChunkLenght: parseFloat(document.getElementById("splitStringsChunkLenght").value),
        stringArrayEncoding: document.getElementById("stringArrayEncoding").value,
    }    
    let data = {
        "filename": filename,
        "willEncryptItems": willEncryptItems,
        "option": option,
        "pkgName": document.getElementById('pkgname').value,
        "transformOption": transformOption
    }
    console.log(transformOption, data);
    sendDataToServer(data);
}

function readFileContent(file) {
	const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

function placeIndex() {
    let pkgName = document.getElementById('pkgname').value;
    if(!pkgName.length || !filename.length) {
        alert("Please input Package Name or upload file first!");
        return;
    }
    let data = {"pkgName": pkgName, "filename": filename};
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/api/placeindex', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert(this.responseText);
        }
    }
    xhr.send(JSON.stringify(data));
}

function removeUnreferringFiles() {
    let pkgName = document.getElementById('pkgname').value;
    if(!pkgName.length || !filename.length) {
        alert("Please input Package Name or upload file first!");
        return;
    }
    let referedFiles = [];
    for (key in listJS) {
        if (listJS.hasOwnProperty(key)) {
            referedFiles.push(listJS[key].content);
        }
    }
    let data = {"pkgName": pkgName, "filename": filename, "referedFiles": referedFiles};
    // console.log(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/api/remove-unreferred-files', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert(this.responseText);
        }
    }
    xhr.send(JSON.stringify(data));
}