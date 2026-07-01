import { useEffect, useState } from "react"
import { getMyPosts } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const MyPostList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getMyPosts().then(setPosts)
  }, [])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">My Posts</h2>
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
