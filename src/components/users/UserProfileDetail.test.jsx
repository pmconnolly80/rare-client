import { render, screen, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { UserProfileDetail } from "./UserProfileDetail"
import { getProfile } from "../../managers/UserManager"

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ userId: "5" }),
}))

jest.mock("../../managers/UserManager", () => ({
  getProfile: jest.fn(),
  uploadProfileImage: jest.fn(),
}))

jest.mock("../../managers/SubscriptionManager", () => ({
  subscribeToUser: jest.fn(),
  unsubscribeFromUser: jest.fn(),
}))

const makeProfile = (overrides = {}) => ({
  id: 5,
  full_name: "Jane Doe",
  username: "janedoe",
  email: "jane@example.com",
  profile_image_url: "",
  created_on: "01/01/2024",
  user_type: "Author",
  is_subscribed: false,
  subscriber_count: 3,
  post_count: 0,
  ...overrides,
})

const renderComponent = () =>
  render(
    <BrowserRouter>
      <UserProfileDetail />
    </BrowserRouter>
  )

describe("UserProfileDetail — post_count", () => {
  beforeEach(() => {
    // viewing someone else's profile
    localStorage.setItem("current_user_id", "99")
  })

  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test("renders a Posts row in the profile table", async () => {
    getProfile.mockResolvedValue(makeProfile({ post_count: 4 }))
    renderComponent()
    await waitFor(() => {
      expect(screen.getByText("Posts")).toBeInTheDocument()
      expect(screen.getByText("4")).toBeInTheDocument()
    })
  })

  test("shows 0 when user has no approved posts", async () => {
    getProfile.mockResolvedValue(makeProfile({ post_count: 0 }))
    renderComponent()
    await waitFor(() => {
      expect(screen.getByText("Posts")).toBeInTheDocument()
      expect(screen.getByText("0")).toBeInTheDocument()
    })
  })

  test("post_count row is visible to other users, not just the profile owner", async () => {
    // current_user_id=99, profile userId=5 — a visitor, not the owner
    getProfile.mockResolvedValue(makeProfile({ post_count: 2 }))
    renderComponent()
    await waitFor(() => {
      expect(screen.getByText("Posts")).toBeInTheDocument()
    })
  })

  test("post_count row is visible when viewing your own profile", async () => {
    localStorage.setItem("current_user_id", "5") // now the owner
    getProfile.mockResolvedValue(makeProfile({ post_count: 6 }))
    renderComponent()
    await waitFor(() => {
      expect(screen.getByText("Posts")).toBeInTheDocument()
      expect(screen.getByText("6")).toBeInTheDocument()
    })
  })
})
