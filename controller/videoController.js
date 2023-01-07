const express = require("express");
const multer = require("multer");
const VideoDetails = require("../models/VideoDetail");
const Subject = require("../models/Subject")
const crypto = require('crypto')

const uploadVideo = (req, res, next) => {
  // console.log(req.userData);
  console.log("SubjectId",req.headers.uploader_name);
  const videoDetails = new VideoDetails({
    uploader_name: req.headers.uploader_name,
    upload_title: req.file.filename.replace(/ /g, "_"),
    video_path: `${req.protocol}://${req.get('host')}/videos/${req.file.filename.replace(/ /g, "_")}`,
      
    thumbnail_path: `${req.protocol}://${req.get('host')}/thumbnail/${req.headers.subname }.jpg`,
    subject: req.headers.subject
  });
  videoDetails
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).json({
    message: "Video upload successful",
  });
};

const videoShow = async(req, res) => {
  console.log("Request connected");
  console.log(req.user);
  let arr = []
  let a = req.user.teachingSubs ? req.user.teachingSubs : req.user.attendance
  for(let i=0;i<a.length;i++){
    arr.push(a[i].sub)
  }
  console.log(arr)
  let docs = []
  docs = await VideoDetails.find({subject: {$in: arr}}).populate("subject");
  console.log(docs)

  let subjectList = []

  for(let i=0;i<arr.length;i++){
    let s = await Subject.findOne({_id:arr[i]},{subName:1});
    subjectList.push(s.subName);
  }

  let videos = [];
  
  for(let i=0;i<subjectList.length;i++){
    let v =[];
    for(let j=0;j<docs.length;j++){
      if(docs[j].subject.subName === subjectList[i]){
        v.push(docs[j]);
      }
    }
    videos.push({
      subjectName: subjectList[i],
      videos:v
    })
  }

  res.status(200).json(videos); 
};

const ranD = async (slots, count) => {
	let i;
	let viableDays = [];
	for(i in slots){
		if (slots[i].length >= count){
			viableDays.push(i);
		}
	}
	
	if(viableDays.length == 0)
		return null; 

	let buff = crypto.randomBytes(2);
	let n = parseInt(buff.toString('hex'),16)
	//console.log(n);	

	let index =  n % (viableDays.length);
	let day = viableDays[index]
	let slot = [];

	for(i=0;i<count;i++){
		buff = crypto.randomBytes(2);
		n = parseInt(buff.toString('hex'),16)
	
		let s = n % slots[day].length;
		slot.push(slots[day][s]);
		slots[day].splice(s,1);
		//delete s;
	}
	//delete buff, n, viableDays, i,index;
	//console.log("d/s ",day,slot)
	return {day, slot}
}

