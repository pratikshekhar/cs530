import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "../App";
import Fav from "./Fav";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App} exact />
      <Route path="/fav" component={Fav} />
    </Switch>
  </BrowserRouter>
);

export default Router;