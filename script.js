// Defina a chave da API do OpenCage
const API_KEY = '38f3f75e146e478ebd6f71b24d021dff';

// Função para calcular o frete
const calcularFrete = async () => {
    // Obtenha os valores do formulário
    const cidadeOrigem = document.getElementById('cidadeOrigem').value;
    const cidadeDestino = document.getElementById('cidadeDestino').value;
    const volume = parseFloat(document.getElementById('volume').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const tipoEnvio = document.querySelector('input[name="tipo"]:checked').value;

    // Validação de dados
    if (!cidadeOrigem || !cidadeDestino || isNaN(volume) || isNaN(peso)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Chamada à API do OpenCage para obter as coordenadas das cidades
    const urlOrigem = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cidadeOrigem)}&key=${API_KEY}`;
    const urlDestino = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cidadeDestino)}&key=${API_KEY}`;

    try {
        // Fetch das cidades de origem e destino
        const responseOrigem = await fetch(urlOrigem);
        const responseDestino = await fetch(urlDestino);

        if (!responseOrigem.ok || !responseDestino.ok) {
            throw new Error(`Erro na resposta da API.`);
        }

        const dataOrigem = await responseOrigem.json();
        const dataDestino = await responseDestino.json();

        if (dataOrigem.results.length === 0 || dataDestino.results.length === 0) {
            alert('Cidade de origem ou destino não encontrada. Tente novamente.');
            return;
        }

        // Aqui você pode processar as respostas da API para obter as coordenadas
        const latOrigem = dataOrigem.results[0].geometry.lat;
        const lngOrigem = dataOrigem.results[0].geometry.lng;
        const latDestino = dataDestino.results[0].geometry.lat;
        const lngDestino = dataDestino.results[0].geometry.lng;

        // Calcular a distância (em km) usando a fórmula de Haversine
        const distancia = calcularDistancia(latOrigem, lngOrigem, latDestino, lngDestino);

        // Calculando o preço do frete
        let precoFrete = 0;
        if (tipoEnvio === 'normal') {
            precoFrete = (volume * 0.1) + (peso * 0.05) + (distancia * 0.02); // Exemplo de cálculo
        } else {
            precoFrete = (volume * 0.2) + (peso * 0.1) + (distancia * 0.04); // Exemplo de cálculo
        }

        // Exibir o preço do frete
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `O preço do frete é R$ ${precoFrete.toFixed(2)}. Distância: ${distancia.toFixed(2)} km`;
    } catch (error) {
        console.error('Erro ao buscar dados das cidades:', error);
        alert('Erro ao buscar dados das cidades. Tente novamente.');
    }
};

// Função para calcular a distância entre duas coordenadas usando a fórmula de Haversine
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em km
    return distancia;
};

// Adicionar evento de clique ao botão calcular
document.getElementById('calcular').addEventListener('click', calcularFrete);
