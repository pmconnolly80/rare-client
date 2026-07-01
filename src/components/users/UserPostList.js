import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostsByUser } from "../../managers/PostManager"
import { getProfile } from "../../managers/UserManager"
import { PostCard } from "../posts/PostCard"

export const UserPostList = () => {
  const { userId } = useParams()
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProfile(userId).then(setProfile)
    getPostsByUser(userId).then(setPosts)
  }, [userId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts by {profile ? profile.full_name || profile.username : "..."}
      </h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="columns is-multiline">
          {posts.map(post => (
            <div key={post.id} className="column is-one-third-desktop is-half-tablet is-full-mobile">
              <PostCard post={post} showAuthor={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
