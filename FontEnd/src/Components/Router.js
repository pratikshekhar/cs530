import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "../App";
import Recipe from "./Recipe";
import Login from "./Login";
import Fav from "./Fav";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App} exact />
      <Route path="/recipe/:id" component={Recipe} />
      <Route path="/login" component={Login} />
      <Route path="/fav" component={Fav} />
    </Switch>
  </BrowserRouter>
);

export default Router;

// make a login page
// default rout to login page
// on submitting user id and password link to APP page
