const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
// const PRAGMA foreign_keys = ON;
const app = express();
// import { Database } from "sqlite-async/sqlite-async";
// const Database = require("sqlite-async");
// const Database = sqlite - async();
// import { setTimeout } from 'timers/promises';
// const setTimeout = require("timers/promises");

var corOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Post Profile
app.post("/profile", (request, response) => {
  const newProfile = request.body;
  console.log("Profile creation: " + newProfile);
  //   console.log("Profile creation: " + JSON.stringify(newProfile));

  let db = new sqlite3.Database("db/moi-app");

  const insertQuery =
    "INSERT INTO profile (profileId, name, age, gender, address, city, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  let updatedAge = "";
  let updatedAddress = "";
  let updatedCity = "";
  let updatedGender = "";
  let updatedMobile = "";

  console.log("newProfile.age : " + newProfile.age);
  if (newProfile.age) {
    console.log("newProfile.age in if condition: " + newProfile.age);
    updatedAge = newProfile.age;
  }
  if (newProfile.gender) {
    updatedGender = newProfile.gender;
  }
  if (newProfile.address) {
    updatedAddress = newProfile.address;
  }
  if (newProfile.city) {
    updatedCity = newProfile.city;
  }
  if (newProfile.mobile) {
    updatedMobile = newProfile.mobile;
  }
  const values = [
    newProfile.profileId,
    newProfile.name,
    newProfile.age,
    newProfile.gender,
    newProfile.address,
    newProfile.city,
    newProfile.mobile,
    newProfile.email,
  ];
  // console.log("newProfile.profileId :" + newProfile.profileId);
  db.run(insertQuery, values, (err) => {
    // console.log("values: " + values);
    // console.log("error: " + err);
    if (err) {
      response.json({
        message: err.message,
      });
      db.close();
    } else {
      response.json({
        message: "Successfully inserted Profile ",
      });
      db.close();
    }
  });
});

// Get Profile
app.get("/profile", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT profileId, name, age, gender, address, city, mobile, email from profile";

  db.all(selectQuery, [], (err, profileList) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const profileInputs = profileList.map((singleProfile) => {
        console.log(singleProfile);
        return {
          profileId: singleProfile.profileId,
          name: singleProfile.name,
          age: singleProfile.age,
          gender: singleProfile.gender,
          address: singleProfile.address,
          city: singleProfile.city,
          mobile: singleProfile.mobile,
          email: singleProfile.email,
        };
      });
      response.json(profileInputs);
    }
  });
  db.close();
});

// Get Single Profile
app.get("/profile/:profileId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT profileId, name, age, gender, address, city, mobile, email from profile WHERE profileId=? ";

  db.all(selectQuery, [request.params.profileId], (err, profileList) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const profileInputs = profileList.map((singleProfile) => {
        console.log(singleProfile);
        return {
          profileId: singleProfile.profileId,
          name: singleProfile.name,
          age: singleProfile.age,
          gender: singleProfile.gender,
          address: singleProfile.address,
          city: singleProfile.city,
          mobile: singleProfile.mobile,
          email: singleProfile.email,
        };
      });
      response.json(profileInputs[0]);
      console.log(profileInputs[0]);
    }
  });
  db.close();
});

// Update Profile
app.put("/profile", (request, response) => {
  const updatedProfile = request.body;

  let db = new sqlite3.Database("db/moi-app");

  const updatedName = updatedProfile.name;
  const updatedAge = updatedProfile.age;
  const updatedGender = updatedProfile.gender;
  const updatedAddress = updatedProfile.address;
  const updatedCity = updatedProfile.city;
  const updatedMobile = updatedProfile.mobile;
  const updatedEmail = updatedProfile.email;
  const profileId = updatedProfile.profileId;

  const updateQuery =
    "UPDATE profile SET name=?, age=?, gender=?, address=?, city=?, mobile=?, email=? WHERE profileId = ?";

  const values = [
    updatedName,
    updatedAge,
    updatedGender,
    updatedAddress,
    updatedCity,
    updatedMobile,
    updatedEmail,
    profileId,
  ];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Profile ",
      });
    }
  });

  db.close();
});

// Post Event

app.post("/events", (request, response) => {
  const newEvent = request.body;

  //   console.log("Event Creation : " + newEvent);

  let db = new sqlite3.Database("db/moi-app");

  const insertQuery =
    "INSERT INTO events (eventType, name, place, date, profileId) VALUES (?, ?, ?, ?, ?)";

  const values = [
    newEvent.eventType,
    newEvent.name,
    newEvent.place,
    newEvent.date,
    newEvent.profileId,
  ];

  db.run(insertQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully inserted Events ",
      });
    }
  });

  db.close();
});

