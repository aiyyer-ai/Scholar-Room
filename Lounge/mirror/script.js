var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
  document.onclick = movementCheck;
  typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
  window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
  });
	let inventory = window.sessionStorage.getItem(`inventoryLounge`);
	if(!inventory) {
    inventory = {
      halfSlipLoungeA: true,
      plate1: true,
      plate2: true,
      plate3: true,
      plate4: true,
      plate5: true,
      // plate6: true,
    };
	  window.sessionStorage.setItem(`inventoryLounge`, JSON.stringify(inventory));
	} else {
	  inventory = JSON.parse(inventory);
	}
	for (item in inventory) {
	  enterInventoryEntry(item, inventory[item]);
	}

}

function startUpEvents(div) {
  let mirrorCheck = window.sessionStorage.getItem(`mirrorData`);
	if(!mirrorCheck) {
		mirrorCheck = {
			office: {
        holeTopLeft: false,
        holeBottomLeft: false,
        holeTopRight: false,
        holeBottomRight: false,
        // plateHoleMiddleRight: false,
        plateHoleBottomRight: false
      },
			lounge: {
        holeTopLeft: false,
        holeBottomLeft: false,
        holeTopRight: false,
        holeBottomRight: false,
        // plateHoleMiddleRight: false,
        plateHoleBottomRight: false
      },
		}
		window.sessionStorage.setItem(`mirrorData`, JSON.stringify(mirrorCheck));
	} else {
		mirrorCheck = JSON.parse(mirrorCheck);
	}
  for (const [key, value] of Object.entries(mirrorCheck.lounge)) {
    if(value) {
      let plateID = `plate${value[0]}`;
      let plateRotation = value[1];
      if(plateID == div.id) {
        let plateDiv = document.getElementById(plateID);
        let holeDiv = document.getElementById(key);
        const event = new MouseEvent("mousedown", {
          clientX: holeDiv.offsetLeft + holeDiv.parentElement.offsetLeft + holeDiv.parentElement.parentElement.offsetLeft + holeDiv.clientWidth / 2,
          clientY: holeDiv.offsetTop + holeDiv.parentElement.offsetTop + holeDiv.parentElement.parentElement.offsetTop + holeDiv.clientHeight / 2,
          shiftKey: true,
          view: window,
          bubbles: true,
          cancelable: true,
        });
        plateDiv.dispatchEvent(event);
        let newPlate = Array.from(document.getElementsByClassName(`dragItem`)).filter((element) => {return element.id == plateID})[0];
        for(i=0; i<plateRotation/90;i++) {
          const event = new MouseEvent("mousedown", {
            clientX: holeDiv.offsetLeft + holeDiv.parentElement.offsetLeft + holeDiv.parentElement.parentElement.offsetLeft + holeDiv.clientWidth / 2,
            clientY: holeDiv.offsetTop + holeDiv.parentElement.offsetTop + holeDiv.parentElement.parentElement.offsetTop + holeDiv.clientHeight / 2,
            button: 2,
            shiftKey: true,
            view: window,
            bubbles: true,
            cancelable: true,
          });
          newPlate.dispatchEvent(event);
        }
      }
    }
  }
  // if(mirrorCheck.lounge) {
  //   let plateID = `plate${mirrorCheck.lounge[0]}`;
  //   let plateRotation = mirrorCheck.lounge[1];
  //   if(plateID == div.id) {
  //     let plateDiv = document.getElementById(plateID);
  //     let holeDiv = document.getElementById(`hole`);
  //     const event = new MouseEvent("mousedown", {
  //       clientX: holeDiv.offsetLeft + holeDiv.parentElement.offsetLeft + holeDiv.clientWidth / 2,
  //       clientY: holeDiv.offsetTop + holeDiv.parentElement.offsetTop + holeDiv.clientHeight / 2,
  //       shiftKey: true,
  //       view: window,
  //       bubbles: true,
  //       cancelable: true,
  //     });
  //     plateDiv.dispatchEvent(event);
  //     let newPlate = Array.from(document.getElementsByClassName(`dragItem`)).filter((element) => {return element.id == plateID})[0];
  //     for(i=0; i<plateRotation/90;i++) {
  //       const event = new MouseEvent("mousedown", {
  //         clientX: holeDiv.offsetLeft + holeDiv.parentElement.offsetLeft + holeDiv.clientWidth / 2,
  //         clientY: holeDiv.offsetTop + holeDiv.parentElement.offsetTop + holeDiv.clientHeight / 2,
  //         button: 2,
  //         shiftKey: true,
  //         view: window,
  //         bubbles: true,
  //         cancelable: true,
  //       });
  //       newPlate.dispatchEvent(event);
  //     }
  //   }
  // }
  let halfSlipLoungePosition = window.sessionStorage.getItem(`halfSlipLoungePosition`);
  halfSlipLoungePosition = JSON.parse(halfSlipLoungePosition);
  if(halfSlipLoungePosition) {
    let halfSlipLoungeDiv = document.getElementById(`halfSlipLoungeA`);
    const event = new MouseEvent("mousedown", {
      clientX: halfSlipLoungePosition.x + 450,
      clientY: halfSlipLoungePosition.y + 59,
      shiftKey: true,
      view: window,
      bubbles: true,
      cancelable: true,
    });
    halfSlipLoungeDiv.dispatchEvent(event);
  }
  let halfSlipOfficePosition = window.sessionStorage.getItem(`halfSlipOfficePosition`);
  halfSlipOfficePosition = JSON.parse(halfSlipOfficePosition);
  if(halfSlipOfficePosition) {
    let mirror = document.getElementById(`mirror`);
    let glass = document.getElementById(`glass`);
    addImg(`halfSlipOfficeB`, mirror, (div) => {
      div.classList.add('position');
      div.style.left = halfSlipOfficePosition.x - mirror.offsetLeft + "px";
      div.style.top = halfSlipOfficePosition.y - mirror.offsetTop + "px";
      div.style.width = 900 + "px";
      mirror.insertBefore(div, glass);
    });
  }
}

