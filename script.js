document.getElementById("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    let answer = "";
   
    const countryName = document.getElementById('country').value;
    const cityName = document.getElementById('city').value;

    const dataDiv = document.getElementById("data");
    dataDiv.innerHTML = ""; // Limpiar el contenido previo

    const searchParams = new URLSearchParams();
    searchParams.append("countryName", countryName);
    searchParams.append("cityName", cityName);
    try {
        const eventSource = new EventSource(`http://localhost:3000/api/gpt/recommendations?${searchParams.toString()}`);

        eventSource.onmessage = (event) => {
            
            incomingData = JSON.parse(event.data);

            if (incomingData === "__END__") {
                eventSource.close();
                return;
            }

            answer += incomingData;

            // Actualizar el contenido del párrafo existente en lugar de crear uno nuevo
            const paragraph = document.createElement("p");
            paragraph.textContent = answer;

            // Reemplazar el contenido del div en lugar de agregar nuevos párrafos
            dataDiv.textContent = ""; 
            dataDiv.appendChild(paragraph);
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
        };
    } catch (e) {
        console.error("Error:", e);
    }
});
