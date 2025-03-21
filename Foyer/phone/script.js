var voicemailaudio = new Audio('./audio/voicemail.wav');
var security = new Audio('./audio/required.wav');
var question1 = new Audio('./audio/q1.wav');
var question2 = new Audio('./audio/q2.wav');
var question3 = new Audio('./audio/q3.wav');
var granted = new Audio('./audio/granted.wav');
var thunk = new Audio('./audio/thunk.wav');
var faxSounds = new Audio('./audio/faxSounds.wav');
var scholarCall = new Audio('./audio/scholarCallNew.wav');
var allAudios = [security, question1, question2, question3, granted];
var buttonAudios = {};
const STR_TO_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, zero: 0, star: "*", pound: "#", reciever: "!" };
for (var i = 0; i < Object.keys(STR_TO_NUM).length; i++) {
      let keyKeys = Object.keys(STR_TO_NUM);
      buttonAudios[keyKeys[i]] = new Audio(`./audio/beeps/${keyKeys[i]}.wav`);
}
var questionsStarted = false;
var currentAudio = -1;
var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code

      //in case I want to make something run at launch
      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory) {
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
      if (Array.from(event.target.classList).includes(`leave`)) {
            setTimeSpent();
            window.location.href = `../index.html`;
      }
}

function pullDownInv(inventoryDiv) {
      if (inventoryDiv.target) {
            inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      }
      inventoryDiv.style.opacity = `100%`;
      inventoryDiv.style.top = 0 + "px";
}

