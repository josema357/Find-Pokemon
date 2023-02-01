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
let  btnCloseMoreInfo;
const moreInfoPanel=document.getElementById('moreinfo');
const curtainMoreInfo=document.getElementById('moreinfo-panel');


const API='https://pokeapi.co/api/v2/';

let abortController=null;
let counter=0;
let region=sessionStorage.getItem("region") || 2;
let pokeLength;
let pokeFiltered=[];
let currentRegion=sessionStorage.getItem("currentRegion") || "kanto";

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
    button.setAttribute('id','btnMoreInfo')
    button.addEventListener('click',showMoreInfo);

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
    sessionStorage.setItem("currentRegion","kanto");
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
    sessionStorage.setItem("currentRegion","johto");
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
    sessionStorage.setItem("currentRegion","hoenn");
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
    sessionStorage.setItem("currentRegion","sinnoh");
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
    sessionStorage.setItem("currentRegion","unova");
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
    sessionStorage.setItem("currentRegion","kalos");
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
    sessionStorage.setItem("currentRegion","alola");
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
    sessionStorage.setItem("currentRegion","galar");
    boxPokemon.innerHTML='';
    hideResults();
    fetchData(`${API}pokedex/27`,30);
})

//hide more info
let pathFailPokemon='./assets/images/poke.png';
function closeMoreInfo(){
    moreInfoPanel.classList.add('hidden')
}
async function showMoreInfo(e){
    curtainMoreInfo.innerHTML='';
    let pokeName=e.target.parentNode.children[1].textContent;
    try {
        let response=await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
        let data=await response.json()
        curtainMoreInfo.insertAdjacentHTML('beforeend',`
            <div class="grid grid-cols-[1fr] min-[250px]:grid-cols-[repeat(2,_1fr)] min-[250px]:gap-y-[10px] gap-x-[10px] pt-[45px]">
                <img class="m-auto" src="${data.sprites.front_default || pathFailPokemon}" alt="">
                <img class="m-auto" src="${data.sprites.back_default || pathFailPokemon}" alt="">
                <img class="m-auto" src="${data.sprites.front_shiny || pathFailPokemon}" alt="">
                <img class="m-auto" src="${data.sprites.back_shiny || pathFailPokemon}" alt="">
            </div>
            <div class="font-bold capitalize text-xl tracking-wider">${pokeName}</div>
            <div class="font-bold uppercase text-sm">${sessionStorage.getItem("currentRegion") || currentRegion}</div>
            <div class="absolute w-full flex justify-end p-[5px]"><img id="close" class="cursor-pointer" src="./assets/images/close.svg" alt=""></div>`)
        btnCloseMoreInfo=document.getElementById('close');
        btnCloseMoreInfo.addEventListener("click",closeMoreInfo);
    } catch (error) {
        curtainMoreInfo.insertAdjacentHTML('beforeend',`
            <div class="grid grid-cols-[1fr] min-[250px]:grid-cols-[repeat(2,_1fr)] min-[250px]:gap-y-[10px] gap-x-[10px] pt-[45px]">
                <img class="m-auto" src="${pathFailPokemon}" alt="">
                <img class="m-auto" src="${pathFailPokemon}" alt="">
                <img class="m-auto" src="${pathFailPokemon}" alt="">
                <img class="m-auto" src="${pathFailPokemon}" alt="">
            </div>
            <div class="font-bold capitalize text-xl tracking-wider">${pokeName}</div>
            <div class="font-bold uppercase text-sm">${sessionStorage.getItem("currentRegion") || currentRegion}</div>
            <div class="absolute w-full flex justify-end p-[5px]"><img id="close" class="cursor-pointer" src="./assets/images/close.svg" alt=""></div>`)
        btnCloseMoreInfo=document.getElementById('close');
        btnCloseMoreInfo.addEventListener("click",closeMoreInfo);
    }

    moreInfoPanel.classList.remove('hidden')
 }