import React, { useEffect } from "react"
import Container from "./Container"

const Page = props => {
  useEffect(() => {
    document.title = `${props.title} | SocialMediaApp`
    window.scroll(0, 0)
  }, [])

  return <Container wide={props.wide}>{props.children}</Container>
}

export default Page