function pullUpInv(inventoryDiv) {
      if (inventoryDiv.target) {
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
      if (clickedItem) {
            inventoryDiv.toggled = false;
      }
      if (!inventoryDiv.toggled) {
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
      let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`) })[0].replace(`Item`, ``);
      div.style.visibility = `hidden`;
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
      if (item == `pegs`) {
            inventory[item] = Math.min(Number(inventory[item]) + 1, 4);
      } else {
            inventory[item] = true;
      }
      window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      if (!inventoryDiv.toggled) {
            pullDownInv(inventoryDiv);
            setTimeout(pullUpInv, 800, inventoryDiv);
      }
      enterInventoryEntry(item, inventory[item]);

}

function enterInventoryEntry(item, itemValue) {
      let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      let inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item })[0];
      if (!inventoryElement) {
            if (item == "pegs") {
                  let pegs = document.createElement(`div`);
                  pegs.id = item;
                  pegs.style.width = inventoryDiv.clientHeight + "px";
                  pegs.style.height = inventoryDiv.clientHeight + "px";
                  pegs.classList.add(`inventoryItem`);
                  dragElement(pegs);
                  inventoryDiv.appendChild(pegs);
                  let appendFixer = 0;
                  for (i = 1; i <= 4; i++) {
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
                              if (appendFixer == 4) {
                                    sortPegs(pegs);
                              }
                        });
                  }

                  function sortPegs(pegHolder) {
                        let correctOrder = Array.from(pegHolder.children).sort(function (a, b) {
                              return Number(Array.from(a.id)[0]) - Number(Array.from(b.id)[0]);
                        });
                        for (peg of correctOrder) {
                              pegHolder.appendChild(peg);
                        }
                  }
            } else {
                  addInv(`${item}`, inventoryDiv, (imgDiv) => {
                        if (imgDiv) {
                              imgDiv.id = item;
                              imgDiv.classList.add(`inventoryItem`);
                              addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
                                    if (altImgDiv) {
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
            inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item })[0];
            if (item == "pegs") {
                  for (i = 1; i <= 4; i++) {
                        let pegDiv = document.getElementById(`${i}peg`);
                        if (pegDiv) {
                              pegDiv.style.display = ``;
                        }
                  }
                  for (i = 4; i > itemValue; i--) {
                        let pegDiv = document.getElementById(`${i}peg`);
                        if (pegDiv) {
                              pegDiv.style.display = `none`;
                        }
                  }
            } else {
                  if (!itemValue) {
                        inventoryElement.style.display = `none`;
                  } else {
                        inventoryElement.style.display = ``;
                  }
            }
      }
}

function goToRoom(div) {
      let room = Array.from(div.classList).filter((classes) => { return classes.includes(`door`) })[0].replace(`door`, ``);
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
            if (parentElement) {
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
            if (parentElement) {
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
            if (inventoryItem) {
                  elmnt.onmousedown = copyAndDrag;
            } else {
                  elmnt.onmousedown = dragMouseDown;
            }
      }

      function copyAndDrag(event) {
            if (this.onPage) {
                  return;
            }
            let placedItem;
            if (this.id == `pegs`) {
                  let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage })[0];
                  placedItem = nextPeg.cloneNode(true);
                  placedItem.style.height = 100 + "px";
                  placedItem.style.width = 100 + "px";
                  nextPeg.style.opacity = `50%`;
                  nextPeg.onPage = true;
                  nextPeg.isPeg = true;
                  placedItem.originalItem = nextPeg;
                  if (Array.from(this.children).filter((peg) => { return !peg.onPage }).length == 0) {
                        this.onPage = true;
                  }
            } else {
                  placedItem = this.cloneNode(true);
                  placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                  placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
                  if (this.children.length > 1) {
                        placedItem.children[0].style.display = ``;
                        placedItem.children[1].style.display = `none`;
                        placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                        placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
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
            if (overInventory && inventoryItem) {
                  elmnt.remove();
                  elmnt.originalItem.style.opacity = `100%`;
                  elmnt.originalItem.onPage = false;
                  if (elmnt.originalItem.isPeg) {
                        elmnt.originalItem.parentElement.onPage = false;
                  }
            }
            let overFax = overlayCheck(clickLocation, `faxMachine`)[0];
            if (overFax && elmnt.id == `faxSlip`) {
                  sendFaxSlip(elmnt);
                  setTimeout(() => {
                        faxSounds.volume = 0.05;
                        faxSounds.play();
                  }, 100);
            }
      }
}

function sendFaxSlip(faxSlip) {
      faxSlip.onmousedown = null;
      faxSlip.originalItem.style.display = `none`;
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
      inventory[`faxSlip`] = false;
      window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      let hider = document.getElementById(`faxSlipHider`);
      let hiderBounds = hider.getBoundingClientRect();
      let slipBounds = faxSlip.getBoundingClientRect();
      hider.appendChild(faxSlip);
      faxSlip.style.left = hiderBounds.width / 2 - slipBounds.width / 2 + 'px';
      faxSlip.style.top = hiderBounds.height - slipBounds.height / 2 - slipBounds.width / 2 + 'px';
      faxSlip.style.transform = `rotate(90deg) rotateY(-30deg) translateZ(-1000px)`;
      setTimeout(() => {
            faxSlip.style.transition = `2s ease-in-out`;
            faxSlip.style.transform = `rotate(90deg) rotateY(-30deg) translateZ(-1000px) translateX(${slipBounds.width}px)`;
            setTimeout(() => {
                  scholarCall.volume = 0.5;
                  scholarCall.play();
                  scholarCall.started = true;
                  let transcriptData = {
                        0: `*RING* *RING*`,
                        3367: `OH, HELLO! I’M SO THANKFUL THAT YOU’VE TAKEN CARE OF REESE.`,
                        6375: `I’LL SEND BACK YOUR PAPERWORK AND LEAVE A GLOWING REVIEW WITH THE AGENCY.`,
                        9500: `- *WELL… THESE PEOPLE MIGHT BE MY ONLY CHANCE…* -`,
                        12000: `HOLD ON! YOU COULD LEAVE, OR I COULD LET YOU INTO THE STRANGE WORLD OF MY WORK.`,
                        16000: `IF YOU’RE WILLING, TAKE A NEW LOOK AT THE BOOKS BELOW YOU WHILE I PREPARE TO FAX YOU MY EXPEDITION DATA.`,
                        20371: `THE REST SHOULD BECOME CLEAR.`,
                  }
                  voicemailTranscript(scholarCall, transcriptData, Object.keys(transcriptData)[0]);
            }, 5000);
            // setTimeout(() => {
            //       // inventory[`faxPaper`] = true;
            //       let faxPaper = document.getElementById(`faxPaperFax`);
            //       faxPaper.style.transform = "rotateX(85deg)";
            //       setTimeout(() => {
            //             faxPaper.style.transition = 'none';
            //       }, 2000);
            // }, 22000 + 6000);
            //^^^^change this 0 to a delay if we have something occur between fax input and paper output.
            //THE FAX COMES INTO THE WORKSHOP, WE ADD A FAX MACHINE THERE.
      }, 3000);
}

function overlayCheck(div, tagToCheck) {
      let points = Array.from(document.querySelectorAll(`.${tagToCheck}`));
      points.sort((a, b) => {
            let topfirst = a.style.top.replace("px", "") - b.style.top.replace("px", "");
            let leftfirst = a.style.left.replace("px", "") - b.style.left.replace("px", "");
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
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      getBoundingClientRect() {
            return { right: (this.x + this.width), left: (this.x), top: (this.y), bottom: (this.y + this.height) };
      }
}

function voicemail(button) {
      if (button.type != `ended`) {
            button.style.animationIterationCount = 0;
      }
      let screenText = document.getElementById('text');
      if (voicemailaudio.started) {
            voicemailaudio.pause();
            screenText.innerHTML = `No New Messages`;
            voicemailaudio.currentTime = 0;
            voicemailaudio.started = false;
            clearInterval(voicemailaudio.transcriptInterval);
      } else {
            voicemailaudio.started = true;
            screenText.innerHTML = `Playing . . .`;
            voicemailaudio.play();
            voicemailaudio.onended = voicemail;
            let transcriptData = {
                  0: `UGH, STRAIGHT TO VOICEMAIL... OKAY.`,
                  3400: `HEY IT'S ME, JUST CALLING TO LET YOU KNOW THAT I'LL BE SWINGING BY WITH GROCERIES LATER.`,
                  7200: `CAN I SKIP THE BOOK THING THIS TIME THOUGH? I STILL STRUGGLE WITH THE THREE RULES FOR IT.`,
                  11900: `I KNOW, I KNOW! "EACH RULE IS JUST ONE ASPECT THAT AFFECTS ALL THE BOOKS" AND I APPRECIATE YOU PUTTING IN THE LIGHTS FOR ME, BUT I ALWAYS FORGET HOW TO GET THEM ALL ON AT ONCE.`,
                  21900: `I JUST DON'T GET YOUR OBSESSION WITH ORGANIZING YOUR YEARBOOKS WITH DICTIONARIES AND AN ATLAS?? IT DOESN'T MAKE ANY SENSE!`,
                  27900: `I JUST WISH YOU'D SORT THINGS NORMALLY FOR ONCE. *INTERRUPTED* LISA, THE GOVERNOR'S STILL WAITING ON LINE 3— UGH! HE CAN WAIT! GOTTA GO... LOVE YOU, BYE`,
            }
            voicemailTranscript(voicemailaudio, transcriptData, Object.keys(transcriptData)[0]);
      }
}

function keypad(id) {
      buttonAudios[id].play();
      if (voicemailaudio.started) {
            voicemailaudio.pause();
            voicemailaudio.currentTime = 0;
            voicemailaudio.started = false;
            clearInterval(voicemailaudio.transcriptInterval);
      }
      let screenText = document.getElementById('text');
      if (screenText.innerHTML.match(/[^$,.\d]/)) {
            screenText.innerHTML = '';
      }
      const number = STR_TO_NUM[id.toLowerCase()];
      if (!questionsStarted && number == "1") {
            questionsStarted = true;
            nextAudio();
      } else if (number == "!") {
            screenText.innerHTML = "";
            if (allAudios[currentAudio]) {
                  allAudios[currentAudio].pause();
                  allAudios[currentAudio].currentTime = 0;
            }
            if (currentAudio == 0 || currentAudio == 1) {
                  questionsStarted = false;
                  currentAudio = -1;
            }
            if (voicemailaudio.started) {
                  voicemailaudio.pause();
                  voicemailaudio.currentTime = 0;
                  voicemailaudio.started = false;
                  clearInterval(voicemailaudio.transcriptInterval);
            }
            changeTranscription(`*CLICK*`);
      } else if (number == "*" && questionsStarted) {
            if (currentAudio == 1 && screenText.innerHTML == `89`) {
                  screenText.innerHTML += number;
                  nextAudio();
            }
            if (currentAudio == 2 && screenText.innerHTML == `28`) {
                  screenText.innerHTML += number;
                  nextAudio();
            }
            if (currentAudio == 3 && screenText.innerHTML == `58`) {
                  screenText.innerHTML += number;
                  let phoneData = window.sessionStorage.getItem(`phoneData`);
                  if (!phoneData) {
                        phoneData = {
                              glass: true,
                              order: [`bookDiv3`, `bookDiv1`, `bookDiv0`, `bookDiv4`, `bookDiv6`, `bookDiv5`, `bookDiv2`],
                        };
                        window.sessionStorage.setItem(`phoneData`, JSON.stringify(phoneData));
                  } else {
                        phoneData = JSON.parse(phoneData);
                  }
                  phoneData[`glass`] = false;
                  window.sessionStorage.setItem(`phoneData`, JSON.stringify(phoneData));
                  nextAudio();
                  setTimeout(() => { thunk.play(); }, 1000);
            }
            else {
                  repeatAudio();
            }
      }
      if (screenText.innerHTML.length < 10) {
            screenText.innerHTML += number;
      }
}

function nextAudio() {
      if (voicemailaudio.started) {
            voicemailaudio.pause();
            voicemailaudio.currentTime = 0;
            voicemailaudio.started = false;
            clearInterval(voicemailaudio.transcriptInterval);
      }
      currentAudio++;
      let allText = [`ACCESS REQUIRED`, `MAKE AND MODEL`, `UNIVERSITY`, `SISTER'S NAME`, 'ACCESS GRANTED'];
      let transcript = [
            `SECURITY QUESTIONS REQUIRED.`,
            `QUESTION 1: WHAT IS THE MAKE AND MODEL OF YOUR CAR? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `QUESTION 2: WHAT UNIVERSITY DID YOU GRADUATE FROM? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `QUESTION 3: WHAT IS YOUR SISTER'S NAME? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `ACCESS GRANTED <br> *THUNK*`,
      ];
      if (currentAudio > 0) {
            allAudios[currentAudio - 1].pause();
      }
      allAudios[currentAudio].volume = 0.3;
      allAudios[currentAudio].play();
      if (currentAudio == 0) {
            allAudios[currentAudio].onended = nextAudio;
      }
      changeText(allText[currentAudio]);
      changeTranscription(transcript[currentAudio]);
}

function changeText(string) {
      let screenText = document.getElementById('text');
      screenText.innerHTML = '';
      screenText.innerHTML = string;
}

function voicemailTranscript(audio, transcriptData, audioTime) {
      if (!audio.started) {
            return clearTimeout(audio.transcriptInterval);
      }
      let transcriptText = Object.values(transcriptData);
      let transcriptTimes = Object.keys(transcriptData);
      // if (transcriptTimes[transcriptTimes.indexOf(closestInArray(transcriptTimes, audio.currentTime * 1000)) + 1] - transcriptTimes[transcriptTimes.indexOf(closestInArray(transcriptTimes, voicemailaudio.currentTime * 1000))]) {
      //       audio.transcriptInterval = setTimeout(voicemailTranscript, transcriptTimes[transcriptTimes.indexOf(closestInArray(transcriptTimes, audio.currentTime * 1000)) + 1] - transcriptTimes[transcriptTimes.indexOf(closestInArray(transcriptTimes, voicemailaudio.currentTime * 1000))], audio, transcriptData);
      // }
      changeTranscription(transcriptText[transcriptTimes.indexOf(audioTime)]);
      let newAudioTime = transcriptTimes[transcriptTimes.indexOf(audioTime) + 1];
      console.log(newAudioTime);
      if (newAudioTime) {
            audio.transcriptInterval = setTimeout(voicemailTranscript, newAudioTime - audioTime, audio, transcriptData, newAudioTime);
      }
}

function closestInArray(arr, goal) {
      var closest = arr.reduce(function (prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
      return closest;
}


function changeTranscription(string) {
      let lastText = document.getElementById('lastTranscription');
      let transcriptText = document.getElementById('transcription');
      lastText.innerHTML = '';
      lastText.innerHTML = transcriptText.innerHTML;
      transcriptText.style.top = lastText.clientHeight + lastText.offsetTop + 10 + "px";
      transcriptText.innerHTML = '';
      transcriptText.innerHTML = string;
}

function repeatAudio() {
      let transcript = [
            `SECURITY QUESTIONS REQUIRED.`,
            `QUESTION 1: WHAT IS THE MAKE AND MODEL OF YOUR CAR? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `QUESTION 2: WHAT UNIVERSITY DID YOU GRADUATE FROM? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `QUESTION 3: WHAT IS YOUR SISTER'S NAME? <br> PRESS THE KEYS FOR THE FIRST LETTER OF EACH WORD, AND THEN PRESS STAR.`,
            `ACCESS GRANTED <br> *THUNK*`,
      ];
      if (voicemailaudio.started) {
            voicemailaudio.pause();
            voicemailaudio.currentTime = 0;
            voicemailaudio.started = false;
            clearInterval(voicemailaudio.transcriptInterval);
      }
      let allText = [`ACCESS REQUIRED`, `MAKE AND MODEL`, `UNIVERSITY`, `SISTER'S NAME`, 'ACCESS GRANTED'];
      allAudios[currentAudio].pause();
      allAudios[currentAudio].currentTime = 0;
      allAudios[currentAudio].play();
      changeText(allText[currentAudio]);
      //changeTranscription(transcript[currentAudio]);
}