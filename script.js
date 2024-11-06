// Chave da API OpenCage
const OPEN_CAGE_API_KEY = '38f3f75e146e478ebd6f71b24d021dff';

// Função para buscar a cidade a partir do CEP usando ViaCEP
async function buscarCidadePorCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error("Erro ao buscar CEP");
        
        const data = await response.json();
        if (data.erro) throw new Error("CEP não encontrado");
        
        return data.localidade; // Retorna a cidade
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Função para obter coordenadas da cidade usando OpenCage
async function obterCoordenadas(cidade) {
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${cidade}&key=${OPEN_CAGE_API_KEY}`);
        const data = await response.json();
        
        if (data.results.length === 0) throw new Error("Cidade não encontrada");
        
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
    } catch (error) {
        console.error("Erro ao obter coordenadas:", error);
        return null;
    }
}

// Função para calcular a distância entre duas coordenadas
function calcularDistancia(coord1, coord2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna a distância em km
}

// Função principal para calcular o frete
async function calcularFrete() {
    const cepOrigem = document.getElementById("cepOrigem").value;
    const cepDestino = document.getElementById("cepDestino").value;
    const peso = parseFloat(document.getElementById("peso").value);
    const volume = parseFloat(document.getElementById("volume").value);
    const tipoFrete = document.getElementById("tipoFrete").value;

    if (!cepOrigem || !cepDestino || !peso || !volume) {
        document.getElementById("resultado").innerText = "Preencha todos os campos.";
        return;
    }

    const cidadeOrigem = await buscarCidadePorCEP(cepOrigem);
    const cidadeDestino = await buscarCidadePorCEP(cepDestino);

    if (!cidadeOrigem || !cidadeDestino) {
        document.getElementById("resultado").innerText = "Erro ao buscar dados das cidades. Verifique os CEPs.";
        return;
    }

    const coordOrigem = await obterCoordenadas(cidadeOrigem);
    const coordDestino = await obterCoordenadas(cidadeDestino);

    if (!coordOrigem || !coordDestino) {
        document.getElementById("resultado").innerText = "Erro ao obter coordenadas das cidades.";
        return;
    }

    const distancia = calcularDistancia(coordOrigem, coordDestino);

    // Calcula o frete com base na distância, peso, volume e tipo de frete
    const taxaBase = tipoFrete === "expresso" ? 1.5 : 1.0;
    const precoPorDistancia = distancia * 0.1;
    const precoPorPeso = peso * 0.005;
    const precoPorVolume = volume * 0.002;
    
    const precoFinal = (precoPorDistancia + precoPorPeso + precoPorVolume) * taxaBase;

    document.getElementById("resultado").innerText =
        `De ${cidadeOrigem} para ${cidadeDestino}: R$${precoFinal.toFixed(2)}`;
}
