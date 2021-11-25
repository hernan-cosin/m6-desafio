const API_BASE_URL = "http://localhost:3000";
// const API_BASE_URL = "";
type User = {
  name: string;
};
const state = {
  data: {
    name: "",
    //   email: "",
    //   userId: "",
    //   roomId: "",
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
  signin(User: User) {
    fetch(API_BASE_URL + "/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    });
  },
};

export { state };
