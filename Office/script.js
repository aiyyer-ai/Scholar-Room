var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code

	//START READING COOKIES
	let vase1Rotation = window.sessionStorage.getItem(`vase1Rotation`);
	let vase1 = document.getElementById('vase1');
	vase1.rotation = vase1Rotation;
	if(vase1Rotation) {
	  vase1.src = `./vase1/images/0_a${vase1Rotation}.webp`;
	}
	let vase2Rotation = window.sessionStorage.getItem(`vase2Rotation`);
	let vase2 = document.getElementById('vase2');
	vase2.rotation = vase2Rotation;
	if(vase2Rotation) {
	  vase2.src = `./vase2/images/1_a${vase2Rotation}.webp`;
	}
	let vase3Rotation = window.sessionStorage.getItem(`vase3Rotation`);
	let vase3 = document.getElementById('vase3');
	vase3.rotation = vase3Rotation;
	if(vase3Rotation) {
	  vase3.src = `./vase3/images/2_a${vase3Rotation}.webp`;
	}

	document.onclick = movementCheck;
	let inventory = window.sessionStorage.getItem(`inventoryOffice`);
	if(!inventory) {
		inventory = {
			halfSlipTop: false,
			plate2: false,
			plate3: false,
			plate4: false,
			plate5: false,
			plate6: false,
			plate7: false,
		};
	  window.sessionStorage.setItem(`inventoryOffice`, JSON.stringify(inventory));
	} else {
	  inventory = JSON.parse(inventory);
	}
	for (item in inventory) {
	  enterInventoryEntry(item, inventory[item]);
	}

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
	checkPlates(mirrorCheck)

	if(inventory.plate3) {
		let plateHas = document.getElementById(`plate3`);
		plateHas.style.visibility = `hidden`;
	}
	if(inventory.plate4) {
		let plateHas = document.getElementById(`plate4`);
		plateHas.style.visibility = `hidden`;		
	}
	if(inventory.plate7) {
		let plateHas = document.getElementById(`plate7`);
		plateHas.style.visibility = `hidden`;		
	}

	//END READING COOKIES

	let tripod = document.getElementById("tripod");
	let tripodBounds = tripod.getBoundingClientRect();
	tripod.bounds = tripodBounds;
	tripod.vaseBounds = [];

	let vase1Bounds = vase1.getBoundingClientRect();
	tripod.vaseBounds[0] = vase1Bounds;

	let vase2Bounds = vase2.getBoundingClientRect();
	tripod.vaseBounds[1] = vase2Bounds;

	let vase3Bounds = vase3.getBoundingClientRect();
	tripod.vaseBounds[2] = vase3Bounds;
}

function checkPlates(mirrorCheck) {
	console.log(mirrorCheck);
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
		mirror.style.transition = `all 1s ease-out`;
		mirror.style.transformOrigin = `-40px -40px 0px`;
		mirror.style.transform = `rotate3d(0, 1, 0, -60deg)`;
	}
}

function halfSlipTrigger(bookshelf) {
	let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryOffice`));
	if(inventory.halfSlipTop) {
		bookshelf.children[bookshelf.children.length - 1].src = `./images/bookshelfOpen.webp`;
		bookshelf.children[bookshelf.children.length - 2].style.transform = `translateX(120px)`;
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
	if(Array.from(event.target.classList).includes(`leave`)) {
	  window.location.href = `../Foyer/index.html`;
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
	  let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryOffice`));
	  inventory[item] = true;
	  window.sessionStorage.setItem(`inventoryOffice`, JSON.stringify(inventory));
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
		e.target.style.height = e.target.clientHeight * 1.15 + "px";
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
		let parentClasslist = Array.from(event.target.parentElement.classList);
			if (parentClasslist.includes(`HRA`)) {
				event.target.style.height = event.target.clientHeight / 1.15 + "px";
			}
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

