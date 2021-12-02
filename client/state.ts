// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "";
type User = {
  name: string;
};
const state = {
  data: {
    name: "",
    //   email: "",
    userId: "",
    roomId: "",
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
        body: JSON.stringify({ userId: lastState.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          const lastState = this.getState();
          lastState.roomId = res.id;
          state.setState(lastState);
          if (cb) {
            cb();
            console.log(state.getState());
          }
        });
    } else {
      console.error("No hay userId");
    }
  },
};

export { state };
