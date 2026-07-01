import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getProfile, uploadProfileImage, updateProfile } from "../../managers/UserManager"
import { subscribeToUser, unsubscribeFromUser } from "../../managers/SubscriptionManager"

const DEFAULT_AVATAR = "https://bulma.io/assets/images/placeholders/128x128.png"

export const UserProfileDetail = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const currentUserId = localStorage.getItem("current_user_id")
  const fileInputRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const bioRef = useRef(null)

  const isOwner = String(userId) === String(currentUserId)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("image", file)
    uploadProfileImage(userId, formData).then(data => {
      if (data.profile_image_url) {
        setProfile({ ...profile, profile_image_url: data.profile_image_url })
      }
    })
  }

  const handleSave = () => {
    updateProfile(userId, {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      bio: bioRef.current.value,
    }).then(data => {
      setProfile(data)
      setEditing(false)
    })
  }

  useEffect(() => {
    getProfile(userId).then(data => setProfile(data))
  }, [userId])

  if (!profile) return null

  return (
    <div className="container">
      <div className="box mt-5" style={{ maxWidth: 480 }}>
        <div className="has-text-centered mb-4">
          <figure className="image is-128x128 is-inline-block">
            <img
              className="is-rounded"
              src={profile.profile_image_url || DEFAULT_AVATAR}
              alt={profile.username}
            />
          </figure>
          {isOwner && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className="mt-2">
                <button
                  className="button is-small is-light"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Photo
                </button>
              </div>
            </>
          )}
        </div>

        {editing ? (
          <div>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  ref={firstNameRef}
                  className="input"
                  type="text"
                  defaultValue={profile.first_name}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  ref={lastNameRef}
                  className="input"
                  type="text"
                  defaultValue={profile.last_name}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Bio</label>
              <div className="control">
                <textarea
                  ref={bioRef}
                  className="textarea"
                  defaultValue={profile.bio}
                />
              </div>
            </div>
            <div className="buttons">
              <button className="button is-primary" onClick={handleSave}>Save</button>
              <button className="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <table className="table is-fullwidth">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{profile.full_name || "—"}</td>
                </tr>
                <tr>
                  <th>Display Name</th>
                  <td>{profile.username}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{profile.email}</td>
                </tr>
                <tr>
                  <th>Bio</th>
                  <td>{profile.bio || "—"}</td>
                </tr>
                <tr>
                  <th>Member Since</th>
                  <td>{profile.created_on}</td>
                </tr>
                <tr>
                  <th>User Type</th>
                  <td>{profile.user_type}</td>
                </tr>
                {isOwner && (
                  <tr>
                    <th>Subscribers</th>
                    <td>{profile.subscriber_count}</td>
                  </tr>
                )}
                <tr>
                  <th>Posts</th>
                  <td>{profile.post_count}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 is-flex is-gap-3">
              <Link to={`/profiles/${userId}/posts`} className="button is-link">
                View Posts
              </Link>
              {isOwner && (
                <button
                  className="button is-info ml-2"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
              {!isOwner && (
                profile.is_subscribed ? (
                  <button
                    className="button is-warning ml-2"
                    onClick={() => unsubscribeFromUser(userId).then(() => setProfile({ ...profile, is_subscribed: false }))}
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    className="button is-success ml-2"
                    onClick={() => subscribeToUser(userId).then(() => setProfile({ ...profile, is_subscribed: true }))}
                  >
                    Subscribe
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
