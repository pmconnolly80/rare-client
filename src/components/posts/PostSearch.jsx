import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { searchPosts } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const PostSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const query = searchParams.get("q") || ""
  const author = searchParams.get("author") || ""
  const qRef = useRef(null)
  const authorRef = useRef(null)

  useEffect(() => {
    if (query || author) {
      searchPosts({ q: query, author }).then(setPosts)
    } else {
      setPosts([])
    }
  }, [query, author])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    const q = qRef.current.value.trim()
    const a = authorRef.current.value.trim()
    if (q) params.q = q
    if (a) params.author = a
    setSearchParams(params)
  }

  return (
    <div className="container mt-4">
      <form key={searchParams.toString()} onSubmit={handleSearch} className="mb-4">
        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              ref={qRef}
              className="input"
              type="text"
              placeholder="Search by title..."
              defaultValue={query}
            />
          </div>
          <div className="control is-expanded">
            <input
              ref={authorRef}
              className="input"
              type="text"
              placeholder="Filter by author..."
              defaultValue={author}
            />
          </div>
          <div className="control">
            <button type="submit" className="button is-success">Search</button>
          </div>
        </div>
      </form>
      <h2 className="title is-4">Search results</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="columns is-multiline">
          {posts.map(post => (
            <div key={post.id} className="column is-one-third-desktop is-half-tablet is-full-mobile">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