function checkPlates(mirrorCheck) {
  let passedSolution = true;
  let correctHolesOffice = {
    holeTopLeft: [4, 90],
    holeBottomLeft: [3, 90],
    holeTopRight: [5, 90],
    holeBottomRight: [2, 90],
    // plateHoleMiddleRight: false,
    plateHoleBottomRight: [7, 270]
  }
  for ([key, value] of Object.entries(mirrorCheck.office)) {
    if(!arraysEqual(correctHolesOffice[key], value)) {
      passedSolution = false;
    }
  }
  let correctHolesLounge = {
    holeTopLeft: [4, 90],
    holeBottomLeft: [3, 90],
    holeTopRight: [5, 90],
    holeBottomRight: [2, 90],
    // plateHoleMiddleRight: false,
    plateHoleBottomRight: [1, 90]    
  }
  for ([key, value] of Object.entries(mirrorCheck.lounge)) {
    if(!arraysEqual(correctHolesLounge[key], value)) {
      passedSolution = false;
    }
  }
  if(passedSolution) {
                setTimeSpent();
            window.location.href = `../index.html`;
  }
}

function adjustGauge(mirrorCheck, holeId) {
  if (!holeId.includes('plate')) {
    let rotationMath = {
      0: 1,
      90: 7,
      180: 0,
      270: 0
    }
    let plateData = mirrorCheck['lounge'][holeId];
    let gauge = document.getElementById(holeId.replace('hole','gauge'));
    if (!plateData) {
      gauge.style.height = 2 + 'px';
    } else {
      let numberGoal = plateData[0] * rotationMath[plateData[1]];
      if(plateData[0] == 7 && plateData[1] == 270) {
        numberGoal = 1;
      }
      if(plateData[0] == 7 && plateData[1] == 90) {
        numberGoal = 0;
      }
      gauge.style.height = 2 + (40 * Math.floor(numberGoal / 5)) + (15 * Math.floor((numberGoal % 5) / 2)) + (((numberGoal % 5) % 2) * 7) + 'px';
    }
  }
}

var pauseTimeStart;

function pause() {
      setTimeSpent();
      pauseTimeStart = Date.now();
      let pauseOverlay = document.getElementById(`pauseOverlay`);
      pauseOverlay.style.display = `block`;
}

