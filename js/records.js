document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "http://wd.etsisi.upm.es:10000/records";
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response went wrong");
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById("recordsTableBody");
            let rank = 1;

            data.slice(0, 10).forEach(record => {
                const row = document.createElement("tr");
                const recordDate = new Date(record.recordDate).toLocaleDateString("en-GB", {
                   day: "2-digit",
                   month: "2-digit",
                   year: "numeric"                 
                });
                row.innerHTML = `
                    <td>${rank++}</td>
                    <td>${record.username}</td>
                    <td>${record.punctuation}</td>
                    <td>${record.ufos}</td>
                    <td>${record.disposedTime}</td>
                    <td>${recordDate}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
});
