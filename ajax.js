function eliminarPelicula(imdbID) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://movie.azurewebsites.net/api/cartelera?imdbID=${imdbID}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la película');
                }
                return response.json();
            })
            .then(() => {
                Swal.fire(
                    'Eliminada!',
                    'La película ha sido eliminada.',
                    'success'
                );
                cargarPeliculas();
            })
            .catch(error => {
                console.error('Error al eliminar la película:', error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar la película.',
                    'error'
                );
            });
        }
    });
}

function cargarPeliculas() {
    console.log("Cargando películas...");
    fetch('https://movie.azurewebsites.net/api/cartelera?title=&ubication=')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las películas: ' + response.statusText);
            }
            return response.json();
        })
        .then(peliculas => {
            const container = document.getElementById('moviesContainer');
            container.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevas tarjetas

            peliculas.forEach(pelicula => {
                if (pelicula.imdbID && pelicula.Poster) {  // Verificar que cada película tenga un ID y un Poster antes de mostrarla
                    const peliculaHTML = `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="${pelicula.Poster}" class="card-img-top" alt="${pelicula.Title}">
                                <div class="card-body">
                                    <h5 class="card-title">${pelicula.Title}</h5>
                                    <p class="card-text">${pelicula.description}</p>
                                    <p class="card-text"><small class="">Año: ${pelicula.Year}</small></p>
                                    <p class="card-text"><small class="">Ubicación: ${pelicula.Ubication}</small></p>
                                    <p class="card-text"><small class="">Tipo: ${pelicula.Type}</small></p>
                                    <button onclick="actualizarPelicula('${pelicula.imdbID}')" class="btn btn-primary">Actualizar</button>
                                    <button onclick="eliminarPelicula('${pelicula.imdbID}')" class="btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    container.innerHTML += peliculaHTML;
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar las películas:', error);
            document.getElementById('moviesContainer').innerHTML = `<p class="text-center text-white">No se pudo cargar las películas: ${error.message}</p>`;
        });
}

window.onload = cargarPeliculas;

function guardardatos() {
    const movieData = {
        imdbID: document.getElementById("imdbID").value,
        Title: document.getElementById("Title").value,
        Year: document.getElementById("Year").value,
        Type: document.getElementById("Type").value,
        Poster: document.getElementById("Poster").value,
        Ubication: document.getElementById("Ubication").value,
        description: document.getElementById("description").value,
        Estado: document.getElementById("Estado").value === "1" ? true : false
    };

    fetch('https://movie.azurewebsites.net/api/cartelera', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir película');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: "¡Buen trabajo!",
            text: "La película ha sido añadida exitosamente",
            icon: "success"
        });
        cargarPeliculas();
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "¡Algo salió mal al añadir la película!",
            footer: '<a href="#">¿Por qué tengo este problema?</a>'
        });
    });
}

function actualizarPelicula(imdbID) {
    fetch(`https://movie.azurewebsites.net/api/cartelera?imdbID=${imdbID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la película');
            }
            return response.json();
        })
        .then(pelicula => {
            // Llenar los campos del modal con la información de la película
            document.getElementById('updateImdbID').value = pelicula.imdbID;
            document.getElementById('updateTitle').value = pelicula.Title;
            document.getElementById('updateYear').value = pelicula.Year;
            document.getElementById('updateType').value = pelicula.Type;
            document.getElementById('updatePoster').value = pelicula.Poster;
            document.getElementById('updateUbication').value = pelicula.Ubication;
            document.getElementById('updateDescription').value = pelicula.description;
            document.getElementById('updateEstado').value = pelicula.Estado ? '1' : '0';

            // Mostrar el modal de actualización
            var updateModal = new bootstrap.Modal(document.getElementById('updateMovieModal'));
            updateModal.show();
        })
        .catch(error => {
            console.error('Error al cargar los detalles de la película:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "¡Algo salió mal al cargar los detalles de la película!"
            });
        });
}

function guardarActualizacion() {
    const updatedMovieData = {
        imdbID: document.getElementById("updateImdbID").value,
        Title: document.getElementById("updateTitle").value,
        Year: document.getElementById("updateYear").value,
        Type: document.getElementById("updateType").value,
        Poster: document.getElementById("updatePoster").value,
        Ubication: document.getElementById("updateUbication").value,
        description: document.getElementById("updateDescription").value,
        Estado: document.getElementById("updateEstado").value === "1" ? true : false
    };

    fetch(`https://movie.azurewebsites.net/api/cartelera?imdbID=${updatedMovieData.imdbID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovieData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar la película');
        }
        return response.json();
    })
    .then(() => {
        Swal.fire({
            title: "¡Actualizado!",
            text: "La película ha sido actualizada exitosamente",
            icon: "success"
        });
        cargarPeliculas();  // Recargar las películas para reflejar los cambios
        var updateModal = bootstrap.Modal.getInstance(document.getElementById('updateMovieModal'));
        updateModal.hide();  // Cerrar el modal
    })
    .catch(error => {
        console.error('Error al actualizar la película:', error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "¡Algo salió mal al actualizar la película!"
        });
    });
}
