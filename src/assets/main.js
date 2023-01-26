const boxPokemon=document.getElementById('boxPokemon');
const btnKanto=document.getElementById('kanto');
const btnJohto=document.getElementById('johto');
const btnHoenn=document.getElementById('hoenn');
const btnSinnoh=document.getElementById('sinnoh');
const btnUnova=document.getElementById('unova');
const btnKalos=document.getElementById('kalos');
const btnAlola=document.getElementById('alola');
const btnGalar=document.getElementById('galar');
const inputElment=document.getElementById('input-search');
const resultsElem=document.getElementById('autocomplete-results');

const API='https://pokeapi.co/api/v2/';


let counter=0;
let region=sessionStorage.getItem("region") || 2;
console.log(region)
let pokeLength;
let pokeFiltered=[];

//First fetch
fetchData(`${API}pokedex/${region}`,15);

let options={
    threshold: 1.0
}
const observer=new IntersectionObserver(loadMoreBox,options);

//Function to observe an element
function loadMoreBox(entry){
    if(entry[0].isIntersecting && counter<=pokeLength){
        fetchData(`${API}pokedex/${region}`,15);
    }
}

//Function to bring information of each pokemon
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
    if(imgpokemon==='./assets/images/poke.png'){
        pokeimage.classList.add('m-auto','my-[12px]');
    }else{
        pokeimage.classList.add('m-auto');
    }
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

//Function to bring the list of pokemon
async function fetchData(urlAPI,num){
    const response=await fetch(urlAPI);
    const data=await response.json();
    pokeFiltered=[];
    pokeLength=data.pokemon_entries.length-1;
    for (let i = 0; i < num ; i++) {
        if(counter > data.pokemon_entries.length-1) {break}
        const newBox= await loadBoxPokemon(data.pokemon_entries[counter].pokemon_species.name);
        boxPokemon.appendChild(newBox);
        counter++;
        if(i == num-1) {observer.observe(boxPokemon.lastChild);}
    }
    await data.pokemon_entries.map(element=>{
        pokeFiltered.push(element.pokemon_species.name)
    })
}

//autocomplete-search
resultsElem.addEventListener("click",(event)=>{
    handleResult(event);
})

inputElment.addEventListener("keyup",(e)=>{
    autocomplete(e);
})

function autocomplete(e){
    console.log("Evento keydown")
    const value=inputElment.value;
    const results=pokeFiltered.filter(poke=>{
        return poke.toLowerCase().startsWith(value.toLowerCase().trim());
    })
    resultsElem.innerHTML=results.map((result, index)=>{
        const isSelected=index===0;
        return `
            <li
            id='autocomplete-result-${index}'
            class='autocomplete-result${isSelected ? ' selected' : ''} capitalize'
            role='option'
            ${isSelected ? "aria-selected='true'" : ''}
            >
            ${result}
            </li>
        `
    }).join('');
    resultsElem.classList.remove('hidden');
}

function handleResult(event){
    if(event.target && event.target.nodeName==='LI'){
        selectItem(event.target);
    }
}
function selectItem(node){
    if(node){
        inputElment.value=node.innerText;
        hideResults();
    }
}
function hideResults(){
    resultsElem.innerHTML='';
    resultsElem.classList.add('hidden');
}

//Event listener buttons 
btnKanto.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",2);
    boxPokemon.innerHTML=''
    hideResults();
    fetchData(`${API}pokedex/2`,15);
})
btnJohto.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",7);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/7`,15);
})
btnHoenn.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",15);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/15`,15);
})
btnSinnoh.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",6);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/6`,15);
})
btnUnova.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",9); 
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/9`,15);
})
btnKalos.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",12);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/12`,15);
})
btnAlola.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",16);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/16`,15);
})
btnGalar.addEventListener("click",()=>{
    counter=0;
    sessionStorage.setItem("region",27);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/27`,15);
})


/*
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
        })*/