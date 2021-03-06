import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthtoken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// redux
import { Provider } from "react-redux";
import store from "./store";

// components
import PrivateRoute from "./components/common/PrivateRoute";
import Landing from "./components/layout/Landing";
import Header from "./components/layout/Header";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateBudget from "./components/dashboard/CreateBudget";
import EditBudget from "./components/dashboard/EditBudget";
import AddToBudget from "./components/budget/AddToBudget";
import NotFound from "./components/not-found/NotFound";

// import styles
import "./styles/App.css";
import { clearCurrentBudget } from "./actions/budgetActions";

// check for Token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentBudget());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            <Route exact path="/" component={Landing} />
            <main role="main" className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/Login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-budget"
                  component={CreateBudget}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-budget"
                  component={EditBudget}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-to-budget"
                  component={AddToBudget}
                />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
            </main>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
