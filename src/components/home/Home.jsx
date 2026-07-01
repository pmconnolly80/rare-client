import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getSubscribedPosts } from "../../managers/PostManager"

export const Home = () => {
  const [subscribedPosts, setSubscribedPosts] = useState([])

  useEffect(() => {
    getSubscribedPosts().then(setSubscribedPosts)
  }, [])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">Posts from Subscriptions</h2>
      {subscribedPosts.length === 0 ? (
        <div className="box mt-4">
          <p className="title is-5">Your feed is empty</p>
          <p className="mb-4">
            This page shows the latest posts from authors you subscribe to.
            Subscribe to an author from their profile page and their posts will appear here.
          </p>
          <Link to="/posts" className="button is-primary">
            Browse posts and find authors to follow
          </Link>
        </div>
      ) : (
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {subscribedPosts.map(post => (
              <tr key={post.id}>
                <td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.user.username}</td>
                <td>{post.category ? post.category.label : "—"}</td>
                <td>{post.publication_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
