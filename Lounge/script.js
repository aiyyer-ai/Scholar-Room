var gameArea = document.getElementById(`gameArea`);
var lookingAtFireplace = false;

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
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
	generateHappyRoom();

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
	checkPlates(mirrorCheck);
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
		let mirror = document.getElementById(`mirrorMovement`);
		console.log(mirror);
		mirror.style.transition = `all 1s ease-out`;
		mirror.style.transformOrigin = `-40px -40px 0px`;
		mirror.style.transform = `rotate3d(0, 1, 0, -60deg)`;
	}
}

function generateHappyRoom() {
	var itemPositions = {
		painting: 4,
		statue: 9,
		plant: 2,
		teacup: 1,
		candlestick: 0
	}
	Array.from(document.querySelectorAll(`.HRA`)).forEach((item) =>{
		dragElement(item);
		item.correctPosition = itemPositions[Array.from(item.classList)[0]];
	});
	Array.from(Array(7).keys()).forEach((number) =>{
		let newSnap = document.createElement(`div`);
		newSnap.classList.add(`snap`, `position`, `snap${number}`);
		newSnap.id = number;
		gameArea.appendChild(newSnap);
	});
	let newSnap = document.createElement(`div`);
	newSnap.classList.add(`fireplaceSnap`, `position`);
	newSnap.id = `fireplaceSnap`;
	gameArea.appendChild(newSnap);
}

function happyRoomCheck() {
	let correctItems = true;
	Array.from(document.querySelectorAll(`.HRA`)).forEach((item) =>{
		let onSnap = overlayCheck(item, `snap`)[0];
		if(Array.from(item.classList).includes(`statue`)) {
			if(!item.onFireplace) {
				correctItems = false;
			}
		} else {
			if(item.onFireplace || !onSnap) {
				correctItems = false;
			}
			//instead of true, check if item has onSnap id, gotta get something on the item
			if(onSnap && onSnap.id != item.correctPosition) {
				correctItems = false;
			}
		}
	});	
	if(correctItems) {
		console.log(`all done`);
		dispenseHalfSlip();
		//activate half slip
	}
}

function dispenseHalfSlip() {
	let shelf = document.getElementById(`happyRoomShelf`);
	let halfSlipLoungeA = document.getElementById(`halfSlipLoungeASlider`);
	let hider = document.getElementById(`halfSlipHider`);
	let hiderBounds = hider.getBoundingClientRect();
	halfSlipLoungeA.style.visibility = "visible";
	halfSlipLoungeA.style.transform = `translate(${halfSlipLoungeA.clientWidth / 2}px, 0px)`
	shelf.style.pointerEvents = `none`;
	window.sessionStorage.setItem(`halfSlipState`, `out`);
	setTimeout(() => {
		shelf.style.pointerEvents = ``;
	}, "2000");
}

function lookAtFireplace() {
	lookingAtFireplace = true;
	let disappearingObjects = document.getElementsByClassName(`notFireplace`);
	Array.from(disappearingObjects).forEach((object) => {
		object.style.visibility = `hidden`;
	});
	let flippedObjects = document.getElementsByClassName(`fireplaceFlip`);
	Array.from(flippedObjects).forEach((object) => {
		object.style.transform = `scaleX(-1)`;
		let objectStyles = window.getComputedStyle(object);
		let distanceFromRight = Number(objectStyles.getPropertyValue(`right`).replace(`px`,``)); 
		let distanceFromLeft = Number(objectStyles.getPropertyValue(`left`).replace(`px`,``)); 
		if(distanceFromRight > distanceFromLeft) {
			object.style.left = `auto`;
			object.style.right = distanceFromLeft + "px";
		} else {
			object.style.right = `auto`;
			object.style.left = distanceFromRight + "px";
		}
	});
	let touchObjects = document.getElementsByClassName(`HRA`);
	Array.from(touchObjects).forEach((object) => {
		if(Array.from(object.classList).includes(`painting`)) {
			return;
		}
		let objectStyles = window.getComputedStyle(object);
		let distanceFromRight = Number(objectStyles.getPropertyValue(`right`).replace(`px`,``)); 
		object.style.right = `auto`;
		object.style.left = distanceFromRight + "px";
		if(object.onFireplace) {
			object.style.visibility = `visible`;
		}
	});
	let fireplace = document.getElementById(`fireplace`);
	fireplace.style.visibility = `visible`;
}

