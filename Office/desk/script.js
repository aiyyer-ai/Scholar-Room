var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
  let drawerState = window.sessionStorage.getItem(`drawerState`);
  let drawer = document.getElementById(`drawerCheck`);
  if (drawerState == "open") {
    drawer.onclick = toggleDrawer;
    let desk = document.getElementById(`desk`);
    let trueDesk = desk.firstElementChild;
    trueDesk.src = "./images/deskOpen.webp";
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
  Array.from(document.querySelectorAll(`.plates`)).forEach((plate) => {
    plate.style.top = Math.max(Math.round(Math.random() * window.innerHeight - plate.clientHeight), 10) + "px";
    plate.style.left = window.innerHeight - plate.offsetTop + "px";
  });
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
	if(overlayCheck(clickLocation, "leave")[0]) {
	              setTimeSpent();
            window.location.href = `../index.html`;
	}
}

function toggleDrawer() {
  let desk = document.getElementById(`desk`);
  if (!desk.bounds) {
    let deskBounds = desk.getBoundingClientRect();
    desk.bounds = deskBounds;
  }
  let globe = document.getElementById(`globe`);
  let floor = document.getElementById(`floor`);
  let trueDesk = desk.firstElementChild;
  if (trueDesk.src.includes(`desk`)) {
    //switch to Drawer image
    trueDesk.src = "./images/openDrawer.webp";
    trueDesk.classList.remove(`desk`);
    trueDesk.classList.add('openDrawer');
    //hide elements
    globe.style.visibility = "hidden";
    floor.style.visibility = "visible";
    //position the desk
    desk.style.top = 0 + "px";
    desk.style.left = 0 + "px";
    desk.style.height = `100%`;
    //reveal the plates
    let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryOffice`));
    Array.from(document.querySelectorAll(`.plates`)).forEach((plate) => {
      if(!inventory[plate.id]) {
        plate.style.visibility = `visible`;
      }
    });
  } else if (trueDesk.src.includes(`openDrawer`)){
    //switch to desk image
    trueDesk.src = "./images/deskOpen.webp";
    trueDesk.classList.remove(`openDrawer`);
    trueDesk.classList.add('desk');
    //make elements visible
    globe.style.visibility = "visible";
    floor.style.visibility = "hidden";
    //position the desk back
    desk.style.height = desk.bounds.height + "px";
    desk.style.top = desk.bounds.top + "px";
    desk.style.left = desk.bounds.left + "px";
    //hide the plates
    Array.from(document.querySelectorAll(`.plates`)).forEach((plate) => {
      plate.style.visibility = `hidden`;
    });
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