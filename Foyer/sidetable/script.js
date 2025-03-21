var trait1Name = `A`;
var trait2Name = `B`;
var trait3Name = `C`;
var allInputs = document.getElementsByClassName('inputs');
var snapToWidth = [];
var snapToWidthClue1 = [];
var snapToWidthClue2 = [];
var bookPositions = {};
var gameScreen = document.getElementById("game");
var totalBooks, correctAnswer;
var ruletraitOrders = [`ABABACA`,`AABAACB`, `AABCBAA`, `BAACAAB`];
var bookHeights = `500px`;
var glassActive = true;
var allCheckboxes = [{id:"rule1"}, {id:"rule2"}, {id:"rule3"}];

Array.from(allInputs).forEach(function(singleInput){
  singleInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13 || singleInput.value.length == 1) {
      // Focus on the next sibling
      singleInput.nextElementSibling.focus();
      singleInput.nextElementSibling.select();
    }
  });
})

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
	document.onclick = movementCheck;
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
		glassActive = false;
	}

	startGame(["ABACABA"], [4,2,1, "AAAABBC"], phoneData.order);
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

function tryValues() {
	var trait1 = document.getElementById("trait1A").value;
	var trait2 = document.getElementById("trait1B").value;
	var trait3 = document.getElementById("trait1C").value;
	var allTraits = `${trait1Name.repeat(trait1)}${trait2Name.repeat(trait2)}${trait3Name.repeat(trait3)}`;
	var allPermutations = allPerms(allTraits);
	//apply the rules
	allPermutations = applyRules(allPermutations);

	var results = `${allPermutations.length}`;

	for (permutation of allPermutations) {
		results = results.concat(`<br>`, permutation);
	}
	let resultDiv = document.getElementById("results");
	resultDiv.innerHTML = results;
	
	if(allPermutations.length == 1) {
		var gameData = [Number(trait1), Number(trait2), Number(trait3), allTraits];
		var tryThis = document.getElementById("tryThis");
		tryThis.style.display = "inline";
		tryThis.style.fontSize = "18px";
		tryThis.style.padding = "6px 10px";
		tryThis.onclick = function() {startGame(allPermutations, gameData);};
	} else {
		var tryThis = document.getElementById("tryThis");
		tryThis.style.display = "none";
	}
}

function applyRules(allPermsArray) {
	//must be in series order
	if(document.getElementById("rule2").checked) {
		allPermsArray = allPermsArray.filter((value, index) => allPermsArray.indexOf(value) === index);		
	}

	//must be palindromic
	if(document.getElementById("rule3").checked) {
		allPermsArray = allPermsArray.filter((value, index) => {
		  let re = /[\W_]/g;
		  let lowRegStr = value.toLowerCase().replace(re, '');
		  let reverseStr = lowRegStr.split('').reverse().join(''); 
		  return reverseStr === lowRegStr;
		});	
	}

	return allPermsArray;
}