function unpause() {
      timeStart = Date.now();
      let pauseOverlay = document.getElementById(`pauseOverlay`);
      pauseOverlay.style.display = `none`;
      let pauseTimeEnd = Date.now();
      let pauseTimeSpent = (pauseTimeEnd - pauseTimeStart) / 1000;
      let timing_dict = JSON.parse(window.sessionStorage.getItem(`timeData`));
      if(!timing_dict) {
            timing_dict = {};
      }

      let url_parts = window.location.pathname.split("/");
      url_parts.shift();
      url_parts.pop();

      let timing_dict_level = timing_dict;
      for (url_part of url_parts) {
            if (!(url_part in timing_dict_level)) {
                  timing_dict_level[url_part] = {};
            }
            timing_dict_level = timing_dict_level[url_part];
      }
      if(!timing_dict_level["time_spent_paused"]) {
            timing_dict_level["time_spent_paused"] = 0;
      }
      timing_dict_level["time_spent_paused"] += Math.round(pauseTimeSpent);

      window.sessionStorage.setItem(`timeData`, JSON.stringify(timing_dict));
}

function setTimeSpent() {
      let timeEnd = Date.now();
      let timeSpent = (timeEnd - timeStart) / 1000;
      let timing_dict = JSON.parse(window.sessionStorage.getItem(`timeData`));
      if(!timing_dict) {
            timing_dict = {};
      }

      let url_parts = window.location.pathname.split("/");
      url_parts.shift();
      url_parts.pop();

      let timing_dict_level = timing_dict;
      for (url_part of url_parts) {
            if (!(url_part in timing_dict_level)) {
                  timing_dict_level[url_part] = {};
            }
            timing_dict_level = timing_dict_level[url_part];
      }
      if(!timing_dict_level["time_spent"]) {
            timing_dict_level["time_spent"] = 0;
      }
      timing_dict_level["time_spent"] += Math.round(timeSpent);

      window.sessionStorage.setItem(`timeData`, JSON.stringify(timing_dict));
}

function movementCheck(event) {
	let clickLocation = Object.create(locationObject);
	clickLocation.x = event.clientX;
	clickLocation.y = event.clientY;
  let onInventoryItem = overlayCheck(clickLocation, "dragItem")[0];
	if(overlayCheck(clickLocation, "leave")[0] && !onInventoryItem) {
	              setTimeSpent();
            window.location.href = `../index.html`;
	}
}

function pullDownInv(inventoryDiv) {
  if(inventoryDiv.target) {
    inventoryDiv = document.getElementsByClassName(`inventory`)[0];
  }
  inventoryDiv.style.opacity = `100%`;
  inventoryDiv.style.top = 0 + "px";
}

function pullUpInv(inventoryDiv) {
  if(inventoryDiv.target) {
    inventoryDiv = document.getElementsByClassName(`inventory`)[0];
  }
  inventoryDiv.style.opacity = ``;
  inventoryDiv.style.top = ``;
}

// function toggleInv(inventoryDiv, event) {
//   let clickLocation = Object.create(locationObject);
//   clickLocation.x = event.clientX;
//   clickLocation.y = event.clientY;
//   let clickedItem = overlayCheck(clickLocation, `inventoryItem`)[0];
//   if(clickedItem) {
//     inventoryDiv.toggled = false;
//   }
//   if(!inventoryDiv.toggled) {
//     inventoryDiv.style.top = 0 + "px";
//     inventoryDiv.onmouseover = null;
//     inventoryDiv.onmouseout = null;
//     inventoryDiv.toggled = true;
//   } else {
//     inventoryDiv.onmouseover = pullDownInv;
//     inventoryDiv.onmouseout = pullUpInv;
//     inventoryDiv.toggled = false;		
//   }
// }

function takeItem(div) {
  let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`)})[0].replace(`Item`, ``);
  div.style.visibility = `hidden`;
  let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryLounge`));
  inventory[item] = true;
  window.sessionStorage.setItem(`inventoryLounge`, JSON.stringify(inventory));
let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
if(!inventoryDiv.toggled) {
  pullDownInv(inventoryDiv);
  setTimeout(pullUpInv, 800, inventoryDiv);
}
  enterInventoryEntry(item, inventory[item]);
}

