document.getElementById("myLogin").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("psw").value;
    const apiUrl = "http://wd.etsisi.upm.es:10000/users/login";

    fetch(apiUrl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "GET",
    })
    .then(response => {
        if (response.ok) {
            const token = response.headers.get("Authorization");
            if (token) {
                sessionStorage.setItem("token", token);
                alert("Login successful! Token stored for the session.");
            } else {
                throw new Error("Token not found in response headers.");
            }
        } else if (response.status === 400) {
            throw new Error("No username or password.");
        } else if (response.status === 401) {
            throw new Error("Invalid username or password.");
        } else {
            throw new Error("Internal server error.");
        }
    })
    .catch(error => {
        document.getElementById("error-message").style.display = "block";
        console.error("Login error:", error);
    });
});
