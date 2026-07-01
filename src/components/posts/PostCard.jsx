import { Link } from "react-router-dom"

const authorName = (user) => {
  const full = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  return full || user.username
}

export const PostCard = ({ post, statusTag, showAuthor = true, showCategory = true }) => {
  return (
    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="card-header">
        <Link to={`/posts/${post.id}`} className="card-header-title has-text-link">
          {post.title}
        </Link>
      </div>

      <div className="card-content" style={{ flexGrow: 1 }}>
        <div className="content">
          {showAuthor && (
            <p className="is-size-7 has-text-grey mb-1">
              by {authorName(post.user)}
            </p>
          )}
          {post.excerpt && (
            <p className="is-size-6">{post.excerpt}</p>
          )}
          <div className="tags mt-2">
            {showCategory && post.category && (
              <span className="tag is-info is-light">{post.category.label}</span>
            )}
            {statusTag}
          </div>
        </div>
      </div>

      <footer className="card-footer">
        <span className="card-footer-item has-text-grey is-size-7">
          💬 {post.comment_count}
        </span>
        <span className="card-footer-item has-text-grey is-size-7">
          ❤️ {post.reaction_count}
        </span>
        <span className="card-footer-item has-text-grey is-size-7">
          {post.publication_date}
        </span>
      </footer>
    </div>
  )
}