function enterInventoryEntry(item, itemValue) {
  let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
  let inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
  if(!inventoryElement) {
    addInv(`${item}`, inventoryDiv, (imgDiv) => {
      if(imgDiv) {
        imgDiv.id = item;
        imgDiv.classList.add(`inventoryItem`);
        addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
          if(altImgDiv) {
            imgDiv.appendChild(altImgDiv.children[0]);
            altImgDiv.remove();
            imgDiv.children[0].style.display = `none`;
            imgDiv.style.width = imgDiv.children[1].clientHeight * imgDiv.children[1].naturalWidth / imgDiv.children[1].naturalHeight + "px";
          } else {
            imgDiv.style.width = imgDiv.children[0].clientHeight * imgDiv.children[0].naturalWidth / imgDiv.children[0].naturalHeight + "px";
          }
          dragElement(imgDiv);
          changeItemVisibility(item, itemValue);
          startUpEvents(imgDiv);
        });
      }
    });
  } else {
    changeItemVisibility(item, itemValue);
  }
  function changeItemVisibility(item, itemValue) {
    inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
    if(!itemValue) {
      inventoryElement.style.display = `none`;
    } else {
      inventoryElement.style.display = ``;
    }
  }
}

function goToRoom(div) {
  let room = Array.from(div.classList).filter((classes) => { return classes.includes(`door`)})[0].replace(`door`, ``);
  console.log(room);
}

function addInv(src, parentElement, imgCallback) {
	let newImg = new Image();
	newImg.src = `../inventoryItems/${src}.webp`;
	newImg.onerror = () => {
		imgCallback(false);
	};
	newImg.onload = addToPage;
	function addToPage(event) {
	  let newDiv = document.createElement(`div`);
	  if(parentElement) {
		parentElement.appendChild(newDiv);
	  }
	  newDiv.classList.add(`imgcontainer`);
	  newDiv.appendChild(this);
	  if (imgCallback) {
		imgCallback(newDiv);
	  }
	}
}

function addImg(src, parentElement, imgCallback) {
  let newImg = new Image();
  newImg.src = `./images/${src}.webp`;
  newImg.onerror = () => {
		imgCallback(false);
	};
  newImg.onload = addToPage;
  function addToPage(event) {
  let newDiv = document.createElement(`div`);
  if(parentElement) {
    parentElement.appendChild(newDiv);
  }
  newDiv.classList.add(`imgcontainer`);
  newDiv.appendChild(this);
  if (imgCallback) {
    imgCallback(newDiv);
  }
  }
}

