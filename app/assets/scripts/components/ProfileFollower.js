import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingIcon from "./LoadingIcon"
import StateContext from "../StateContext"

function ProfileFollower() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchFollowers() {
      try {
        // note that the url is plural 'followers'
        const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
        setFollowers(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchFollowers()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingIcon />

  return (
    <div className="list-group">
      {followers.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
      {followers.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>}
      {followers.length == 0 && appState.user.username != username && (
        <p className="lead text-muted text-center">
          {username} doesn&rsquo;t have any followers yet.
          {appState.loggedIn && " Be the first to follow!"}
          {!appState.loggedIn && (
            <>
              {" "}
              If you want to follow, you need to <Link to="/">sign up</Link> for an account first.{" "}
            </>
          )}
        </p>
      )}
    </div>
  )
}

export default ProfileFollower
