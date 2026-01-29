


export const loginApi = async ({ correo, clave }) => {
  try {
    const res = await fetch("http://localhost:3308/api/v1/users/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, clave }),
    });

    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
