/** @jsx h */
import { h, hydrate } from "https://esm.sh/preact@10.10.6"

import App from "./App.tsx";


hydrate( <App/>, document.body )
