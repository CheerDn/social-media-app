import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams } from "react-router-dom"
import LoadingIcon from "./LoadingIcon"
import Post from "./Post"
import StateContext from "../StateContext"

function ProfilePosts() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchPosts()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingIcon />

  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post post={post} key={post._id} noAuthor={true} />
      })}
      {posts.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You don&rsquo;t have any posts yet.</p>}
      {posts.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} doesn&rsquo;t have any posts yet.</p>}
    </div>
  )
}

export default ProfilePosts
