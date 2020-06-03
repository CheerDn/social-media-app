import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import LoadingIcon from "./LoadingIcon"
import Axios from "axios"
import Post from "./Post"
import { Link } from "react-router-dom"

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState(draft => {
          draft.isLoading = false
          draft.feed = response.data
        })
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchData()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [])

  function handleSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  if (state.isLoading) {
    return <LoadingIcon />
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The Latest From Those you follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post post={post} key={post._id} />
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;
            <a onClick={handleSearchIcon} href="#">
              Search
            </a>
            &rdquo; feature to find the posts you're interested in or go to &ldquo;<Link to="/plaza">Plaza</Link>&rdquo; to follow some people.
          </p>
        </>
      )}
    </Page>
  )
}

export default Home