const allPerms = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Parameter must be a string.');
  }

  if (string === '') {
    throw new Error('Parameter cannot be an empty string.');
  }


  const perms = (str) => {
    const result = [];
    if (str.length < 2) return [str];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const otherChars = str.substring(0, i) + str.substring(i + 1);
      const otherPerms = perms(otherChars);
      otherPerms.forEach(x => {
        result.push(char + x)
      });
    }
    return result;
  }

  const permutations = perms(string);
	if(document.getElementById("rule1").checked) {
	  const hasRepeat = (str) => {
	    let prevChar = str[0];
	    for (let i = 1; i < str.length; i++) {
	      if (prevChar === str[i]) return true;
	      prevChar = str[i];
	    }
	    return false;
	  }

	  const noRepeatPerms = [];
	  for (const str of permutations) {
	    if (!hasRepeat(str)) {
	      noRepeatPerms.push(str);
	    }
	  }

	  return noRepeatPerms;
	} else {
		return permutations;
	}
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	let inventoryItem = Array.from(elmnt.classList).find((value) => {
		return value.includes(`inventoryItem`);
	  });
	  if(inventoryItem) {
		elmnt.onmousedown = copyAndDrag;
	  } else {
		elmnt.onmousedown = dragMouseDown;
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
		    Array.from(document.querySelectorAll(`.books`)).forEach((div) => {
		      if(div.style.zIndex > elmnt.style.zIndex && div.id != elmnt.id) {
		        div.style.zIndex = div.style.zIndex-1;
		      }
		    });
		    elmnt.style.zIndex = Array.from(document.querySelectorAll(`.books`)).length;
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        return false;
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - parseInt(e.clientX);
        pos2 = pos4 - parseInt(e.clientY);
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
    		let transitionTime = 0.2;
        document.onmouseup = null;
        document.onmousemove = null;
		let inventoryItem = Array.from(elmnt.classList).find((value) => {
			return value.includes(`dragItem`);
		  });
		if(inventoryItem) {
			let clickLocation = Object.create(locationObject);
			clickLocation.x = event.clientX;
			clickLocation.y = event.clientY;
			let overInventory = overlayCheck(clickLocation, `inventory`)[0];
			if(overInventory && inventoryItem) {
			  elmnt.remove();
			  elmnt.originalItem.style.opacity = `100%`;
			  elmnt.originalItem.onPage = false;
			  if(elmnt.originalItem.isPeg) {
				  elmnt.originalItem.parentElement.onPage = false;
			  }
			}
		} else {

			elmnt.style.top = `${gameScreen.offsetTop}px`;
			let placeLocation = closest(e.clientX - gameScreen.parentElement.offsetLeft,snapToWidth);
			if(!Number.isFinite(placeLocation)){
				elmnt.style.left = bookPositions[elmnt.id] + "px"; 
				return false;
			}
			let oldLocation = bookPositions[elmnt.id];
			let newLocationBookID = getKeyByValue(bookPositions, placeLocation);
			let newLocationBook = document.getElementById(newLocationBookID);
			newLocationBook.style.transition = `all ${transitionTime}s ease-out`;
			elmnt.style.transition = `all ${transitionTime}s ease-out`;
			newLocationBook.addEventListener(`transitionend`, removeTransition);
			elmnt.addEventListener(`transitionend`, removeTransition);
			newLocationBook.style.left = oldLocation + "px";
		 // THIS WILL BE CODE THAT SHIFTS THINGS OVER
			if(placeLocation < oldLocation) {
				let shiftSnaps = snapToWidth.slice(snapToWidth.indexOf(placeLocation), snapToWidth.indexOf(oldLocation)+1);
				let moveNum = 0;
				let bookNewPositions = {};
				for (const i of shiftSnaps) {
					moveNum++;
					if(i != shiftSnaps[shiftSnaps.length-1]) {
						let newLocationBookID = getKeyByValue(bookPositions, i);
						let newLocationBook = document.getElementById(newLocationBookID);
						newLocationBook.style.transition = `all ${transitionTime}s ease-out`;
						newLocationBook.addEventListener(`transitionend`, removeTransition);
						newLocationBook.style.left = `${shiftSnaps[moveNum]}px`;
						bookNewPositions[newLocationBookID] = shiftSnaps[moveNum];
					}
				}
				for (const swapper in bookNewPositions) {
					bookPositions[swapper] = bookNewPositions[swapper];
				}
			} else if (placeLocation > oldLocation) {
				let shiftSnaps = snapToWidth.slice( snapToWidth.indexOf(oldLocation),snapToWidth.indexOf(placeLocation)+1);
				let moveNum = 0;
				let bookNewPositions = {};
				shiftSnaps = shiftSnaps.reverse();
				for (const i of shiftSnaps) {
					moveNum++;
					if(i != shiftSnaps[shiftSnaps.length-1]) {
						let newLocationBookID = getKeyByValue(bookPositions, i);
						let newLocationBook = document.getElementById(newLocationBookID);
						newLocationBook.style.transition = `all ${transitionTime}s ease-out`;
						newLocationBook.addEventListener(`transitionend`, removeTransition);
						newLocationBook.style.left = `${shiftSnaps[moveNum]}px`;
						bookNewPositions[newLocationBookID] = shiftSnaps[moveNum];
					}
				}
				for (const swapper in bookNewPositions) {
					bookPositions[swapper] = bookNewPositions[swapper];
				}
			}
			bookPositions[elmnt.id] = placeLocation;
			let idArray = Object.keys(bookPositions).sort((a, b) => {
				return bookPositions[a] - bookPositions[b];
			});
			let phoneData = JSON.parse(window.sessionStorage.getItem(`phoneData`));
			phoneData.order = idArray;
			window.sessionStorage.setItem(`phoneData`, JSON.stringify(phoneData));
			elmnt.style.left = placeLocation + "px"; 
			let firstCheck = checkFirstIndicator();
			let secondCheck = checkSecondIndicator();
			let thirdCheck = checkThirdIndicator();
			let studyCheck = Object.keys(JSON.parse(window.sessionStorage.getItem(`inventory`))).includes(`faxSlip`);
			console.log(idArray);
			if (studyCheck) {
				if (arraysEqual(idArray, [`bookDiv4`,`bookDiv3`, `bookDiv0`, `bookDiv5`, `bookDiv1`, `bookDiv2`, `bookDiv6`])) {
					dispenseBook();
				}
			}
			//    if(firstCheck && secondCheck && thirdCheck) {
				// document.querySelectorAll('.books').forEach(item => {
				//     item.style.backgroundColor = "#186132";
				// })
			//    }
		}
    	}
}