// Get total Events
app.get("/events", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT eventId, eventType, name, place, date, profileId from events ";

  db.all(selectQuery, [], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          eventId: singleevent.eventId,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      response.json(eventInputs);
    }
  });
  db.close();
});

// Get all Events from One Single Profile
app.get("/events/all/:profileId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT eventId, eventType, name, place, date, profileId from events WHERE profileId = ?";

  db.all(selectQuery, [request.params.profileId], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          eventId: singleevent.eventId,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      response.json(eventInputs);
      console.log(eventInputs);
    }
  });

  db.close();
});

// Get Single Event
app.get("/events/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT eventId, eventType, name, place, date, profileId from events WHERE eventId=? ";

  db.all(selectQuery, [parseInt(request.params.eventId)], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          eventId: singleevent.eventId,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      console.log(eventInputs);
      response.json(eventInputs[0]);
    }
  });
  db.close();
});

// Update Event
app.put("/events", (request, response) => {
  const updatedEvents = request.body;

  let db = new sqlite3.Database("db/moi-app");
  const updatedEventType = updatedEvents.eventType;
  const updatedName = updatedEvents.name;
  const updatedPlace = updatedEvents.place;
  const updatedDate = updatedEvents.date;
  const eventId = updatedEvents.eventId;

  const updateQuery =
    "UPDATE events SET eventType=?, name=?, place=?, date=? WHERE eventId = ?";

  const values = [
    updatedEventType,
    updatedName,
    updatedPlace,
    updatedDate,
    eventId,
  ];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Events ",
      });
    }
  });

  db.close();
});

// Delete Single Event
app.delete("/events/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const deleteQuery = "DELETE from events WHERE eventId = ?";

  db.run(deleteQuery, [parseInt(request.params.eventId)], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Event ",
      });
    }
  });

  db.close();
});

// Post Entry
app.post("/entries", (request, response) => {
  const newEntry = request.body;

  console.log(newEntry);

  let db = new sqlite3.Database("db/moi-app");

  const insertQuery =
    "INSERT INTO entries (personName, city, presentType, amount, gift, eventId) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [
    newEntry.personName,
    newEntry.city,
    newEntry.presentType,
    newEntry.amount,
    newEntry.gift,
    newEntry.eventId,
  ];

  db.run(insertQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully inserted Entries ",
      });
    }
  });

  db.close();
});

// Get All Entries
app.get("/entries", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT entryId, personName, city, presentType, amount, gift, eventId from entries ";

  db.all(selectQuery, [], (err, entrieslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const entryInputs = entrieslist.map((singleentry) => {
        console.log(singleentry);
        return {
          entryId: singleentry.entryId,
          personName: singleentry.personName,
          city: singleentry.city,
          presentType: singleentry.presentType,
          amount: singleentry.amount,
          gift: singleentry.gift,
          eventId: singleentry.eventId,
        };
      });
      response.json(entryInputs);
    }
  });
  db.close();
});

// get all entries in one single event
app.get("/entries/all/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT entryId, personName, city, presentType, amount, gift, eventId from entries WHERE eventId=?";

  db.all(
    selectQuery,
    [parseInt(request.params.eventId)],
    (err, entrieslist) => {
      if (err) {
        response.json({
          message: err.message,
        });
      } else {
        const entryInputs = entrieslist.map((singleentry) => {
          console.log(singleentry);
          return {
            entryId: singleentry.entryId,
            personName: singleentry.personName,
            city: singleentry.city,
            presentType: singleentry.presentType,
            amount: singleentry.amount,
            gift: singleentry.gift,
            eventId: singleentry.eventId,
          };
        });
        response.json(entryInputs);
      }
    }
  );
  db.close();
});

// Get Single Entry
app.get("/entries/:entryId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery =
    "SELECT entryId, personName, city, presentType, amount, gift, eventId from entries WHERE entryId=?";

  db.all(
    selectQuery,
    [parseInt(request.params.entryId)],
    (err, entrieslist) => {
      console.log(parseInt(request.params.entryId));
      if (err) {
        response.json({
          message: err.message,
        });
      } else {
        const entryInputs = entrieslist.map((singleentry) => {
          console.log(singleentry);
          return {
            entryId: singleentry.entryId,
            personName: singleentry.personName,
            city: singleentry.city,
            presentType: singleentry.presentType,
            amount: singleentry.amount,
            gift: singleentry.gift,
            eventId: singleentry.eventId,
          };
        });
        console.log(entryInputs[0]);
        response.json(entryInputs[0]);
      }
    }
  );
  db.close();
});

