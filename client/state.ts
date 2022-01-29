import { rtdb } from "./rtdb";
import map from "lodash/map";
// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "";
type User = {
  name: string;
};
type Jugada = "piedra" | "papel" | "tijera";
type Game = {
  0: Jugada;
  1: Jugada;
};
const state = {
  data: {
    name: "",
    userId: "",
    roomId: "",
    players: [],
    start: "",
    "current-game": "",
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setName(name: User) {
    const lastState = this.getState();
    lastState.name = name;
  },
  setRoomId(roomId: string) {
    const lastState = this.getState();
    lastState.roomId = roomId;
  },
  signin(User: User, cb?) {
    fetch(API_BASE_URL + "/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const lastState = this.getState();
        lastState.userId = data.id;
      })
      .then(() => {
        if (cb) {
          cb();
        }
      });
  },
  askNewRoom(cb?) {
    const lastState = this.getState();

    if (lastState.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: lastState.userId,
          name: lastState.name,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          const lastState = this.getState();
          lastState.roomId = res.id;
          if (cb) {
            cb();
          }
        });
    } else {
      console.error("No hay userId");
    }
  },
  accessToRoom(cb?, cb2?) {
    const lastState = this.getState();

    const roomId = lastState.roomId;
    const userId = lastState.userId;

    if (lastState.userId) {
      fetch(API_BASE_URL + "/rooms/access", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: lastState.userId,
          name: lastState.name,
          roomId: lastState.rtdbRoomId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.access == true) {
            fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                const lastState = this.getState();
                lastState.rtdbRoomId = data.rtdbRoomId;
              });
            if (cb) {
              cb();
            }
          }
          if (res.match == true) {
            fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                const lastState = this.getState();
                lastState.rtdbRoomId = data.rtdbRoomId;
              });
            if (cb) {
              cb();
            }
          }
          if (res.match == false) {
            cb2();
          }
        });
    } else {
      console.error("No hay userId");
    }
  },
  // set in the state the rtdb room ID provided from backend
  connectToRoom(cb?, cb2?) {
    const lastState = this.getState();

    const roomId = lastState.roomId;
    const userId = lastState.userId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const lastState = this.getState();
        lastState.rtdbRoomId = data.rtdbRoomId;
        if (cb2 && cb) {
          this.getPlayerNum(() => {
            cb2();
          });
        }

        if (cb && !cb2) {
          cb();
        }
      });
  },
  // listen to player added to the rtdb and asigns player0 if the player is the creator of the room
  // and player player1 if the player is the adversary
  assignPlayerNum(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.on("value", (snap) => {
      const lastState = this.getState();
      const playersFromServer = snap.val()["current-game"];

      const names = map(playersFromServer, "name");

      lastState.players = names;

      map(playersFromServer, "player");
      if (lastState.name == names[0]) {
        lastState.player = 0;
      } else {
        lastState.player = 1;
      }
    });
    if (cb) {
      cb();
    }
  },
  getPlayerNum(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);

    chatroomRef
      .get()
      .then((info) => {
        const lastState = this.getState();
        const playersFromServer = info.val()["current-game"];

        const names = map(playersFromServer, "name");

        lastState.players = names;

        map(playersFromServer, "player");
        if (lastState.name == names[0]) {
          lastState.player = 0;
        } else {
          lastState.player = 1;
        }
      })
      .then(() => {
        if (cb) {
          cb();
        }
      });
  },
  // listen to rtdb room and if both players are online
  // execute callback
  bothOnline(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.on("value", (snap) => {
      const playersFromServer = snap.val()["current-game"];

      const online = map(playersFromServer, "online");

      if (online[0] == true && online[1] == true) {
        cb();
      }
    });
  },
  // set start = true in rtdb
  setStart(val: boolean, player, cb?) {
    const lastState = state.getState();
    lastState.start = val;

    fetch(API_BASE_URL + "/rooms/start", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // userId: lastState.userId,
        start: lastState.start,
        player: player,
        roomId: lastState.rtdbRoomId,
      }),
    }).then(() => {
      if (cb) {
        cb();
      }
    });
  },
  // listen to rtdb room and if both players set start = true
  // execute callback
  readyToPlay(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.on("value", (snap) => {
      const playersFromServer = snap.val()["current-game"];

      const start = map(playersFromServer, "start");

      if (start[0] == true && start[1] == true) {
        cb();
      }
    });
  },
  // sets the player choice in the RTDB
  setMove(move: Jugada, cb?) {
    const lastState = this.getState();
    lastState["current-game"] = move;

    return fetch(API_BASE_URL + "/game/choice", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player: lastState.player,
        choice: lastState["current-game"],
        roomId: lastState.rtdbRoomId,
      }),
    });
  },
  // listen to rtdb room and if both players set their move
  // then set the move in the state
  // execute callback
  bothSetMove(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.on("value", (snap) => {
      const playersFromServer = snap.val()["current-game"];

      const twoPlayersChoices = map(playersFromServer, (p) => {
        return { [p.player]: p.choice };
      });

      if (twoPlayersChoices[0][0] !== "" && twoPlayersChoices[1][1] !== "") {
        lastState.game = [
          {
            ...twoPlayersChoices[0],
            1: twoPlayersChoices[1][1],
          },
        ];

        if (cb) {
          cb();
        }
      }
    });
  },
  // sets the history in firestore
  setHistory(cb?) {
    const lastState = this.getState();

    if (lastState.player == 0) {
      fetch(API_BASE_URL + "/rooms/choice", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          player: lastState.player,
          historyFromFront: lastState.game,
          roomId: lastState.roomId,
        }),
      }).then(() => {
        if (cb) {
          cb();
        }
      });
    } else {
      cb();
    }
  },
  // returns -1 if draw
  // returns 1 if player one wins
  // returns 0 if player zero wins
  whoWins(game: Game, cb?) {
    if (game[0] == game[1]) {
      return -1;
    }
    if (game[0] == "piedra" && game[1] == "papel") {
      return 1;
    }
    if (game[0] == "piedra" && game[1] == "tijera") {
      return 0;
    }
    if (game[0] == "papel" && game[1] == "piedra") {
      return 0;
    }
    if (game[0] == "papel" && game[1] == "tijera") {
      return 1;
    }
    if (game[0] == "tijera" && game[1] == "piedra") {
      return 1;
    }
    if (game[0] == "tijera" && game[1] == "papel") {
      return 0;
    }
  },
  getHistoryFromFirestore(rtdbRoomId: string, roomId: string, cb?) {
    const lastState = this.getState();

    function whoWins(g) {
      return state.whoWins(g);
    }

    fetch(API_BASE_URL + "/rooms/history", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: rtdbRoomId,
        roomId: roomId,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((history) => {
        const mapeado = map(history, whoWins);
        const winPlayerZero = mapeado.filter((g) => {
          return g == 0;
        });
        const winPlayerOne = mapeado.filter((g) => {
          return g == 1;
        });
        lastState.winPlayerZero = winPlayerZero;
        lastState.winPlayerOne = winPlayerOne;
      })
      .then(() => {
        if (cb) {
          cb();
        }
      });
  },
  rtdbReseter(cb?) {
    const lastState = this.getState();
    fetch(API_BASE_URL + "/rtdb/reset/start-choice", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: lastState.rtdbRoomId,
        player: lastState.player,
      }),
    }).then(() => {
      if (cb) {
        cb();
        lastState["current-game"] = "";
        lastState.game = [];
        lastState.winPlayerOne = [];
        lastState.winPlayerZero = [];
      }
    });
  },
  resetOnline() {
    const lastState = this.getState();
    fetch(API_BASE_URL + "/rtdb/reset/online", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: lastState.rtdbRoomId,
        player: lastState.player,
      }),
    });
  },
  setOnlineTrue() {
    const lastState = this.getState();
    return fetch(API_BASE_URL + "/rtdb/set/online", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: lastState.rtdbRoomId,
        player: lastState.player,
      }),
    });
  },
  resetStart(cb?) {
    const lastState = this.getState();
    fetch(API_BASE_URL + "/rtdb/reset/start", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: lastState.rtdbRoomId,
        player: lastState.player,
      }),
    }).then(() => {
      if (cb) {
        cb();
      }
    });
  },
  resetGameData() {
    const lastState = this.getState();
    lastState.game = [];
  },
};
export { state };
