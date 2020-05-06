import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingIcon from "./LoadingIcon"
import StateContext from "../StateContext"

function ProfileFollowing() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [followings, setFollowings] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchFollowings() {
      try {
        // note that the url is plural 'followers'
        const response = await Axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token })
        setFollowings(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchFollowings()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingIcon />

  return (
    <div className="list-group">
      {followings.map((following, index) => {
        return (
          <Link key={index} to={`/profile/${following.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={following.avatar} /> {following.username}
          </Link>
        )
      })}
      {followings.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You aren&rsquo;t following anyone yet.</p>}
      {followings.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} isn&rsquo;t following anyone yet.</p>}
    </div>
  )
}

export default ProfileFollowing