function removeTransition(event) {
	event.target.style.transition = ``;
}

function checkFirstIndicator() {
	//traits cannot touch another of the same trait
	let lastBookTrait = ``;
	let firstIndicator = document.getElementById(`rule1Indicator`);
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,1);
		if(currentBookTrait == lastBookTrait) {
			firstIndicator.style.backgroundColor = `#186132`;
			return false;
		} else {
			lastBookTrait = currentBookTrait;
		}
	}
	firstIndicator.style.backgroundColor = `#b0e476`;
	return true;
}

function checkSecondIndicator() {
	//traits must be in series order
	let letterArrayIndicator = [0, 0, 0];
	let secondIndicator = document.getElementById(`rule2Indicator`);
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,2);
		if (currentBookTrait.charAt(0) == `A`) {
			letterArrayIndicator[0]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[0]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;
			}
		} else if (currentBookTrait.charAt(0) == `B`) {
			letterArrayIndicator[1]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[1]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;
			}
		} else {
			letterArrayIndicator[2]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[2]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;	
			}
		}
	}
		secondIndicator.style.backgroundColor = `#b0e476`;
		return true;
}

function checkThirdIndicator() {
	//traits must be palindromic
	let thirdIndicator = document.getElementById(`rule3Indicator`);
	let positionalString = [];
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,1);
		positionalString.push(currentBookTrait);
	}
	if(positionalString.join(``) != positionalString.reverse().join(``)) {
		thirdIndicator.style.backgroundColor = `#186132`;
		return false;	
	}
	thirdIndicator.style.backgroundColor = `#b0e476`;
	return true;
}

