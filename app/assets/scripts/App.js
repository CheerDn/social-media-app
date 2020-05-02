import "../styles/styles.css"

import React, { useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

//Import React components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"

function App() {
  // check if user have sign in before
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("socialmediaappToken")))
  // initial state with empty string
  const [flashMessages, setFlashMessages] = useState([])

  function addFlashMessage(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <BrowserRouter>
      <FlashMessages messages={flashMessages} />
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Switch>
        <Route path="/" exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/create-post">
          <CreatePost addFlashMessage={addFlashMessage} />
        </Route>
        <Route path="/post/:id">
          <ViewSinglePost />
        </Route>
        <Route path="/about-us" exact>
          <About />
        </Route>
        <Route path="/terms" exact>
          <Terms />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.querySelector("#app"))

//hot module replacement for devServer
if (module.hot) {
  module.hot.accept()
}
