import { initButtom } from "./components/button";
import { initFormName } from "./components/form-name";
import { initPlay } from "./components/jugada";
import { initText } from "./components/text";
import { initFormRoom } from "./components/form-room";

import "./pages/home";
import "./pages/name";
import "./pages/code";
import "./pages/room";
import "./router";

function main() {
  initButtom();
  initText();
  initPlay();
  initFormName();
  initFormRoom();
}

main();
