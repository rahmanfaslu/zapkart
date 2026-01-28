export const createUser = async (userData) => {
  const res = await fetch("https://shigify-backend.onrender.com/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  })
  return res.json()
}