function rotatePiece(piece) {
  let possibleRotations = [0, 90, 180, 270];
  if(!piece.rotation) {
    piece.rotation = 0;
  }
  let rotationIndex = possibleRotations.indexOf(piece.rotation) + 1 == possibleRotations.length ? 0 : possibleRotations.indexOf(piece.rotation) + 1;
  let rotation = possibleRotations[rotationIndex];
  piece.style.transform = `rotate(${rotation}deg)`;
  piece.rotation = rotation;
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    let inventoryItem = Array.from(elmnt.classList).find((value) => {
    return value.includes(`inventoryItem`);
    });
    if(inventoryItem) {
    elmnt.onmousedown = copyAndDrag;
    } else {
    elmnt.onmousedown = dragMouseDown;
    }
  }

  function copyAndDrag(event) {
    if(this.onPage) {
      return;
    }
    let placedItem;
    placedItem = this.cloneNode(true);
    if (this.children.length > 1) {
			placedItem.children[0].style.display = ``;
			placedItem.children[1].style.display = `none`;
		}
    if(placedItem.id.includes(`halfSlip`)) {
      placedItem.style.width = 900 + "px";
      placedItem.style.height = placedItem.style.width.replace("px","") * this.children[0].naturalHeight / this.children[0].naturalWidth + "px";
    } else {
      placedItem.style.height = Math.min(150 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
			placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
    }
    this.style.opacity = `50%`;
    this.onPage = true;
    placedItem.originalItem = this;
    document.body.children[0].appendChild(placedItem);
    placedItem.classList.remove(`inventoryItem`);
    placedItem.classList.add(`dragItem`);
    placedItem.style.left = event.clientX - placedItem.clientWidth / 2 + "px";
    placedItem.style.top = event.clientY - placedItem.clientHeight / 2 + "px";
    dragElement(placedItem);
    elmnt = placedItem;
    dragMouseDown(event);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    var rightclick;
    if (e.which){
      rightclick = (e.which == 3);
    } 
    else if (e.button) {
      rightclick = (e.button == 2);
    }
    if(rightclick) {
      rotatePiece(elmnt);
    } else {
      if(elmnt.onHole) {
        let mirrorCheck = window.sessionStorage.getItem(`mirrorData`);
        mirrorCheck = JSON.parse(mirrorCheck);
        mirrorCheck[`lounge`][elmnt.onHole] = false;
        window.sessionStorage.setItem(`mirrorData`, JSON.stringify(mirrorCheck));
        adjustGauge(mirrorCheck, elmnt.onHole);
        elmnt.onHole = false;
      }
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmousemove = elementDrag;
    }
    if(e.shiftKey) {
      closeDragElement(e);
    } else {
      document.onmouseup = closeDragElement;
    }
    // get the mouse cursor position at startup:
    
    // call a function whenever the cursor moves:

  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(event) {
    // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      let clickLocation = Object.create(locationObject);
      clickLocation.x = event.clientX;
      clickLocation.y = event.clientY;
      let overInventory = overlayCheck(clickLocation, `inventory`)[0];
      let inventoryItem = Array.from(elmnt.classList).find((value) => {
        return value.includes(`dragItem`);
      });
      if(overInventory && inventoryItem) {
        elmnt.remove();
        elmnt.originalItem.style.opacity = `100%`;
        elmnt.originalItem.onPage = false;
        if(elmnt.id.includes(`halfSlip`)) {
          window.sessionStorage.setItem(`halfSlipLoungePosition`, false);
        }
      }
      let overHole = overlayCheck(clickLocation, `hole`)[0];
      let overPlate = overlayCheck(clickLocation, `dragItem`).filter((div) => {
        return div.id != elmnt.id;
      })[0];
      let mirrorCheck = window.sessionStorage.getItem(`mirrorData`);
      mirrorCheck = JSON.parse(mirrorCheck);
      if(overHole && elmnt.id.includes(`plate`) && !overPlate) {
        elmnt.style.top = overHole.parentElement.parentElement.offsetTop + overHole.parentElement.offsetTop + overHole.offsetTop + "px";
        elmnt.style.left = overHole.parentElement.parentElement.offsetLeft + overHole.parentElement.offsetLeft + overHole.offsetLeft + "px";
        if(!elmnt.rotation) {
          elmnt.rotation = 0;
        }
        let pieceNumber = Number(elmnt.id.slice(-1));
        let pieceRotation = elmnt.rotation;
        mirrorCheck[`lounge`][overHole.id] = [pieceNumber, pieceRotation];
        window.sessionStorage.setItem(`mirrorData`, JSON.stringify(mirrorCheck));
        elmnt.onHole = overHole.id;
        adjustGauge(mirrorCheck, overHole.id);
        checkPlates(mirrorCheck);
      }
      if(elmnt.id.includes(`halfSlip`) && !overInventory) {
        halfSlipPosition = {
          x: elmnt.offsetLeft, 
          y: elmnt.offsetTop
        };
        window.sessionStorage.setItem(`halfSlipLoungePosition`, JSON.stringify(halfSlipPosition));
      }
  }
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function overlayCheck(div, tagToCheck) {
let points = Array.from(document.querySelectorAll(`.${tagToCheck}`));
points.sort((a, b) => {
let topfirst = a.style.top.replace("px","") - b.style.top.replace("px","");
let leftfirst = a.style.left.replace("px","") - b.style.left.replace("px","");
return leftfirst;
});

let allOverlaps = [];

let rightPos = (elem) => elem.getBoundingClientRect().right;
let leftPos = (elem) => elem.getBoundingClientRect().left;
let topPos = (elem) => elem.getBoundingClientRect().top;
let btmPos = (elem) => elem.getBoundingClientRect().bottom;

for (let i = 0; i < points.length; i++) {
let isOverlapping = !(
rightPos(div) < leftPos(points[i]) ||
leftPos(div) > rightPos(points[i]) ||
btmPos(div) < topPos(points[i]) ||
topPos(div) > btmPos(points[i])
);

if (isOverlapping) {
  allOverlaps.push(points[i]);
}
}
return allOverlaps;
}

const locationObject = {
x:0,
y:0,
width:0,
height:0,
getBoundingClientRect() {
return {right:(this.x + this.width), left:(this.x), top:(this.y), bottom:(this.y + this.height)};
}
}