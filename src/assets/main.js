const boxPokemon=document.getElementById('boxPokemon');
const btnKanto=document.getElementById('kanto');
const btnJohto=document.getElementById('johto');

let counter=0;

let options={
    threshold: 1.0
}

const observer=new IntersectionObserver(loadMoreBox,options);
function loadMoreBox(entry){
    if(entry[0].isIntersecting){
        fetchData(`${API}pokedex/2`,10);
    }
}

async function loadBoxPokemon(pokename){
    let imgpokemon;
    try {
        let response=await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`);
        let data=await response.json()
        imgpokemon=data.sprites.front_default;
    } catch (error) {
        imgpokemon='./assets/images/poke.png';
    }

    const container=document.createElement("DIV");
    container.classList.add('text-center','p-1','sm:p-4','shadow-[0px_0px_5px_0px_gray]','rounded-lg','w-[130px]','sm:w-[160px]','min-[920px]:w-[200px]','border-box');
    const firstChild=document.createElement("DIV");
    const pokeimage=document.createElement("IMG");
    pokeimage.classList.add('m-auto');
    const secondChild=document.createElement("DIV");
    secondChild.classList.add('font-bold','capitalize');
    const button=document.createElement("BUTTON");
    button.classList.add('bg-red-400','hover:bg-red-500','mt-2','py-1','w-full','rounded-lg');

    pokeimage.setAttribute('src',`${imgpokemon}`);
    
    secondChild.textContent=pokename;
    button.textContent="More Info";

    firstChild.appendChild(pokeimage);
    container.appendChild(firstChild);
    container.appendChild(secondChild);
    container.appendChild(button);

    return container;
}



const API='https://pokeapi.co/api/v2/';
async function fetchData(urlAPI,num){
    const response=await fetch(urlAPI);
    const data=await response.json();
    console.log(data.pokemon_entries)
    for (let i = 0; i < num ; i++) {
        if(counter > data.pokemon_entries.length-1) {break}
        const newBox= await loadBoxPokemon(data.pokemon_entries[counter].pokemon_species.name);
        boxPokemon.appendChild(newBox);
        counter++;
        if(i == num-1) {observer.observe(boxPokemon.lastChild);}
    }
    /* for(const pokeName of data.pokemon_entries){
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
    } */
}
//pokemon?offset=60&limit=60
fetchData(`${API}pokedex/2`,10);

btnKanto.addEventListener("click",()=>{
    counter=0;
    boxPokemon.innerHTML=''
    fetchData(`${API}pokedex/2`,10)
})
btnJohto.addEventListener("click",()=>{
    counter=0;
    boxPokemon.innerHTML=''
    fetchData(`${API}pokedex/3`,10)
})