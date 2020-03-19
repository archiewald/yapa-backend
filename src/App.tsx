import React from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";

import { Dashboard } from "pages/dashboard/Dashboard";
import { Settings } from "pages/settings/Settings";

export const App: React.FC = () => {
  return (
    <BrowserRouter basename="yapa-frontend">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
