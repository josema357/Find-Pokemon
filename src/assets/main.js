const API='https://pokeapi.co/api/v2/';

async function fetchData(urlAPI){
    const response=await fetch(urlAPI);
    const data=await response.json();
    console.log(data)
}
//pokemon?offset=60&limit=60
fetchData(`${API}region/`);