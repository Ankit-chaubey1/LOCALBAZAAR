import React from 'react'

export default function UserContext() {

    useEffect(() => {
        async function getCurrentUser() {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
            }
            const res = await fetch("http://localhost:3000/api/user/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const data = await res.json();
            if (data.error) {
                console.error("Error fetching user data:", data.error);
                window.location.href = "/login";
            }
            console.log("Current user:", data);
        }
        getCurrentUser();
    }, []);
    return (
        <div>UserContext</div>
    )
}
