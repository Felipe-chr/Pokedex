const favoritos = [];
let idAtual = 1;

document.getElementById("inputId").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        buscarPokemon();
    }
});

document.getElementById("buttonId").addEventListener("click", buscarPokemon);

document.querySelector(".direita").addEventListener('click', () => navegarDpad(1));
document.querySelector(".cima").addEventListener('click', () => navegarDpad(1));
document.querySelector(".esquerda").addEventListener('click', () => navegarDpad(-1));
document.querySelector(".baixo").addEventListener('click', () => navegarDpad(-1));

async function buscarPokemon(){
    const termoBusca = document.getElementById("inputId").value.toLowerCase().trim();
    
    const pokemon = termoBusca === "" ? idAtual : termoBusca;
    const resultado = document.getElementById("visorId");

    resultado.innerHTML = "<h2>Buscando...</h2>";

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if(!resposta.ok){
            throw new Error();
        }

        const dados = await resposta.json();
        idAtual = dados.id;

        let tiposHTML = "";
        dados.types.forEach(tipo => {
            tiposHTML += `
                <span class="tipo ${tipo.type.name}" style="background: #222; color: #fff; padding: 2px 8px; margin: 0 4px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">
                    ${tipo.type.name}
                </span>
            `;
        });

        resultado.style.overflowY = "auto";
        resultado.style.flexDirection = "column";
        resultado.style.justifyContent = "flex-start";
        resultado.style.padding = "15px 10px";
        resultado.style.boxSizing = "border-box";

        resultado.innerHTML = `
            <img
            class="pokemon-img"
            style="width: 110px; height: 110px; object-fit: contain; margin: 0 auto; display: block;"
            src="${dados.sprites.other["official-artwork"].front_default}"
            alt="${dados.name}">

            <h2 class="nome" style="margin: 5px 0 0 0; text-align: center; text-transform: capitalize;">
                ${dados.name}
            </h2>

            <p class="numero" style="margin: 2px 0 10px 0; text-align: center; color: #555;">
                #${dados.id}
            </p>

            <div class="tipos" style="display: flex; justify-content: center; margin-bottom: 12px;">
                ${tiposHTML}
            </div>

            <div class="info" style="font-size: 12px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 15px; background: rgba(255,255,255,0.6); padding: 8px; border-radius: 6px; box-sizing: border-box;">
                <p style="margin:0;"><strong>Altura:</strong> ${dados.height/10} m</p>
                <p style="margin:0;"><strong>Peso:</strong> ${dados.weight/10} kg</p>
                <p style="margin:0;"><strong>HP:</strong> ${dados.stats[0].base_stat}</p>
                <p style="margin:0;"><strong>Ataque:</strong> ${dados.stats[1].base_stat}</p>
                <p style="margin:0;"><strong>Defesa:</strong> ${dados.stats[2].base_stat}</p>
                <p style="margin:0;"><strong>Velocidade:</strong> ${dados.stats[5].base_stat}</p>
            </div>
        `;

    } catch {
        resultado.innerHTML = `
            <div style="text-align: center;">
                <h2>Pokémon não encontrado!</h2>
                <p>Tente outro nome ou número.</p>
            </div>
        `;
    }
}

function navegarDpad(direcao) {
    idAtual += direcao;

    if (idAtual < 1) idAtual = 151; 
    if (idAtual > 151) idAtual = 1; 

    document.getElementById("inputId").value = idAtual;
    buscarPokemon();
}