// Update Entries
app.put("/entries", (request, response) => {
  const updatedEntries = request.body;

  let db = new sqlite3.Database("db/moi-app");

  const updatedpersonName = updatedEntries.personName;
  const updatedCity = updatedEntries.city;
  const updatedPresentType = updatedEntries.presentType;
  const updatedAmount = updatedEntries.amount;
  const updatedGift = updatedEntries.gift;
  //   const updatedEventId = updatedEntries.eventId;
  const entryId = updatedEntries.entryId;

  const updateQuery =
    "UPDATE entries SET personName=?, city=?, presentType=?, amount=?, gift=? WHERE entryId = ?";

  const values = [
    updatedpersonName,
    updatedCity,
    updatedPresentType,
    updatedAmount,
    updatedGift,
    // updatedEventId,
    entryId,
  ];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Entries ",
      });
    }
  });

  db.close();
});

// Delete Entry
app.delete("/entries/:entryId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const deleteQuery = "DELETE from entries WHERE entryId = ?";

  db.run(deleteQuery, [parseInt(request.params.entryId)], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Entry ",
      });
    }
  });

  db.close();
});

// Delete all Entries from One Single Event
app.delete("/entries/all/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");

  const deleteQuery = "DELETE from entries WHERE eventId = ?";

  db.run(deleteQuery, [request.params.eventId], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Entries in One Event ",
      });
    }
  });

  db.close();
});

// Get ProfileId from events-eventId
app.get("/events/profileId/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/moi-app");
  console.log("find profileId from events");
  const selectQuery = "SELECT profileId from events WHERE eventId = ?";

  db.all(selectQuery, [parseInt(request.params.eventId)], (err, results) => {
    console.log("request.query.eventId : " + parseInt(request.params.eventId));
    console.log("selectQuery: " + selectQuery);
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      console.log(results[0]);

      response.json(results[0]);
    }
  });

  db.close();
});

// Get eventId from entries-entryId
app.get("/entries/eventId/:entryId", (request, response) => {
  console.log("get eventId from entries table");
  let db = new sqlite3.Database("db/moi-app");

  const selectQuery = "SELECT eventId from entries WHERE entryId = ?";
  console.log("entryId : " + request.params.entryId);
  console.log("eventId from selectQuery : " + selectQuery);
  db.all(selectQuery, [parseInt(request.params.entryId)], (err, results) => {
    console.log(
      "parseInt(request.query.entryId) : " + [parseInt(request.params.entryId)]
    );
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      console.log("results : " + results[0]);
      console.log("results[0] :" + results[0]);

      response.json(results[0]);
    }
  });

  db.close();
});

// Get totalAmount & totalGift from events
// app.get("/events/total/all/:profileId", (request, response) => {
//   let db = new sqlite3.Database("db/moi-app");
//   console.log("get all events for Single Profile");
//   ("SELECT eventId, eventType, name, place, date, profileId from events WHERE profileId = ?");

//   db.all(
//     selectQuery,
//     [parseInt(request.params.profileId)],
//     (err, eventslist) => {
//       console.log("request.params.profileId : " + request.params.profileId);
//       if (err) {
//         response.json({
//           message: err.message,
//         });
//       } else {
//         const eventsSingleProfile = eventslist.map((singleEvent) => {
//           console.log(singleEvent);
//           return {
//             eventId: singleEvent.eventId,
//             eventType: singleEvent.eventType,
//             name: singleEvent.name,
//             place: singleEvent.place,
//             date: singleEvent.date,
//             profileId: singleEvent.profileId,
//           };
//         });
//         console.log(eventsSingleProfile);
//         response.json(eventsSingleProfile);
//       }

//       const totalAmount = eventsSingleProfile.map((singleEntry) => {
//         console.log(singleEntry);
//         singleEntry
//           .filter((entry) => entry.eventId === eventId)
//           .map((entry) => parseInt(entry.amount))
//           .reduce((acc, value) => acc + +value, 0);

//         return totalAmount;
//       });

//       const totalGift = eventsSingleProfile.map((singleEntry) => {
//         console.log(singleEntry);
//         singleEntry.filter(
//           (entry) => entry.eventId === eventId && entry.gift !== ""
//         ).length;

