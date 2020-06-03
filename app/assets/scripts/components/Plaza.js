import React, { useEffect, useState } from "react"
import Axios from "axios"
import { Link } from "react-router-dom"
import Page from "./Page"
import LoadingIcon from "./LoadingIcon"

function Plaza() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchUsers() {
      try {
        // note that the url is plural 'followers'
        const response = await Axios.get("/plaza", { cancelToken: ourRequest.token })
        setUsers(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchUsers()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading) return <LoadingIcon />

  return (
    <Page title="Plaza">
      <h2>We are registered users!&nbsp;&nbsp;:)</h2>
      <div className="list-group">
        {users.map((user, index) => {
          return (
            <Link key={index} to={`/profile/${user.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={user.avatar} /> {user.username}
            </Link>
          )
        })}
        {users.length == 0 && <p className="lead text-muted text-center">There is no user yet.</p>}
      </div>
    </Page>
  )
}

export default Plaza
