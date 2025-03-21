var correctCombination = [7, 0, 5, 2];
var currentCombination = [0, 0, 0, 0];

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
	//debug test state from study
	let debug = false;
	if(debug) {
		let inventory = window.sessionStorage.getItem(`inventory`);
	
		if (!inventory) {
			window.sessionStorage.setItem(`fuseBoxData`, '{"hats":true,"books":true}');
			window.sessionStorage.setItem(`hatRackData`, '{"gradCap":"pegs,0,0","flatCap":"pegs,1,1","fedora":"pegs,2,3","visor":"pegs,0,2"}');
			// window.sessionStorage.setItem(`inventory`, '{"gradCap":false,"flatCap":false,"fedora":false,"visor":false,"pegs":0}');
			window.sessionStorage.setItem(`inventory`, '{"scholarDiary":false,"faxPaper":false, "faxSlip":true, "gradCap": false, "flatCap": false, "fedora": false, "visor": false}');
			window.sessionStorage.setItem(`phoneData`, '{"glass":false,"order":["bookDiv0","bookDiv4","bookDiv1","bookDiv6","bookDiv2","bookDiv5","bookDiv3"]}');
			window.sessionStorage.setItem(`wallInfo`, '{"paintingA":7,"paintingB":0,"paintingC":5,"paintingD":2}');
		}
	}
	// end debug test state
	let inventory = window.sessionStorage.getItem(`inventory`);

	if(!inventory) {
		inventory = {
			gradCap: false,
			flatCap: false,
			fedora: false,
			visor: false,
			pegs: 0,
		};
		window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
	} else {
		inventory = JSON.parse(inventory);
	}
	for (item in inventory) {
		enterInventoryEntry(item, inventory[item]);
	}
	let hatData = window.sessionStorage.getItem(`hatRackData`);
	if(!hatData) {
	  hatData = {
			  gradCap: false,
			  flatCap: false,
			  fedora: false,
			  visor: "pegs,1,3",
	  }
	  window.sessionStorage.setItem(`hatRackData`, JSON.stringify(hatData));
	} else {
	  hatData = JSON.parse(hatData);
	}
	if(inventory.flatCap || hatData.flatCap) {
		let flatCap = document.getElementById('flatCap');
		flatCap.style.visibility = `hidden`;
	}
	if(inventory.fedora || hatData.fedora) {
		let fedora = document.getElementById(`fedora`);
		fedora.style.visibility = `hidden`;
	}
	if(inventory.gradCap || hatData.gradCap) {
		let gradCap = document.getElementById('gradCap');
		gradCap.style.visibility = `hidden`;
	} else {
		let bustGlass = document.getElementById('bustGlass');
		dragElement(bustGlass);
	}
	let wallData = window.sessionStorage.getItem(`wallInfo`);
	if(!wallData) {
		wallData = {
		paintingA: -1, 
		paintingB: -1, 
		paintingC: -1, 
		paintingD: -1, 
		}
		window.sessionStorage.setItem(`wallInfo`, JSON.stringify(wallData));
	} else {
		if (!inventory.fedora) {
			wallData = JSON.parse(wallData);
			currentCombination = [Number(wallData.paintingA), Number(wallData.paintingB), Number(wallData.paintingC), Number(wallData.paintingD)];
			if(arraysEqual(currentCombination, correctCombination)) {
				let chandelier = document.getElementById("chandelier");
				chandelier.style.transform = `translate(0px, 400px)`
			}
		} else {
			let chandelier = document.getElementById("chandelier");
			chandelier.style.transition = `none`;
			chandelier.style.top = `0px`;
			let fedora = document.getElementById("fedora");
			fedora.style.visibility = "hidden";
		}
	}

	let fuseBoxData = window.sessionStorage.getItem(`fuseBoxData`);
	if(!fuseBoxData) {
		fuseBoxData = {
			hats: false,
			books: false,
		}
		window.sessionStorage.setItem(`fuseBoxData`, JSON.stringify(fuseBoxData));
	} else {
		fuseBoxData = JSON.parse(fuseBoxData);
	}
	for(data of Object.keys(fuseBoxData)) {
		let doorPair = {hats: `Lounge`, books: 'Office'};
		let doneCheck = fuseBoxData[data];
		if(doneCheck == true) {
			let lightToChange = document.getElementById(`light${doorPair[data]}`)
			lightToChange.state = 'complete';
			lightToChange.style.backgroundColor = "yellow";
		}
	}
	//both lights are yellow
	let loungeLight = document.getElementById('lightLounge');
	let officeLight = document.getElementById('lightOffice');
	if(loungeLight.state == 'complete' && officeLight.state == 'complete') {
		loungeLight.style.backgroundColor = "lime";
		officeLight.style.backgroundColor = "lime";
		loungeLight.parentElement.parentElement.canAccess = true;
		officeLight.parentElement.parentElement.canAccess = true;

	}

	let studyLight = document.getElementById('lightStudy');
      console.log(inventory);
	if (Object.keys(inventory).includes(`faxSlip`)) {
		studyLight.style.backgroundColor = "lime";
		studyLight.parentElement.parentElement.canAccess = true;
	}

	let phoneData = window.sessionStorage.getItem(`phoneData`);
	if(!phoneData) {
	  phoneData = {
		glass: true,
		order: [`bookDiv3`,`bookDiv1`, `bookDiv0`, `bookDiv4`, `bookDiv6`, `bookDiv5`, `bookDiv2`],
	  };
	  window.sessionStorage.setItem(`phoneData`, JSON.stringify(phoneData));
	} else {
	  phoneData = JSON.parse(phoneData);
	}
	if(!phoneData.glass) {
		let bookTable = document.getElementById(`bookTable`);
		bookTable.src = `./images/bookTable.webp`;
	}

	//END READING COOKIES
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
	if(item == `pegs`) {
		inventory[item] = Math.min(Number(inventory[item]) + 1, 4);
	  } else {
		inventory[item] = true;
	  }
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
		if(item == "pegs") {
			let pegs = document.createElement(`div`);
			pegs.id = item;
			pegs.style.width = inventoryDiv.clientHeight + "px";
			pegs.style.height = inventoryDiv.clientHeight + "px";
			pegs.classList.add(`inventoryItem`);
			dragElement(pegs);
			inventoryDiv.appendChild(pegs);
			let appendFixer = 0;
			for(i = 1; i <= 4; i++) {
				let imgNum = i;
				addInv(`${item}`, pegs, (imgDiv) => {
					imgDiv.style.position = `relative`;
					imgDiv.id = `${imgNum}peg`;
					imgDiv.style.transform = `rotate(-120deg)`;
					imgDiv.style.height = pegs.clientWidth * 0.70 + "px";
					imgDiv.style.left = 100 - 40 * imgNum + "px";
					imgDiv.style.top = -27 + 20 * imgNum + "px";
					changeItemVisibility(item, itemValue);
					appendFixer++;
					if(appendFixer == 4) {
						sortPegs(pegs);
					}
				});				
			}

			function sortPegs(pegHolder) {
				let correctOrder = Array.from(pegHolder.children).sort(function(a, b) {
					return Number(Array.from(a.id)[0]) - Number(Array.from(b.id)[0]);
				});
				for (peg of correctOrder) {
					pegHolder.appendChild(peg);
				}
			}
		} else {
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
		}
	} else {
		changeItemVisibility(item, itemValue);
	}
	function changeItemVisibility(item, itemValue) {
		inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
		if(item == "pegs") {
			for(i = 1; i <= 4; i++) {
				let pegDiv = document.getElementById(`${i}peg`);
				if(pegDiv) {
					pegDiv.style.display = ``;
				}
			} 
			for(i = 4; i > itemValue; i--) {
				let pegDiv = document.getElementById(`${i}peg`);
				if(pegDiv) {
					pegDiv.style.display = `none`;
				}
			}
		} else {
			if(!itemValue) {
				inventoryElement.style.display = `none`;
			} else {
				inventoryElement.style.display = ``;
			}
		}
	}
}

function goToRoom(div) {
	let room = Array.from(div.classList).filter((classes) => { return classes.includes(`door`)})[0].replace(`door`, ``);
	if(div.canAccess) {
            setTimeSpent();
		window.location.href = `../${room}/index.html`;
	} else {
		return;
	}
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
		if(this.id == `pegs`) {
			let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage})[0];
			placedItem = nextPeg.cloneNode(true);
			placedItem.style.height = 100 + "px";
			placedItem.style.width = 100 + "px";
			nextPeg.style.opacity = `50%`;
			nextPeg.onPage = true;
			nextPeg.isPeg = true;
			placedItem.originalItem = nextPeg;
			if(Array.from(this.children).filter((peg) => { return !peg.onPage}).length == 0) {
				this.onPage = true;
			}
		} else {
			placedItem = this.cloneNode(true);
			placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
			placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
			if (this.children.length > 1) {
				placedItem.children[0].style.display = ``;
				placedItem.children[1].style.display = `none`;
				placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
				placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
			}
			this.style.opacity = `50%`;
			this.onPage = true;
			placedItem.originalItem = this;
		}
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
			if(elmnt.originalItem.isPeg) {
				elmnt.originalItem.parentElement.onPage = false;
			}
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
  
	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
  }
  