const gen = async (instaces, givenSlots, teachers, sections) => {
  let secInstances = {};
  let i, j;
  let TT = [];
  let secTT = {};
  let teacherTT = {};

  console.log(givenSlots)

  let numDays = 0;
  givenSlots.forEach(x => {
    if (x > 0) numDays++;
  });

  //console.log("num " , numDays);
  for (i in sections) {
    let mapp = givenSlots.map(x => {
      let z = [];
      for (let j = 0; j < x; j++) {
        z.push(0);
      }
      return z;
    });
    secInstances[sections[i]] = [];
    secTT[sections[i]] = mapp;
    mapp = null;
    j = null;
  }

  for (i in teachers) {
    let mapp = givenSlots.map(x => {
      let z = [];
      for (let j = 0; j < x; j++) {
        z.push(0);
      }
      return z;
    });
    teacherTT[teachers[i]] = mapp;
    mapp = null;
    j = null;
  }

  for (i in sections) {
    for (j in instaces) {
      for (let k in instaces[j].sections) {
        if (instaces[j].sections[k] === sections[i]) {
          instaces[j]["mapp"] = [];
          secInstances[sections[i]].push(instaces[j]);
        }
      }
    }
  }

  //console.log("sec ",secInstances, "tech " , teacherTT , "sec ", secTT);
  let regenerateCountSec = 0;
  let regenerateFlagSec = false;
  let regenerateListSec = {};
  let notPossibleCount = 0;
  let impossible = false;
  for (i = 0; i < sections.length; i++) {
    if (impossible) {
      console.log("Table Not Possible");
      break;
    }
    let notPossible = false;
    let currentTT = givenSlots.map(x => {
      let z = [];
      for (let j = 0; j < x; j++) {
        z.push(0);
      }
      return z;
    });
    let regenerateCountSI = 0;
    let regenerateFlagSI = false;
    let regenerateListSI = {};
    for (j = 0; j < secInstances[sections[i]].length; j++) {
      //console.log("hey","i \t" , i, "j \t" ,j)
      let availSlots = [];
      for (let day = 0; day < givenSlots.length; day++) {
        let daySlots = [];
        for (let slot = 0; slot < givenSlots[day]; slot++) {
          if (regenerateFlagSI) {
            //console.log("regenerateFlagSI", regenerateFlagSI, "	regenerateListSI", regenerateListSI)
            let slotFlag = true;
            for (let a in regenerateListSI.slot) {
              let dumFlag = false;
              for (let b in slot) {
                if (slot[b] === regenerateListSI.slot[a]) {
                  dumFlag = true;
                  break;
                }
              }
              if (!dumFlag) {
                slotFlag = false;
                break;
              }
            }
            if (
              (!slotFlag || day !== regenerateListSI.day) &&
              teacherTT[secInstances[sections[i]][j].teacher][day][slot] ===
                0 &&
              currentTT[day][slot] === 0
            ) {
              daySlots.push(slot);
            }
            regenerateFlagSI = false;
          } else if (regenerateFlagSec) {
            let slotFlag = true;
            for (let a in regenerateListSI.slot) {
              let dumFlag = false;
              for (let b in slot) {
                if (slot[b] === regenerateListSI.slot[a]) {
                  dumFlag = true;
                  break;
                }
              }
              if (!dumFlag) {
                slotFlag = false;
                break;
              }
            }

            if (
              (!slotFlag || day !== regenerateListSec.day) &&
              teacherTT[secInstances[sections[i]][j].teacher][day][slot] ===
                0 &&
              currentTT[day][slot] === 0
            ) {
            }
            regenerateFlagSec = false;
          } else if (
            teacherTT[secInstances[sections[i]][j].teacher][day][slot] === 0 &&
            currentTT[day][slot] === 0
          ) {
            daySlots.push(slot);
          }
        }
        availSlots.push(daySlots);
      }
      //console.log(sections[i], j,"avai\t" , availSlots);

      let eachDay = Math.floor(
        secInstances[sections[i]][j].numLectures / numDays
      );
      let extraDays = secInstances[sections[i]][j].numLectures % numDays;

      for (let x = 0; x < numDays; x++) {
        let count;
        if (extraDays > 0) {
          count = eachDay + 1;
          extraDays--;
        } else {
          count = eachDay;
        }

        let flag = true;
        let radCount = 0;
        while (flag) {
          //console.log("call", availSlots,count)
          const ret = await ranD(availSlots, count);
          //console.log("ret", ret)
          //console.log("tt", currentTT)
          if (
            ret !== undefined &&
            ret != null &&
            ret.day !== undefined &&
            ret.slot !== undefined &&
            ret.day >= 0 &&
            ret.day < givenSlots.length &&
            ret.slot.length === count
          ) {
            secInstances[sections[i]][j].mapp.push({
              day: ret.day,
              slot: ret.slot
            });
            for (let z in ret.slot) {
              currentTT[ret.day][ret.slot[z]] = secInstances[sections[i]][j];
              teacherTT[secInstances[sections[i]][j].teacher][ret.day][
                ret.slot[z]
              ] = secInstances[sections[i]][j];
            }
            availSlots[ret.day] = [];
            flag = false;
          } else {
            if (radCount < 10) {
              //console.log("rad", radCount,j)
              radCount++;
            } else if (regenerateCountSI < 100) {
              regenerateCountSI++;
              flag = false;
              regenerateFlagSI = true;
              if (secInstances[sections[i]][j].mapp[0] === undefined) {
                regenerateListSI = { day: null, slot: null };
              } else {
                regenerateListSI = secInstances[sections[i]][j].mapp[0];
              }
              //console.log("regSI",regenerateCountSI, regenerateCountSI, regenerateListSI)
              //console.log("hey","i \t" , i, "j \t" ,j)
              for (let y in secInstances[sections[i]][j].mapp) {
                for (let w in secInstances[sections[i]][j].mapp.slot) {
                  currentTT[secInstances[sections[i]][j].mapp[y].day][
                    secInstances[sections[i]][j].mapp[y].slot[w]
                  ] = 0;
                  teacherTT[secInstances[sections[i]][j].teacher][
                    secInstances[sections[i]][j].mapp[y].day
                  ][secInstances[sections[i]][j].mapp[y].slot[w]] = 0;
                }
              }
              secInstances[sections[i]][j].mapp = [];
              j--;
            } else {
              if (regenerateCountSec < 100) {
                //console.log("regenerateCountSec",regenerateCountSI, regenerateCountSec)
                regenerateCountSI = 0;
                regenerateCountSec++;
                regenerateFlagSec = true;
                flag = false;
                if (secInstances[sections[i]][j].mapp[0] === undefined) {
                  regenerateListSec = { day: null, slot: null };
                } else {
                  regenerateListSec = secInstances[sections[i]][0].mapp[0];
                }
                for (let x in secInstances[sections[i]]) {
                  for (let y in secInstances[sections[i]][x].mapp) {
                    for (let w in secInstances[sections[i]][x].mapp.slot) {
                      teacherTT[secInstances[sections[i]][x].teacher][
                        secInstances[sections[i]][x].mapp[y].day
                      ][secInstances[sections[i]][x].mapp[y].slot[w]] = 0;
                    }
                  }
                }
                for (x in secInstances[sections[i]])
                  secInstances[sections[i]][x].mapp = [];
                i--;
              } else {
                if (notPossibleCount < 20) {
                  flag = false;
                  regenerateCountSec = 0;
                  // console.log("iterationCount", notPossibleCount);
                  notPossible = true;
                  notPossibleCount++;
                  i = -1;
                  TT = [];
                  teacherTT = {};
                  secTT = {};
                  currentTT = [];
                  for (let u in sections) {
                    let mapp = givenSlots.map(x => {
                      let z = [];
                      for (let w = 0; w < x; w++) {
                        z.push(0);
                      }
                      return z;
                    });
                    secInstances[sections[u]] = [];
                    secTT[sections[u]] = mapp;
                    mapp = null;
                  }

                  for (let u in teachers) {
                    let mapp = givenSlots.map(x => {
                      let z = [];
                      for (let w = 0; w < x; w++) {
                        z.push(0);
                      }
                      return z;
                    });
                    teacherTT[teachers[u]] = mapp;
                    mapp = null;
                  }
                  for (let u in sections) {
                    for (let v in instaces) {
                      for (let w in instaces[v].sections) {
                        if (instaces[v].sections[w] === sections[u]) {
                          instaces[v]["mapp"] = [];
                          secInstances[sections[u]].push(instaces[v]);
                        }
                      }
                    }
                  }
                  //console.log("not" , " ", i, " ", j)
                } else {
                  impossible = true;
                  flag = false;
                }
              }
            }
          }
        } // flag
        if (
          impossible ||
          notPossible ||
          regenerateFlagSec ||
          regenerateFlagSI
        ) {
          // console.log("break1", i, j);
          break;
        }
      } // numdays
      // console.log("pos2", impossible, notPossibleCount);
      if (impossible || notPossible || regenerateFlagSec) {
        //  console.log("break2", i, j);
        break;
      }
    } 
    if (!impossible && !regenerateFlagSec && !notPossible) {
      TT.push(currentTT);
      secTT[sections[i]] = currentTT;
    }
    if (notPossible) {
      notPossible = false;
    }
    if (impossible) {
      return TT = null;
     
    }
  } 

 console.log("TT",TT);
  return TT;
};

const generate = async(req,res) => {
  

  const b = await gen(req.body.slots,req.body.days_arr,req.body.teachers,["CSE","IT"]);

  

  return res.json({
    b
  })
}

module.exports = {
  uploadVideo,
  videoShow,
  generate
};