function lookAtMirror() {
	lookingAtFireplace = false;
	let fireplace = document.getElementById(`fireplace`);
	fireplace.style.visibility = `hidden`;
	let disappearingObjects = document.getElementsByClassName(`notFireplace`);
	Array.from(disappearingObjects).forEach((object) => {
		object.style.visibility = `visible`;
	});
	let flippedObjects = document.getElementsByClassName(`fireplaceFlip`);
	Array.from(flippedObjects).forEach((object) => {
		object.style.transform = ``;
		let objectStyles = window.getComputedStyle(object);
		let distanceFromRight = Number(objectStyles.getPropertyValue(`right`).replace(`px`,``)); 
		let distanceFromLeft = Number(objectStyles.getPropertyValue(`left`).replace(`px`,``)); 
		if(distanceFromRight > distanceFromLeft) {
			object.style.left = `auto`;
			object.style.right = distanceFromLeft + "px";
		} else {
			object.style.right = `auto`;
			object.style.left = distanceFromRight + "px";
		}
	});
	let touchObjects = document.getElementsByClassName(`HRA`);
	Array.from(touchObjects).forEach((object) => {
		if(Array.from(object.classList).includes(`painting`)) {
			return;
		}
		let objectStyles = window.getComputedStyle(object);
		let distanceFromRight = Number(objectStyles.getPropertyValue(`right`).replace(`px`,``)); 
		object.style.right = `auto`;
		object.style.left = distanceFromRight + "px";
		if(overlayCheck(object, `fireplaceSnap`)[0]) {
			object.onFireplace = true;
			object.style.visibility = `hidden`;
		} else {
			object.onFireplace = false;
		}
	});
	happyRoomCheck();
}
// TODO

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
		if(!lookingAtFireplace) {
			window.location.href = `../Foyer/index.html`;
		} else {
			lookAtMirror();
		}
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
	  let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`)})[0].replace(`Item`, ``);
	  div.style.visibility = `hidden`;
	  let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
	  inventory[item] = true;
	  window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
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
				// if(imgDiv.clientWidth > 200) {
					addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
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

  function addInv(src, parentElement, imgCallback) {
	let newImg = new Image();
	newImg.src = `./inventoryItems/${src}.webp`;
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
		console.log(event.clientX, event.clientY)
		dragElement(placedItem);
		elmnt = placedItem;
		dragMouseDown(event);
		console.log(placedItem);
	}
  
	function dragMouseDown(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // get the mouse cursor position at startup:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	  let parentClasslist = Array.from(e.target.parentElement.classList);
	  if (parentClasslist.includes(`HRA`)) {
		e.target.style.transform = `scale(1.2,1.2)`;
	  }
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
		let inventoryItem = Array.from(elmnt.classList).find((value) => {
			return value.includes(`dragItem`);
		});
		if(!inventoryItem) {
			let parentClasslist = Array.from(event.target.parentElement.classList);
				if (parentClasslist.includes(`HRA`)) {
					if(parentClasslist.includes(`painting`)) {
						let paintingWillSnap = overlayCheck(elmnt, `hook`)[0];
						if(paintingWillSnap) {
							let paintingSnapPoint = overlayCheck(elmnt, `snap`)[0];
							elmnt.style.top = paintingSnapPoint.offsetTop + paintingSnapPoint.clientHeight - elmnt.clientHeight + "px";
							elmnt.style.left = paintingSnapPoint.offsetLeft + paintingSnapPoint.clientWidth / 2 - elmnt.clientWidth / 2 + "px";
						}
					}
					event.target.style.transform = ``;
					happyRoomCheck();
				}
		}
	  // stop moving when mouse button is released:
		  document.onmouseup = null;
		  document.onmousemove = null;
		  let clickLocation = Object.create(locationObject);
		  clickLocation.x = event.clientX;
		  clickLocation.y = event.clientY;
		  let overInventory = overlayCheck(clickLocation, `inventory`)[0];
		  if(overInventory && inventoryItem) {
			elmnt.remove();
			elmnt.originalItem.style.opacity = `100%`;
			elmnt.originalItem.onPage = false;
		  }
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