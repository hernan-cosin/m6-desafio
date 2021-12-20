import { rtdb } from "./rtdb";
import map from "lodash/map";
// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "";
type User = {
  name: string;
};
type Jugada = "piedra" | "papel" | "tijera";

const state = {
  data: {
    name: "",
    //   email: "",
    userId: "",
    roomId: "",
    players: [],
    start: "",
    "current-game": "",
    //   rtdbRoomId: "",
    //   messages: [],
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
    localStorage.setItem("saved-state", JSON.stringify(this.getState()));
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setName(name: User) {
    const lastState = this.getState();
    lastState.name = name;
    this.setState(lastState);
  },
  setRoomId(roomId: string) {
    const lastState = this.getState();
    lastState.roomId = roomId;
    this.setState(lastState);
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
        this.setState(lastState);
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
          // lastState.pushKey = res.key;
          state.setState(lastState);
          if (cb) {
            cb();
          }
        });
    } else {
      console.error("No hay userId");
    }
  },
  accessToRoom(cb?) {
    const lastState = this.getState();

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
          console.log(res);
          // console.log(res.validPlayer);
          // if (res.validPlayer == true) {
          // const lastState = this.getState();
          // lastState.pushKey = res.key;
          // state.setState(lastState);

          const roomId = lastState.roomId;
          const userId = lastState.userId;

          fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              const lastState = this.getState();
              lastState.rtdbRoomId = data.rtdbRoomId;
              this.setState(lastState);
            });
          if (cb) {
            cb();
          }
          // }
        });
    } else {
      console.error("No hay userId");
    }
  },

  // set in the state the rtdb room ID provided from backend
  connectToRoom(cb?) {
    const lastState = this.getState();
    console.log(lastState);
    const roomId = lastState.roomId;
    const userId = lastState.userId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const lastState = this.getState();
        lastState.rtdbRoomId = data.rtdbRoomId;
        this.setState(lastState);

        // console.log(state.getState());
        if (cb) {
          cb();
        }
      });
  },
  listenToRoom(cb?) {
    const lastState = this.getState();
    // console.log(lastState);

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
      this.setState(lastState);
    });
    if (cb) {
      cb();
    }
  },
  bothOnline(cb?) {
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.once("value", (snap) => {
      const playersFromServer = snap.val()["current-game"];

      const online = map(playersFromServer, "online");

      if (online[0] == true && online[1] == true) {
        cb();
      }
    });
  },
  setStart(val: boolean, player, cb?) {
    const lastState = state.getState();
    lastState.start = val;
    state.setState(lastState);

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
  setMove(move: Jugada, cb?) {
    // sets the player choice in the RTDB
    // then sets the state to triger the subscribe in the page and listen if both set their move
    // when true it sets the history in firestor
    const lastState = this.getState();
    lastState["current-game"] = move;
    console.log(lastState);

    fetch(API_BASE_URL + "/game/choice", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // userId: lastState.userId,
        player: lastState.player,
        choice: lastState["current-game"],
        roomId: lastState.rtdbRoomId,
        // shortId: lastState.roomId,
      }),
    }).then(() => {
      state.setState(lastState);

      if (cb) {
        cb();
      }
    });
  },
  setHistory() {
    // sets the history in firestore
    const lastState = this.getState();

    fetch(API_BASE_URL + "/rooms/choice", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // userId: lastState.userId,
        player: lastState.player,
        history: lastState.game,
        roomId: lastState.roomId,
        // shortId: lastState.roomId,
      }),
    });
  },
  bothSetMove(cb?) {
    // checks if both players have set their move in the RTDB
    // if true it sets both moves in the state
    // then ejecute callback
    const lastState = this.getState();

    const chatroomRef = rtdb.ref("/rooms/" + lastState.rtdbRoomId);
    chatroomRef.on("value", (snap) => {
      const playersFromServer = snap.val()["current-game"];

      // const choice = map(playersFromServer, "choice");
      const twoPlayersChoices = map(playersFromServer, (p) => {
        return { [p.player]: p.choice };
        // return p.choice;
      });

      if (
        twoPlayersChoices[0][0] !== undefined &&
        twoPlayersChoices[1][1] !== undefined
      ) {
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
};

export { state };
