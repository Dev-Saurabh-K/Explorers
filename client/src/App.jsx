import { useEffect, useState } from "react";

function getInitialToken() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    localStorage.setItem("token", urlToken);
    window.history.replaceState({}, document.title, window.location.pathname);
    return urlToken;
  }

  return localStorage.getItem("token");
}

function App() {
  const [token, setToken] = useState(getInitialToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getInitialToken()));
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    fetch("http://localhost:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to fetch user:", error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const loginWithGithub = () => {
    window.location.href = "http://localhost:8000/auth/github";
  };

  // API Endpoint logout (clears cookie & local state, receives JSON response)
  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || "Logged out successfully");
      } else {
        setMessage("Logout request returned status " + res.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed: " + error.message);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  // Browser Redirect Endpoint logout (clears cookie on backend and redirects to frontend)
  const logoutWithRedirect = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "http://localhost:8000/auth/logout?redirect=true";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {message && <div>{message}</div>}

      {user ? (
        <div>
          <p>
            Logged in as {user.name || user.username} ({user.email || user.github_id})
          </p>
          <button onClick={logout} className="bg-olive-300">Logout</button>
          <button onClick={logoutWithRedirect} className="bg-amber-300">Logout with Redirect</button>
        </div>
      ) : (
        <div>
          <button onClick={loginWithGithub} className="bg-blue-300">Continue with GitHub</button>
          <button onClick={logout}>Logout</button>
          <button onClick={logoutWithRedirect}>Logout with Redirect</button>
        </div>
      )}
    </div>
  );
}

export default App;
