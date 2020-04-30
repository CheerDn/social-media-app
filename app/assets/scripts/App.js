import "../styles/styles.css"

import React from "react"
import ReactDOM from "react-dom"

//Import React components
import Header from "./modules/Header"
import HomeGuest from "./modules/HomeGuest"
import Footer from "./modules/Footer"
function ExampleComponent() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  )
}

ReactDOM.render(<ExampleComponent />, document.querySelector("#app"))

//hot module replacement for devServer
if (module.hot) {
  module.hot.accept()
}
