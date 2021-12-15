import { initButtom } from "./components/button";
import { initFormName } from "./components/form-name";
import { initPlay } from "./components/jugada";
import { initText } from "./components/text";
import { initCounter } from "./components/counter";
import { initFormRoom } from "./components/form-room";

import "./pages/home";
import "./pages/name";
import "./pages/code";
import "./pages/room";
import "./pages/press-play";
import "./pages/waiting-room";
import "./pages/choice";
import "./pages/no-room";
import "./router";

function main() {
  initButtom();
  initText();
  initPlay();
  initFormName();
  initFormRoom();
  initCounter();
}

main();