//         return totalGift;
//       });
//     }
//   );
//   db.close();
// });

const dbSelectCall = async (selectQuery, data) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database("db/moi-app");

    db.all(selectQuery, data, (err, result) => {
      if (err) {
        db.close();
        return reject(err);
      }
      db.close();
      resolve(result);
    });
  });
};
app.get("/events/total/all/:profileId", async (request, response) => {
  console.log("get all events for Single Profile");

  const selectEventQuery =
    "SELECT eventId, eventType, name, place, date, profileId from events WHERE profileId = ?";

  const eventsList = await dbSelectCall(selectEventQuery, [
    request.params.profileId,
  ]);

  if (eventsList) {
    console.log("EventList - " + JSON.stringify(eventsList));

    let totalEventsResult = [];

    for (let index = 0; index < eventsList.length; index++) {
      const singleEvent = eventsList[index];
      console.log("singleEvent :" + JSON.stringify(singleEvent));

      const getEntryListQuery =
        "SELECT entryId, personName, city, presentType, amount, gift, eventId from entries WHERE eventId = ?";

      let totalAmount = 0;
      let totalGift = 0;
      const entryList = await dbSelectCall(getEntryListQuery, [
        singleEvent.eventId,
      ]);
      console.log(
        "Entry List Result for event " +
          singleEvent.eventId +
          " - " +
          JSON.stringify(entryList)
      );
      if (entryList) {
        console.log("entriesList : " + JSON.stringify(entryList));
        totalAmount = 0;
        totalGift = 0;
        entryList.forEach((singleentry) => {
          if (singleentry.presentType === "gift") {
            totalGift += 1;
          } else {
            totalAmount += singleentry.amount;
          }
        });
        totalEventsResult.push({
          eventId: singleEvent.eventId,
          name: singleEvent.name,
          totalAmount: totalAmount,
          totalGift: totalGift,
        });
        console.log(
          "Updated total amount vs event - " + JSON.stringify(totalEventsResult)
        );
      } else {
        console.log(
          "Failed for event " + singleEvent.eventId + ", with error - " + err
        );
      }
    }

    console.log("Final REsult - " + JSON.stringify(totalEventsResult));
    response.json(totalEventsResult);
  } else {
    console.log("Failed for eventlist query " + eventsList);
    response.json(eventsList);
  }
});

// app.get("/events/total/all/:profileId", (request, response) => {
//   console.log("get all events for Single Profile");
//   // let db = new sqlite3.Database("db/moi-app");
//   Database.open("db/moi-app").then(() => {
//     const selectQuery =
//       "SELECT eventId, eventType, name, place, date, profileId from events WHERE profileId = ?";

//     Database.all(selectQuery, [request.params.profileId], (err, eventslist))
//       //  => {
//       .then(() => {
//         console.log("request.params.profileId : " + request.params.profileId);
//         //
//         //     // const eventsListForSingleProfile = JSON.stringify(eventslist);
//         //     // console.log("eventslist for SingleProfile : " + eventsListForSingleProfile);

//         if (err) {
//           response.json({
//             message: err.message,
//           });
//         } else {
//           // const totalFromSingleEvent = eventslist
//           eventslist
//             .map((singleEvent) => {
//               const getEntryListQuery =
//                 "SELECT entryId, personName, city, presentType, amount, gift, eventId from entries WHERE eventId = ?";

//               let totalAmount = 0;
//               let totalGift = 0;

//               Database.all(
//                 getEntryListQuery,
//                 [singleEvent.eventId],
//                 (err, entriesList)
//               ).then(() => {
//                 console.log("entriesList : " + entriesList);
//                 if (err) {
//                   response.json({
//                     message: err.message,
//                   });
//                   return;
//                 } else {
//                   entriesList.forEach((singleentry) => {
//                     totalAmount += singleentry.amount;
//                   });
//                   entriesList.forEach((singleentry) => {
//                     if (singleentry.presentType === "gift") {
//                       totalGift += 1;
//                     }
//                   });
//                 }
//               });
//             })
//             .then(() => {
//               return {
//                 eventId: singleEvent.eventId,
//                 totalAmount: totalAmount,
//                 totalGift: totalGift,
//               };
//             });
//           console.log("singleEvent.eventId : " + singleEvent.eventId);
//           console.log("totalAmount : " + totalAmount);
//           console.log("totalGift : " + totalGift);
//         }
//         // response.json(totalFromSingleEvent);
//       });
//   });
// });

app.listen(2010, () => {
  console.log("Listening successfully - use 2010");
});
