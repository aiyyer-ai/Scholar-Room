var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
//in case I want to make something run at launch
  document.onclick = movementCheck;
  let inventory = window.sessionStorage.getItem(`inventoryLounge`);
  if(!inventory) {
    inventory = {
      halfSlipLoungeA: false,
      plate1: false,
      plate2: false,
      plate3: false,
      plate4: false,
      plate5: false,
      plate6: false,
    };
    window.sessionStorage.setItem(`inventoryLounge`, JSON.stringify(inventory));
  } else {
    inventory = JSON.parse(inventory);
  }
  for (item in inventory) {
    enterInventoryEntry(item, inventory[item]);
  }
  addRecords();
  // generateTapeRec();
  addTapeUnit();
}

//GLOBAL VARIABLES//
var gameArea = document.getElementById(`gameArea`);
var recordPlayer = document.getElementById('recordPlayer');
var needle = document.getElementById('recordNeedle');
var recordCount = 6;
var currentRecord = null;
var correctSolution = [1, -2, 1, -6, -2, -4, 1, 5, 3, 1];

//FUNCTIONAL CODE//

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
	if(Array.from(event.target.classList).includes(`leave`)) {
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

function toggleInv(inventoryDiv, event) {
  let clickLocation = Object.create(locationObject);
  clickLocation.x = event.clientX;
  clickLocation.y = event.clientY;
  let clickedItem = overlayCheck(clickLocation, `inventoryItem`)[0];
  if(clickedItem) {
    inventoryDiv.toggled = false;
  }
  if(!inventoryDiv.toggled) {
    inventoryDiv.style.top = 0 + "px";
    inventoryDiv.onmouseover = null;
    inventoryDiv.onmouseout = null;
    inventoryDiv.toggled = true;
  } else {
    inventoryDiv.onmouseover = pullDownInv;
    inventoryDiv.onmouseout = pullUpInv;
    inventoryDiv.toggled = false;		
  }
}

function takeItem(div) {
  if(div.target) {
    div = div.target;
  }
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
    addImgInv(`inventoryItems/${item}`, inventoryDiv, (imgDiv) => {
    if(imgDiv) {
      imgDiv.id = item;
      imgDiv.classList.add(`inventoryItem`);
      // if(imgDiv.clientWidth > 200) {
        addImgInv(`inventoryItems/${item}Alt`, imgDiv, (altImgDiv) => {
          if(altImgDiv) {
            imgDiv.appendChild(altImgDiv.children[0]);
            altImgDiv.remove();
            imgDiv.children[0].style.display = `none`;
            imgDiv.style.width = imgDiv.children[1].clientHeight * imgDiv.children[1].naturalWidth / imgDiv.children[1].naturalHeight + "px";
          } else {
            imgDiv.style.width = imgDiv.children[0].clientHeight * imgDiv.children[0].naturalWidth / imgDiv.children[0].naturalHeight + "px";
          }
        });
      // }
      dragElement(imgDiv);
      changeItemVisibility(item, itemValue);
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

function addRecords() {
  let totalRecords = 6;
  let recordTopLocations = [...Array(totalRecords)].map((_, idx) => (idx) * 100);
  shuffle(recordTopLocations);
  for(i=1; i<=totalRecords; i++) {
    let recordCount = i;
    addImg(`record${i}`, gameArea, (record) => {
      record.classList.add(`records`);
      if (recordCount == 1) {
        record.allAudios = correctSolution.map((num) => {
          if (num == 0) {
            num = `start`;
          }
          let audio = new Audio(`./audio/${num}.wav`);
          audio.playbackRate = 0.8;
          return audio;
        });
      } else {
        record.allAudios = randomAudio();
      }
      record.timeouts = [];
      dragElement(record);
      let recordHeight = window.getComputedStyle(record).getPropertyValue("height");
      let offsetDistance = (window.innerHeight - (Number(Math.max(...recordTopLocations)) + Number(recordHeight.replace("px","")))) / 2;
      let topPosition = recordTopLocations[recordCount - 1];
      let leftPosition = 100;
      record.style.zIndex = topPosition / 100;
      record.id = recordCount;
      record.style.top = topPosition + offsetDistance + `px`;
      record.style.left = leftPosition + `px`;
    });
  }
}

function addTapeUnit() {
  addImg(`tapeUnit`, gameArea, (unit) => {
    unit.classList.add(`tapeUnit`, `position`);
    unit.id = `tapeUnit`;
    dragElement(unit);
    unit.style.height = `300px`;
    unit.firstChild.style.position = `relative`;
    unit.firstChild.style.zIndex = 3;
    unit.recording = false;
    unit.recordedSong = null;
    unit.recordedTimeouts = [];
    unit.currentNote = 0;
    let buttonOrder = [`rec`, `play`, `pause`, `previous`, `current`, `next`];
    for(i = 0; i < 6; i++) {
      let newButton = document.createElement(`div`);
      newButton.classList.add(`position`, `tapeButton`);
      unit.appendChild(newButton);
      newButton.id = buttonOrder[i];
      newButton.onclick = tapeButtonPress;
      newButton.style.left = `calc(50% + ${(newButton.clientWidth + 3) * i}px - ${newButton.clientWidth * 3.2}px)`;
    }
    let backgroundDiv = document.createElement(`div`);
    backgroundDiv.classList.add(`tapeBack`, `position`);
    unit.appendChild(backgroundDiv);
    let soundBar = document.createElement(`div`);
    soundBar.id = `tapeSoundBar`;
    soundBar.classList.add(`tapeSoundBar`, `position`);
    backgroundDiv.appendChild(soundBar);
    soundBar.style.width = 12 + 'px';
    centerDiv(soundBar, backgroundDiv, 50, 10);
    soundBar.originalLeft = soundBar.offsetLeft;
    centerDiv(unit, gameArea, 90, 90);
  });
}

function tapeButtonPress(event) {
  let soundBar = document.getElementById(`tapeSoundBar`);
  Array.from(document.querySelectorAll(`.tapeButton`)).forEach((button) => {
    if(button.id != this.id) {
      button.style.opacity = "";
      button.pressed = false;
    }
  });
  if (!this.pressed) {
    this.style.opacity = `100%`;
    this.pressed = true;
    switch(this.id) {
      case `rec`:
        this.parentElement.recording = !this.parentElement.recording;
        break;
      case `play`:
        if(tapeUnit.recordedSong) {
          playTune(tapeUnit.recordedSong.slice(tapeUnit.currentNote, tapeUnit.recordedSong.length), tapeUnit.recordedTimeouts, soundBar);
          tapeUnit.recordedTimeouts.push(setTimeout(() => {
            soundBar.style.width = `12px`;
            soundBar.style.left = soundBar.originalLeft + "px";
            tapeUnit.currentNote = 0;
            this.style.opacity = ``;
            this.pressed = false;
          }, 600 * tapeUnit.recordedSong.slice(tapeUnit.currentNote, tapeUnit.recordedSong.length).length));
        }
        break;
      case `pause`:
        tapeUnit.recordedTimeouts.forEach((timeoutID) => {
            clearTimeout(timeoutID);
          });
        tapeUnit.recordedTimeouts = [];
        break;
      case `previous`:
        if(tapeUnit.recordedSong) {
          tapeUnit.currentNote = Math.max(tapeUnit.currentNote - 1, 0);
          playNote(tapeUnit.recordedSong[tapeUnit.currentNote], soundBar);
          tapeUnit.currentNote--; 
        }
        untapButton(this);
        break;
      case `current`:
        if(tapeUnit.recordedSong) {
          playNote(tapeUnit.recordedSong[tapeUnit.currentNote], soundBar);
          tapeUnit.currentNote--;
        }
        untapButton(this);
        break;
      case `next`:
        if(tapeUnit.recordedSong) {
          tapeUnit.currentNote = Math.min(tapeUnit.currentNote + 1, tapeUnit.recordedSong.length - 1);
          playNote(tapeUnit.recordedSong[tapeUnit.currentNote], soundBar);
          tapeUnit.currentNote--;
        }
        untapButton(this);
        break;
      default:
        console.log(`ERROR: ID NOT MATCH: `, this);
    }
  } else {
    this.style.opacity = ``;
    this.pressed = false;
  }
}

function untapButton(button) {
  setTimeout(() => {
    button.style.opacity = ``;
    button.pressed = false;
  }, 200);
}

function placeRecord (elmnt) {
  if (currentRecord) {
    return;
  }
  currentRecord = elmnt;
  // currentRecord.style.top = recordPlayer.offsetTop + 68 + 'px';
  // currentRecord.style.left = recordPlayer.offsetLeft + 33 + 'px';
  let recordSnapBounds = document.getElementById(`recordSnap`).getBoundingClientRect();
  currentRecord.style.top = recordSnapBounds.bottom - recordSnapBounds.height / 2 - currentRecord.clientHeight / 2 + "px";
  currentRecord.style.left = recordSnapBounds.right - recordSnapBounds.width / 2 - currentRecord.clientWidth / 2 + "px";
  needle.style.zIndex = "25";
  let tapeUnit = document.getElementById(`tapeUnit`);
  if (tapeUnit.recording) {
    tapeUnit.recordedSong = elmnt.allAudios;
    tapeUnit.recording = false;
    setTimeout(() => {
      let recordButton = document.getElementById(`rec`);
      recordButton.style.opacity = '';
      recordButton.pressed = false;
      tapeUnit.currentNote = 0;
    }, 600 * elmnt.allAudios.length);
  }
  playTune(elmnt.allAudios, elmnt.timeouts, false);
  spin(currentRecord);
}

function playTune(allAudios, timeouts, soundBar) {
  let timeoutDelay = 0;
  allAudios.forEach((audio) => {
    timeouts.push(setTimeout(playNote, timeoutDelay, audio, soundBar));
    timeoutDelay += 600;
  });
}

function playNote(audio, soundBar) {
  if(soundBar) {
    let noteNumber = audio.src.split(`/`).pop().split(`.`)[0];
    let tapeUnit = document.getElementById(`tapeUnit`);
    tapeUnit.currentNote++;
    soundBar.style.width = 6 + (Math.abs(noteNumber) * 27) + "px";
    soundBar.style.left = noteNumber > 0 ? soundBar.originalLeft + "px" : soundBar.originalLeft + (noteNumber * 27) + 6 + "px";
    // soundBar.style.backgroundColor = noteNumber > 0 ? `lime` : `red`;
  }
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function randomAudio() {
  let audioOrder = randomIntArrayInRange(-6,6,10);
  return audioOrder.map((num) => {
    if (num == 0) {
      num = `start`;
    }
    let audio = new Audio(`./audio/${num}.wav`);
    audio.playbackRate = 0.8;
    return audio;
  });
}

function spin(record) {
  record.angle = -1;
  record.spinInterval = setInterval(() => {
    record.angle -= 1;
    record.style.transform = `scale(calc(4/3)) rotate(${record.angle}deg)`;
    if (record.angle == -360) {
      clearInterval(record.spinInterval);
    }
  }, 15);
}

const randomIntArrayInRange = (min, max, n = 1) => 
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
);

function centerDiv(div, parentDiv, horizontalPercent, verticalPercent) {
    div.style.left = (parentDiv.clientWidth - div.clientWidth) * (horizontalPercent  / 100) + 'px';
    div.style.top = (parentDiv.clientHeight - div.clientHeight) * (verticalPercent / 100) + 'px';
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
    newDiv.classList.add(`imgContainer`);
    newDiv.appendChild(this);
    if (imgCallback) {
      imgCallback(newDiv);
    }
  }
}

function addImgInv(src, parentElement, imgCallback) {
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
    placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
		placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
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
    let inventoryItem = Array.from(elmnt.classList).find((value) => {
      return value.includes(`dragItem`);
    });
    if(!inventoryItem) {
      let isRecord = Array.from(elmnt.classList).find((value) => {
        return value.includes(`records`);
      });
      if(isRecord) {
        elmnt.style.transform = "scale(calc(4/3))";
      }
      Array.from(document.querySelectorAll(`.imgContainer`)).forEach((div) => {
        if(div.style.zIndex > elmnt.style.zIndex && div.id != elmnt.id) {
          div.style.zIndex = div.style.zIndex-1;
        }
      });
      if (elmnt == currentRecord) {
        needle.style.zIndex = "1";
        currentRecord = null;
        clearInterval(elmnt.spinInterval);
        elmnt.style.transform = "";
        elmnt.timeouts.forEach((timeoutID) => {
          clearTimeout(timeoutID);
        });
        elmnt.timeouts = [];
        
      }
      elmnt.style.zIndex = Array.from(document.querySelectorAll(`.imgContainer`)).length;
    }
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
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

  function closeDragElement() {
    // stop moving when mouse button is released:
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
    }
    if(!inventoryItem) {
      let recordsOn = overlayCheck(recordPlayer, "records");
      let activeRecord = recordsOn.filter((record) => {
        return record == elmnt;
      });
      if (activeRecord[0]) {
        placeRecord(elmnt);
      } else {
        let isRecord = Array.from(elmnt.classList).find((value) => {
          return value.includes(`records`);
        });
        if(isRecord) {
          elmnt.style.transform = "";
        }
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
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

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}