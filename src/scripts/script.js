window.onload = async function () {

    const canvas = document.getElementById('js-canvas');
    const ctx = canvas.getContext('2d');
    const image = document.getElementById("js-pic-output");
    const imageGrid = document.getElementById("js-pic-grid");
    const hiddenImageGrid = document.getElementById("js-pic-hidden-grid");
    const cropSize = document.getElementById("js-size");
    const heightDropdown = document.getElementById("js-height-dropdown");
    const input = document.getElementById("js-file");
    const downloadCheck = document.getElementById("js-download");
    const selectFacesWrapper = document.getElementById("js-select-faces");
    const bestEffortCheck = document.getElementById("js-best-effort");
    const allFacesCheck = document.getElementById("js-all-faces");
    const sharpenFacesCheck = document.getElementById("js-sharpen-faces");
    const fileUploadButton = document.getElementById("js-upload-button");
    const selectFacesButton = document.getElementById("js-select-faces-submit")
    const dropWrapper = document.getElementById("js-drop-wrapper");
    const placeholderText = document.getElementById("js-placeholder");
    const faceCheckboxWrapper = document.getElementById("js-face-checkbox-wrapper");
    const exampleImages = document.getElementById("js-examples");
    const exampleImagesWrapper = document.getElementById("js-examples-wrapper");
    const recropButton = document.getElementById("js-recrop-button");
    const settingsButton = document.getElementById("js-settings-button");
    const settingsButtonText = document.getElementById("js-settings-button-text");
    const optionsWrapper = document.getElementById("js-options");
    const warningSymbol = document.getElementById("js-warning");
    const heartEyesSymbol = document.getElementById("js-heart-eyes");
    const spinnerSymbol = document.getElementById("js-spinner");
    const overlay = document.getElementById("js-overlay");
    const loadingText = document.getElementById("js-loading");
    const disclaimerText = document.getElementById("js-disclaimer");
    const advancedWrapper = document.getElementById("js-advanced");
    const advancedButton = document.getElementById("js-advanced-button");
    const aiType = document.getElementById("js-ai-dropdown");
  
    const MODEL_URL = './src/models';
  
    var globalFile = "./assets/example (1).png";
    var counter = 0;
    var allFiles = [globalFile];
    var sameImageCount = 0;
    var detections;
  
    var selectedFaces = [];
  
    const constantCanvasHeight = exampleImages.height; //same as the height of the example image
    const constantCanvasWidth = constantCanvasHeight; //canvas is square
    const topAddition = 10; //makes the eyes 10 pixels below the first third line
    const delayTime = 200; //after each file is done, wait a few seconds
    const delay = ms => new Promise(res => setTimeout(res, ms));
  
    //run detection on blank image to load models - makes
    //subsequent inputs faster
    image.src = "./assets/example (2).png"
    await detectFace(image, "begin", "fast");
    overlay.style.display = "none";
    loadingText.style.display = "none";
    disclaimerText.style.display = "";
  
  
  
    settingsButton.onclick = function () {
      if (optionsWrapper.classList.length > 1) {
        optionsWrapper.classList.remove("is-visible");
        settingsButtonText.innerHTML = "change settings"
      } else {
        optionsWrapper.classList.add("is-visible");
        settingsButtonText.innerHTML = "hide settings";
      }
    }
  
    selectFacesButton.onclick = async function () {
      var saveImgSrc = image.src;
      var saveImgWidth = image.style.width;
      var saveImgHeight = image.style.height;
      var saveImgDisplay = image.style.display;
  
      for(var i = 0; i < selectedFaces.length; i++) {
        if (document.getElementById(selectedFaces[i]).checked) {
          await startCropping(saveImgSrc, saveImgWidth, saveImgHeight, saveImgDisplay, detections, i)
        }
      }
  
    }
  
    advancedButton.onclick = function () {
      sameImageCount += 1;
      advancedWrapper.style.display = "none";
      detectFace(image, "normal", "powerful");
    }
  
    fileUploadButton.onclick = function () {
      imageGrid.innerHTML = "";
      input.click();
      if (recropButton.classList[1] == "is-visible") {
        recropButton.classList.remove("is-visible");
      }
    }
  
    input.onchange = async function () {
      if (recropButton.classList[1] == "is-visible") {
        recropButton.classList.remove("is-visible");
      }
      if (input.files) {
        allFiles = input.files;
        counter = 0;
        await callback();
      }
    }
  
    dropWrapper.ondragover = function (e) {
      e.preventDefault();
      dropWrapper.style.border = "4px dashed #FFD1D1";
    }
  
  
    dropWrapper.ondrop = async function (e) {
      imageGrid.innerHTML = "";
      e.preventDefault();
      if (recropButton.classList[1] == "is-visible") {
        recropButton.classList.remove("is-visible");
      }
  
      allFiles = e.dataTransfer.files;
  
      counter = 0;
      await callback();
    }
  
    async function callback() {
  
      counter++;
      if (counter <= allFiles.length) {
        if (!allFiles[counter - 1].type.match(/image.*/)) {
          placeholderText.innerHTML = "The dropped file is not an image: ", allFiles[counter - 1].type;
          warningSymbol.style.display = "";
          heartEyesSymbol.style.display = "none";
          spinnerSymbol.style.display = "none";
          return;
        }
        else if (allFiles[counter - 1].type.match(/image.heic/)) {
  
          file_name = allFiles[counter - 1].name.substr(0, allFiles[counter-1].name.lastIndexOf('.'))
          resultBlob = await heic2any({
            blob: allFiles[counter - 1],
            toType: "image/jpeg",
          })
          let file = new File([resultBlob], file_name+".jpg",{type:"image/jpeg", lastModified:new Date().getTime()});
  
  
          globalFile = file
  
        } else {
          globalFile = allFiles[counter - 1];
        }
  
        
        await loadImg(globalFile, callback);
      }
  
    }
  
    recropButton.onclick = function () {
      imageGrid.innerHTML = ""
      loadImg(globalFile, callback);
    }
  
    async function loadImg(file, callbackFunc) {
      if (!file) {
        placeholderText.innerHTML = "No file selected.";
        warningSymbol.style.display = "";
        heartEyesSymbol.style.display = "none";
        spinnerSymbol.style.display = "none";
        return;
      }
      if (!file.type.match(/image.*/)) {
        placeholderText.innerHTML = "Your file is not an image.";
        warningSymbol.style.display = "";
        heartEyesSymbol.style.display = "none";
        spinnerSymbol.style.display = "none";
        return;
      }
      let aiTypePass;
      if (aiType.value == "default") {
        if (allFiles.length > 1) {
          aiTypePass = "fast";
        } else {
          aiTypePass = "fast";
        }
      } else {
        aiTypePass = aiType.value;
      }
  
      image.style.display = "none";
      advancedWrapper.style.display = "none";
      sameImageCount = 0;
      var reader = new FileReader();
      reader.onload = async function (e) {
        canvas.style.display = "";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = constantCanvasWidth;
        canvas.height = constantCanvasHeight;
        var img = new Image();
        img.src = e.target.result;
        img.onload = async function () {
          let factor = canvas.height / image.height;
          let startX = 0;
          let startY = 0;
          canvas.width = img.width * (factor);
          canvas.height = img.height * (factor);
          let width = img.width;
          let height = img.height;
          if (exampleImagesWrapper.classList[1] == "is-visible") {
            exampleImagesWrapper.classList.remove("is-visible");
          }
          ctx.drawImage(img, startX, startY, width, height, 0, 0, canvas.width, canvas.height);
        };
        image.src = e.target.result;
        await detectFace(image, "", aiTypePass);
        if (allFiles.length > 1) {
          await delay(delayTime);
        }
        callbackFunc();
  
      }
      reader.readAsDataURL(file);
    }
  
    async function resetImage(src, width, height, display) { 
      image.src = src;
      image.style.width = width;
      image.style.height = height;
      image.style.display = display;
    }
  
    async function detectFace(image, type, aiTypeParam) {
      if (type != "begin") {
        placeholderText.innerHTML = "Please wait...your photo is being cropped!";
        warningSymbol.style.display = "none";
        heartEyesSymbol.style.display = "none";
        spinnerSymbol.style.display = "";
        if (allFiles.length > 1) {
          placeholderText.innerHTML += " (" + counter + "/" + allFiles.length + ")";
        }
  
        faceCheckboxWrapper.innerHTML = "";
        selectFacesButton.style.display = "none"
  
  
      }
  
      detections = await getDetections(aiTypeParam);
  
      if (type == "begin") {
        return;
      }
  
      if (detections.length > 100) {
        placeholderText.innerHTML = "Sorry! Too many faces detected!";
        warningSymbol.style.display = "";
        heartEyesSymbol.style.display = "none";
        spinnerSymbol.style.display = "none";
      } else {
        var saveImgSrc = image.src;
        var saveImgWidth = image.style.width;
        var saveImgHeight = image.style.height;
        var saveImgDisplay = image.style.display;
  
        if (!allFacesCheck.checked && detections.length > 1) {
          var colors = await showDetections(aiTypeParam);
          placeholderText.innerHTML = "Please select which face(s) to crop"
          warningSymbol.style.display = "none";
          heartEyesSymbol.style.display = "none";
          spinnerSymbol.style.display = "none";
          
          selectedFaces = []
  
          for (var ind = 0; ind < detections.length; ind++) {
            var newCheck = document.createElement("input")
            newCheck.type = "checkbox";
            newCheck.value = ind
            newCheck.name = "check-" + ind
            newCheck.id = "check-" + ind
            var newCheckLabel = document.createElement("label")
            newCheckLabel.for = "check-" + ind
            newCheckLabel.innerHTML = "Face #" + (ind+1)
            newCheckLabel.style.color = colors[ind]
            faceCheckboxWrapper.appendChild(newCheck)
            faceCheckboxWrapper.appendChild(newCheckLabel)
            faceCheckboxWrapper.appendChild(document.createElement("br"))
            selectedFaces.push("check-" + ind)
  
          }
          selectFacesButton.style.display = "";
  
        } else {
        
        for (var ind = 0; ind < detections.length; ind++) {
          startCropping(saveImgSrc, saveImgWidth, saveImgHeight, saveImgDisplay, detections, ind)
        }
      }
        if (detections.length == 0 && aiTypeParam == "powerful") {
          placeholderText.innerHTML = "No face detected.";
        // if (sameImageCount == 0)
          // advancedWrapper.style.display = "inline-block";
        // else
          // placeholderText.innerHTML += " Please choose another picture."
          warningSymbol.style.display = "";
          heartEyesSymbol.style.display = "none";
          spinnerSymbol.style.display = "none";
        } if (detections.length == 0 && aiTypeParam == "fast") {
          await detectFace(image, "", "powerful");
        }
        if (allFiles.length > 1) {
          placeholderText.innerHTML += " (" + counter + "/" + allFiles.length + ")";
        }
      }
    }
  
    async function startCropping(saveImgSrc, saveImgWidth, saveImgHeight, saveImgDisplay, detections, ind) {
      await resetImage(saveImgSrc, saveImgWidth, saveImgHeight, saveImgDisplay);
  
      let leftEye = detections[ind].landmarks.getLeftEye();
      let rightEye = detections[ind].landmarks.getRightEye();
      let centerOfEyesX = (rightEye[0]._x + leftEye[3]._x) / 2;
      let centerOfEyesY = (rightEye[0]._y + leftEye[3]._y) / 2;
      let faceFraction = parseFloat(heightDropdown.value);
      let faceHeight = detections[ind].alignedRect._box._height;
      let cropHeight = 1 / (faceFraction) * faceHeight;
      let cropWidth = cropHeight;
  
      canvas.width = cropSize.value;
      canvas.height = cropSize.value;
      let startX = centerOfEyesX - cropWidth / 2;
      let startY = centerOfEyesY - cropHeight / 3 - topAddition;
  
      if (startX < 0) {
        startX = 0;
      }
      if (startY < 0) {
        startY = 0;
      }
  
      if (startX > detections[ind].alignedRect._box._x) {
        startX = detections[ind].alignedRect._box._x;
      }
      if (startY > detections[ind].alignedRect._box._y) {
        startY = detections[ind].alignedRect._box._y;
      }
  
      if (cropHeight > image.height || cropWidth > image.width || cropHeight + startY > image.height || cropWidth + startX > image.width) {
        if (bestEffortCheck.checked) {
          while (cropHeight > image.height || cropWidth > image.width || cropHeight + startY > image.height || cropWidth + startX > image.width) {
            faceFraction += 0.01;
            faceHeight = detections[ind].alignedRect._box._height;
            cropHeight = 1 / (faceFraction) * faceHeight;
            cropWidth = cropHeight;
            startX = centerOfEyesX - cropWidth / 2;
            startY = centerOfEyesY - cropHeight / 3 - topAddition;
  
            if (startX < 0) {
              startX = 0;
            }
            if (startY < 0) {
              startY = 0;
            }
  
            if (startX > detections[ind].alignedRect._box._x) {
              startX = detections[ind].alignedRect._box._x;
            }
            if (startY > detections[ind].alignedRect._box._y) {
              startY = detections[ind].alignedRect._box._y;
            }
          }
          await showCroppedPicture(centerOfEyesX, centerOfEyesY, cropWidth, cropHeight, detections, startX, startY);
          placeholderText.innerHTML = "Best effort crop was used! Face-to-picture ratio used: " + faceFraction.toFixed(2) + ".";
          warningSymbol.style.display = "none";
          heartEyesSymbol.style.display = "";
          spinnerSymbol.style.display = "none";
          if (allFiles.length > 1) {
            placeholderText.innerHTML += " (" + counter + "/" + allFiles.length + ")";
          }
        } else {
          placeholderText.innerHTML = "The face-to-picture ratio of the original picture is greater than ratio selected! Please choose another picture, increase face-to-picture ratio, or select best effort crop.";
          warningSymbol.style.display = "";
          heartEyesSymbol.style.display = "none";
          spinnerSymbol.style.display = "none";
          if (allFiles.length > 1) {
            placeholderText.innerHTML += " (" + counter + "/" + allFiles.length + ")";
          }
          recropButton.classList.add("is-visible");
        }
      } else {
          await showCroppedPicture(centerOfEyesX, centerOfEyesY, cropWidth, cropHeight, detections, startX, startY);
      }
    }
  
    async function showCroppedPicture(centerOfEyesX, centerOfEyesY, cropWidth, cropHeight, detections, startX, startY) {
      ctx.drawImage(image, startX, startY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      recropButton.classList.add("is-visible");
     // canvas.style.display = "none";
      var newImage = document.createElement("img")
      newImage.src = canvas.toDataURL(globalFile.type);
      newImage.className ="output-pic";
      newImage.style.width = canvas.width;
      newImage.style.height = canvas.height;
      newImage.style.display = "";
  
      newImage.onload = async function () {
        if (!sharpenFacesCheck.checked) {
          imageGrid.appendChild(newImage);
        } else {
          await hiddenImageGrid.appendChild(newImage);
  
          var canvas1 = fx.canvas();
          var texture = await canvas1.texture(newImage);
  
  
          // document.body.appendChild(canvas1)
  
          await canvas1.draw(texture).unsharpMask(30, 0.4).update();
  
          var sharp_image = new Image();
          sharp_image.id = "sharp_pic";
          sharp_image.className="output-pic"
  
  
          sharp_image.src = canvas1.toDataURL();
          canvas.style.display = "none";
          imageGrid.appendChild(sharp_image);
        }
  
        // imageGrid.appendChild(canvas1);
  
        if (downloadCheck.checked) {
          download();
          
        }
        placeholderText.innerHTML = "Your photo is cropped!";
        warningSymbol.style.display = "none";
        heartEyesSymbol.style.display = "content";
        spinnerSymbol.style.display = "none";
        if (allFiles.length > 1) {
          placeholderText.innerHTML += " (" + counter + "/" + allFiles.length + ")";
        }
        dropWrapper.style.border = "4px solid #FDF5F5";
      }
  }
  
    function download() {
      var link = document.createElement('a');
      var name = globalFile.name.substr(0, globalFile.name.lastIndexOf('.'));
      link.download = name + "_cropped";
      link.href = canvas.toDataURL(globalFile.type);
      link.click();
    }
  
    async function getDetections(aiTypeParam) {
      var detections;
      if (aiTypeParam == "powerful") {
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
  
        detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
      } else {
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
  
        detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceDescriptors(true);
  
        const detectionsForSize = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height
        })
        // console.log(detectionsForSize)
        // console.log(detections)
        // faceapi.draw.drawDetections(canvas, detectionsForSize, {
        //   withScore: true
        // })
        // faceapi.draw.drawFaceLandmarks(canvas, detectionsForSize, {
        //   withScore: true
        // })
        // if(detections) {
        //   for(var i = 0; i < detections.length; i++) {
        //     ctx.beginPath()
        //     ctx.rect(detections[i].alignedRect._box._x, detections[i].alignedRect._box._y, detections[i].alignedRect._box._width, detections[i].alignedRect._box._height)
        //     console.log("here")
        //     ctx.stroke()
        //   }
        // }
      }
        return detections;
    }
  
    async function showDetections(aiTypeParam) {
      var detections;
      if (aiTypeParam == "powerful") {
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
  
        detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
      } else {
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  
        detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
        const detectionsForSize = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height
        })
  
        var colors = []
        // faceapi.draw.drawDetections(canvas, detectionsForSize)
        if(detectionsForSize) {
          for(var i = 0; i < detectionsForSize.length; i++) {
            ctx.beginPath()
            var color1 = Math.floor(Math.random()*256);
            var color2 = Math.floor(Math.random()*256);
            var color3 = Math.floor(Math.random()*256);
            rgbString = 'rgb(' + color1 + ',' + color2 + ',' + color3 + ")";
            colors.push(rgbString)
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgb(' + color1 + ',' + color2 + ',' + color3 + ")";
            ctx.rect(detectionsForSize[i].alignedRect._box._x, detectionsForSize[i].alignedRect._box._y, detectionsForSize[i].alignedRect._box._width, detectionsForSize[i].alignedRect._box._height)
  
            ctx.stroke()
          }
        }
      }
        return colors;
    }
  
  }