import React, { useEffect, useContext, useState } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, Redirect } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import LoadingIcon from "./LoadingIcon"
import NotFound from "./NotFound"

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
    permissionProblem: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        //if user enter an URL that link to others post
        if (appState.user.username != action.value.author.username || !appState.loggedIn) draft.permissionProblem = true
        return
      case "titleChange":
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "submitRequest":
        if (!draft.title.hasErrors && draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "You must provide a title."
        } else {
          draft.title.hasErrors = false
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "You must provide body content."
        } else {
          draft.body.hasErrors = false
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitRequest" })
  }

  // fetch post content only once
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request might be cancelled")
      }
    }
    fetchPost()
    // cancel axios request when the component unmounted or stop being rendered
    return () => {
      ourRequest.cancel()
    }
  }, [])

  // take care sendCount to post content
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post updated!" })
        } catch (e) {
          console.log(e)
          console.log("There was a problem or the request might be cancelled")
        }
      }
      fetchPost()
      // cancel axios request when the component unmounted or stop being rendered
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.permissionProblem) {
    appDispatch({ type: "flashMessage", value: " You do not have permission to edit that post" })
    return <Redirect to="/" />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`} className="small font-weight-bold">
        &laquo; Back to post
      </Link>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage"> {state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage"> {state.body.message}</div>}
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Update
        </button>
      </form>
    </Page>
  )
}

export default ViewSinglePost