function closest(val,arr){
    return Math.max.apply(null, arr.filter(function(v){return v <= val}))
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function startGame(permutationArray, startData, startOrder) {
	correctAnswer = permutationArray;
	var allTraits = startData.pop();
	totalBooks = startData.reduce((accumulator, currentValue) => {
  		return accumulator + currentValue
	},0);
	let indicatorLights = document.getElementsByClassName(`indicators`);
	let photographs = document.getElementsByClassName('others');
	let photographIterator = 0;
	Array.from(photographs).forEach(function(photograph){
		photograph.traitOrder = ruletraitOrders[photographIterator];
		photograph.altID = photographIterator;
		photographIterator++;
	});
	let onIndicators = [
		`rule1Indicator0`,
		`rule2Indicator1`,
		`rule3Indicator3`,
		`rule2Indicator4`,
		`rule3Indicator4`,
	];
	Array.from(indicatorLights).forEach(function(singleIndicator){
		// singleIndicator.style.height = `7vh`;
		singleIndicator.style.width = `100px`;
		Array.from(allCheckboxes).forEach(function(singleInput){
			let indicatorLight = document.createElement("div");
			indicatorLight.classList.add(`indicator`);
			if(singleIndicator.id == indicatorLights[0].id) {
				indicatorLight.id = `${singleInput.id}Indicator`;		
			} else{
				indicatorLight.id = `${singleInput.id}Indicator${Array.from(indicatorLights).indexOf(singleIndicator)}`;
				// console.log(indicatorLight);
				if(onIndicators.includes(indicatorLight.id)) {
					indicatorLight.style.backgroundColor = `#b0e476`;
				}
			}

			indicatorLight.style.width = `40px`;
			indicatorLight.style.height = `40px`;
			singleIndicator.appendChild(indicatorLight);
		});
	});
	gameScreen.style.height = bookHeights;
	gameScreen.style.width = bookHeights.replace(`px`,``) * 1.3 + `px`;
	let bookNum = 1;
	let actualSizes = [];
	for (let i = 0; i < totalBooks; i++) {
		let bookDivHole = document.createElement("div");
		bookDivHole.classList.add(`bookHoles`);
		let bookDiv = document.createElement("div");
		bookDiv.classList.add(`books`);
		if(allTraits.charAt(i) == allTraits.charAt(i-1)) {
			bookNum++;
		} else {
			bookNum = 1;
		}
		if (allTraits.charAt(i) == `A`) {
			//bookDiv.innerHTML = `${historyTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		} else if (allTraits.charAt(i) == `B`) {
			//bookDiv.innerHTML = `${mathTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		} else {
			//bookDiv.innerHTML = `${artTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		}
		bookDiv.id = `bookDiv${i}`;
		bookDiv.zIndex = i+1;
		bookDiv.style.backgroundImage = `url("./allbooks/book${i+1}.webp")`;
		if(glassActive) {
			var glassPosition = document.getElementById('glassPosition');
			glassPosition.classList.add("glass");
		} else {
			var stickynote = document.getElementById('sticky');
			stickynote.style.visibility = "hidden";
			dragElement(bookDiv);	
		}
		
		gameScreen.appendChild(bookDivHole);
		actualSizes[0] = `${bookDivHole.clientHeight}px`;
		actualSizes[1] = `${bookDivHole.clientWidth}px`;
		bookDivHole.appendChild(bookDiv);
		let snapToDistance = gameScreen.clientWidth / totalBooks;
		snapToWidth.push(Math.ceil(i * snapToDistance) + gameScreen.offsetLeft + 3);
		bookDiv.style.left = `${snapToWidth[snapToWidth.length - 1]}px`;
		bookDiv.style.top = `${gameScreen.offsetTop}px`;
		bookPositions[bookDiv.id] = snapToWidth[snapToWidth.length - 1];
	}
	let allBooks = document.getElementsByClassName('books');
	Array.from(allBooks).forEach(function(singleBooks){
		singleBooks.style.height = gameScreen.style.height;
		singleBooks.style.width = actualSizes[1];
		//singleBooks.style.width = `${singleBooks.style.height.replace(/\D/g,'')/4.9}vh`;
		singleBooks.style.backgroundSize = `${singleBooks.style.width} ${singleBooks.style.height}`;
	});
	let snapPointArray = Object.values(bookPositions);
	let idArray = Object.keys(bookPositions);

	// shuffle(idArray);
	// let phoneData = JSON.parse(window.sessionStorage.getItem(`phoneData`));
	// idArray = phoneData.order;
	idArray = startOrder;
	
	for (const id of idArray) {
		let idDiv = document.getElementById(id);
		idDiv.style.left = `${snapToWidth[idArray.indexOf(id)]}px`;
		bookPositions[id] = snapToWidth[idArray.indexOf(id)];
	}
	allBooks = document.getElementsByClassName('books2');
	Array.from(allBooks).forEach(function(singleBooks){
		singleBooks.style.height = actualSizes[0];
		singleBooks.style.width = actualSizes[1];
		singleBooks.style.backgroundSize = `${singleBooks.style.width} ${singleBooks.style.height}`;
	});
	checkFirstIndicator();
	checkSecondIndicator();
	checkThirdIndicator();  
}

function dispenseBook() {
	let drawer = document.getElementById(`drawer`);
	drawer.style.left = `0%`;

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
  