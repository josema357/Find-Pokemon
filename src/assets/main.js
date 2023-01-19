const boxPokemon=document.getElementById('boxPokemon');
const btnKanto=document.getElementById('kanto');
const btnJohto=document.getElementById('johto');

const API='https://pokeapi.co/api/v2/';
async function fetchData(urlAPI){
    boxPokemon.innerHTML='';
    const response=await fetch(urlAPI);
    const data=await response.json();
    console.log(data)
    for(const pokeName of data.pokemon_entries){
        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.pokemon_species.name}`)
            .then(pokeResponse=>pokeResponse.json())
            .then(pokeData=>{
                boxPokemon.insertAdjacentHTML("beforeend",`
                <div class="text-center p-1 sm:p-4 shadow-[0px_0px_5px_0px_gray] rounded-lg w-[130px] sm:w-[160px] min-[920px]:w-[200px] border-box">
                    <div>
                        <img class="m-auto" src="${pokeData.sprites.front_default}" alt="Pokemon-IMG">
                    </div>
                    <div class="font-bold capitalize">${pokeData.species.name}</div>
                    <button class="bg-red-400 hover:bg-red-500 mt-2 py-1 w-full rounded-lg">More info</button>
                </div>
                `) 
            })
            .catch(()=>{
                boxPokemon.insertAdjacentHTML("beforeend",`
                <div class="text-center p-1 sm:p-4 shadow-[0px_0px_5px_0px_gray] rounded-lg w-[130px] sm:w-[160px] min-[920px]:w-[200px] border-box">
                    <div>
                        <img class="m-auto my-[12px]" src="./assets/images/poke.png" alt="Pokemon-IMG">
                    </div>
                    <div class="font-bold capitalize">${pokeName.pokemon_species.name}</div>
                    <button class="bg-red-400 hover:bg-red-500 mt-2 py-1 w-full rounded-lg">More info</button>
                </div>
                `)
            })
    }
}
//pokemon?offset=60&limit=60
fetchData(`${API}pokedex/1`);

btnKanto.addEventListener("click",()=>{
    fetchData(`${API}pokedex/2`)
})
btnJohto.addEventListener("click",()=>{
    fetchData(`${API}pokedex/3`)
})