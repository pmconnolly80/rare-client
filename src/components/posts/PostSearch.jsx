import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { searchPosts } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const PostSearch = () => {
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const query = searchParams.get("q") || ""

  useEffect(() => {
    if (query) {
      searchPosts(query).then(setPosts)
    } else {
      setPosts([])
    }
  }, [query])

  return (
    <div className="container mt-4">
      <h2 className="title is-4">Search results for &ldquo;{query}&rdquo;</h2>
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
