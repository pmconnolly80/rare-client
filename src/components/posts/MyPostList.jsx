import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getMyPosts } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const MyPostList = () => {
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const justCreated = searchParams.get("created") === "true"

  useEffect(() => {
    getMyPosts().then(setPosts)
  }, [])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">My Posts</h2>
      {justCreated && (
        <div className="notification is-warning">
          Your post has been submitted and is pending review by an admin before it appears publicly.
        </div>
      )}
      {posts.length === 0 ? (
        <p>You haven't written any posts yet.</p>
      ) : (
        <div className="columns is-multiline">
          {posts.map(post => (
            <div key={post.id} className="column is-one-third-desktop is-half-tablet is-full-mobile">
              <PostCard
                post={post}
                showAuthor={false}
                statusTag={
                  post.approved
                    ? <span className="tag is-success">Approved</span>
                    : <span className="tag is-warning">Pending</span>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
