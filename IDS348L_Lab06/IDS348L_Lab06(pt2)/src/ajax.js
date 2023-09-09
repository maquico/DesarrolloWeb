const personasList = document.getElementById('personas-list');

// Función para cargar y mostrar la lista de personas
function cargarListaPersonas() {
    fetch('/obtenerPersonas')
        .then((response) => response.json())
        .then((data) => {
            const personas = data.personas;
            const listaHTML = personas.map((persona) => {
                return `<li>${persona.Nombres} ${persona.Apellidos} - ${persona.VaAllevar}</li>`;
            }).join('');
            personasList.innerHTML = `<ul>${listaHTML}</ul>`;
        })
        .catch((error) => {
            console.error(error);
        });
}

// Cargar la lista de personas cuando se carga la página
window.addEventListener('load', cargarListaPersonas);