function toggleCamera() {
	let camera = document.getElementById("tripod");
	let table = document.getElementById('tableHolder');
	let cameraCrop = document.getElementById('cameraCrop');
	if (camera.children[0].src.includes(`tripod.webp`)) {
		//Camera Change
		camera.firstElementChild.src = "./images/camera.webp";
		camera.classList.remove("tripod");
		camera.classList.add("cameraClose");
		camera.style.height = window.innerHeight * 2 + "px";
		camera.style.top = -(window.innerHeight / 1.25) + "px";
		camera.style.left = -(window.innerWidth / 20) + "px";
		console.log(camera);
		//Add Camera 'Viewport' Crop
		cameraCrop.style.display = "inline";
		cameraCrop.style.width = `${camera.clientWidth * (228/498)}px`;
		cameraCrop.style.left = 232 + "px"
		cameraCrop.style.top = 93 + "px"
		let cropBounds = cameraCrop.getBoundingClientRect();
		camera.cropBounds = cropBounds;
		console.log(cameraCrop);
		//Hiding Elements
		table.style.visibility = "hidden";
		Array.from(document.querySelectorAll(".cup")).forEach((cup) => {
			cup.style.visibility = "hidden";
		});
		//Vases Change
		Array.from(document.querySelectorAll(".vase")).forEach((vase) => {
			cameraCrop.appendChild(vase);
			let trueVase = vase.firstElementChild.firstElementChild;
			let vaseNum = Number(vase.id.replace("vaseHolder",""));
			let srcString = trueVase.src;
			newSrc = srcString.replace(srcString.substr(-8), srcString.substr(-8).replace(`a`, `f`));
			vase.style.top = -30 + 'px';
			vase.style.height = window.innerHeight * .95 + "px";
			vase.style.left = `${((trueVase.clientWidth * .8) * (vaseNum - 1)) - 25}px`;
			trueVase.src = `${newSrc}`;
		});
		if (vase1.rotation == '2' && vase2.rotation == '2' && vase3.rotation == '2') {
			window.sessionStorage.setItem(`drawerState`, 'open');
		}
	}
	else if (camera.children[0].src.includes(`camera.webp`)) {
		//Camera Change
		camera.firstElementChild.src = "./images/tripod.webp"
		camera.classList.remove("cameraClose");
		camera.classList.add("tripod");
		camera.style.height = camera.bounds.height + "px";
		camera.style.top = camera.bounds.top + "px";
		camera.style.left = camera.bounds.left + "px";
		//Removing 'Viewport'
		cameraCrop.style.display = "none";
		cameraCrop.style.height = camera.cropBounds.height + "px";
		cameraCrop.style.width = camera.cropBounds.width + "px";
		cameraCrop.style.top = camera.cropBounds.top + "px";
		cameraCrop.style.left = camera.cropBounds.left + "px";
		//Hiding Elements
		table.style.visibility = "visible";
		Array.from(document.querySelectorAll(".cup")).forEach((cup) => {
			cup.style.visibility = "visible";
		});
		//Vases Change
		Array.from(document.querySelectorAll(".vase")).forEach((vase) => {
			let gameArea = document.getElementById("gameArea");
			gameArea.append(vase);
			let trueVase = vase.firstElementChild.firstElementChild;
			let vaseNum = Number(vase.id.replace("vaseHolder",""));
			let srcString = trueVase.src;
			newSrc = srcString.replace(srcString.substr(-8), srcString.substr(-8).replace(`f`, `a`));
			vase.style.height = tripod.vaseBounds[vaseNum - 1].height  + "px";
			vase.style.width = tripod.vaseBounds[vaseNum - 1].width  + "px";
			vase.style.top = tripod.vaseBounds[vaseNum - 1].top  + "px";
			vase.style.left = tripod.vaseBounds[vaseNum - 1].left  + "px";
			trueVase.src = `${newSrc}`;
		});
	}
}