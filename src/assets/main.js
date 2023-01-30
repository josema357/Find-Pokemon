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
const btnSearch=document.getElementById('btn-search');

const API='https://pokeapi.co/api/v2/';

let abortController=null;
let counter=0;
let region=sessionStorage.getItem("region") || 2;
let pokeLength;
let pokeFiltered=[];

document.addEventListener("click",()=>{
    resultsElem.classList.add('hidden')
})

//Search button
btnSearch.addEventListener("click",searchPokemon);
async function searchPokemon(){
    if(pokeFiltered.indexOf(inputElment.value.toLowerCase())!==-1){
        boxPokemon.innerHTML='';
        hideResults();
        const foundPokemon= await loadBoxPokemon(inputElment.value.toLowerCase());
        boxPokemon.appendChild(foundPokemon)
    }else{
        region=sessionStorage.getItem("region")
        boxPokemon.innerHTML='';
        counter=0
        fetchData(`${API}pokedex/${region}`,30);
    }
    
}

//First fetch
fetchData(`${API}pokedex/${region}`,30);

let options={
    threshold: 1.0
}
const observer=new IntersectionObserver(loadMoreBox,options);

//Function to observe an element
function loadMoreBox(entry){
    if(entry[0].isIntersecting && counter<=pokeLength){
        fetchData(`${API}pokedex/${sessionStorage.getItem("region")||region}`,10);
    }
}

//Function to bring information of each pokemon
async function loadBoxPokemon(pokename){
    let imgpokemon;
    try {
        let response=await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`);
        let data=await response.json()
        console.log(data)
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
    abortController=new AbortController();
    const signal=abortController.signal;
    const response=await fetch(urlAPI,signal);
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

inputElment.addEventListener("input",(e)=>{
    autocomplete(e);
})
inputElment.addEventListener("keyup",(event)=>{
    handleResultKeydown(event)
})

function autocomplete(){
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
function handleResultKeydown(e){
    const {key}=e;
    switch (key){
        case 'Backspace':
            return;
        case 'Enter':
            searchPokemon();
            inputElment.setSelectionRange(inputElment.value.length,inputElment.value.length);
        default:
            selectFirstResult();
    }
}
function selectFirstResult(){
    const value=inputElment.value;
    const autocompleteValue=resultsElem.querySelector(".selected");
    if(!value || !autocompleteValue){
        return;
    }
    if(value !==autocompleteValue.innerText){
        inputElment.value=autocompleteValue.innerText;
        inputElment.setSelectionRange(value.length,autocompleteValue.innerText.length);
    }
}
function selectItem(node){
    if(node){
        inputElment.value=node.innerText;
        searchPokemon();
        hideResults();
    }
}
function hideResults(){
    resultsElem.innerHTML='';
    resultsElem.classList.add('hidden');
}

//Event listener buttons 
btnKanto.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",2);
    boxPokemon.innerHTML=''
    hideResults();
    fetchData(`${API}pokedex/2`,30);
})
btnJohto.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",7);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/7`,30);
})
btnHoenn.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",15);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/15`,30);
})
btnSinnoh.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",6);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/6`,30);
})
btnUnova.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",9); 
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/9`,30);
})
btnKalos.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",12);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/12`,30);
})
btnAlola.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",16);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/16`,30);
})
btnGalar.addEventListener("click",()=>{
    if(abortController){
        abortController.abort();
    }
    counter=0;
    sessionStorage.setItem("region",27);
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/27`,30);
})