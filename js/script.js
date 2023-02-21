// HELPER FUNCTIONS
// HELP ADDING API RETURNED GENRES
const addGenre_Dropdown_Items = (genres) => {

    const select = document.getElementById('genres')

    genres.forEach(genre => {
        let option = document.createElement("option");
        option.value = genre;
        option.text = genre;
        select.appendChild(option);
    });
};

// HELP RETURNING FRONTEND SELECTE GENRE
const getSelectedGenre = () => {

    const selectedGenre = document.getElementById('genres').value;
    return selectedGenre;
};

// HELP API RETURNING RANDOM TRACK FROM SELECTED GENRE
const getRandomTrack = (tracks) => {

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = {
        track: `${tracks[randomIndex].artists[0].name} - ${tracks[randomIndex].name}`,
        spotifyURL: `${tracks[randomIndex].external_urls.spotify}?si`,
        image: tracks[randomIndex].album.images[0].url
    }
    return randomTrack;
};

// HELP CREATING HTML DISPLAYING API RETURNED RANDOM TRACK
const displayRandomTrack = (randomTrack) => {

    document.getElementById('show-song').innerHTML = `
        <p id='title'>SONG: ${randomTrack.track}</p>
        <img id='album-cover' src="${randomTrack.image}"/>
        <button id='spotify' onclick="window.open('${randomTrack.spotifyURL}','_blank')">Play Song in Spotify<img id='spotify-icon' src='./media/spotify.png'></button>`
}



// SPOTIFY FUNCTIONS
// FETCH SPOTIFY ACCESS TOKEN
const getToken = async () => {

    const client_ID = 'f348038046b5486b92755c947e0ac75e';
    const client_Secret = 'dc0f004fc90548a89a5a81064f55af95';

    try {
        const RESPONSE = await fetch('https://accounts.spotify.com/api/token', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_ID + ':' + client_Secret)
            },
            body: 'grant_type=client_credentials'

        });

        if (RESPONSE.ok) {
            const jsonResponse = await RESPONSE.json();
            return jsonResponse.access_token;

        }
    }
    catch (error) {
        console.log(error);
    }
};

// FETCH SPOTIFY MUSIC GENRES
const getGenres = async (access_token) => {

    try {
        const RESPONSE = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {

            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            }
        });

        if (RESPONSE.ok) {
            const jsonResponse = await RESPONSE.json();
            return jsonResponse.genres;
        }
    }
    catch (error) {
        console.log(error);
    }
};

// FETCH SPOTIFY TRACKS
const getSongs = async (access_token) => {

    const selectedGenre = getSelectedGenre();

    try {
        const RESPONSE = await fetch(`https://api.spotify.com/v1/recommendations/?seed_genres=${selectedGenre}&seed_tracks`, {

            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            }
        });

        if (RESPONSE.ok) {
            const jsonResponse = await RESPONSE.json()
            return jsonResponse.tracks
        }
    }
    catch (error) {
        console.log(error);
    }
};



// START HTML POPULATION

getToken()
    .then(getGenres)
    .then(addGenre_Dropdown_Items);


document.getElementById('generate-song').onclick = () => {
    getToken()
        .then(getSongs)
        .then(getRandomTrack)
        .then(displayRandomTrack)
}






