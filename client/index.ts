import { initButtom } from "./components/button";
import { initFormName } from "./components/form-name";
import { initPlay } from "./components/jugada";
import { initText } from "./components/text";
import { initCounter } from "./components/counter";
import { initFormRoom } from "./components/form-room";
import { initScore } from "./components/score";
import { initStar } from "./components/star";

import "./pages/home";
import "./pages/name";
import "./pages/code";
import "./pages/room";
import "./pages/press-play";
import "./pages/waiting-room";
import "./pages/choice";
import "./pages/no-room";
import "./pages/results/win";
import "./pages/results/loose";
import "./pages/results/both";
import "./router";

function main() {
  initButtom();
  initText();
  initPlay();
  initFormName();
  initFormRoom();
  initCounter();
  initScore();
  initStar();
}

main();
