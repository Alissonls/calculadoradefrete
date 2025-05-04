# 📦 Documentação – Calculadora de Fretes em JavaScript

## 📝 Visão Geral

A Calculadora de Fretes é um módulo JavaScript que permite calcular o custo estimado de um frete com base em três fatores principais:

- **Peso do pacote (kg)**
- **Distância da entrega (km)**
- **Tipo de entrega** (ex: padrão, expressa)

---

## 📂 Estrutura do Projeto

frete-calculadora/
├── index.html
├── style.css
└── calculadoraFrete.js


---

## ⚙️ Lógica de Cálculo

A fórmula base para cálculo de frete é:

frete = (peso * custoPorKg) + (distancia * custoPorKm) * multiplicadorTipo



### Tabela de Parâmetros

| Parâmetro      | Tipo     | Descrição                                  |
|----------------|----------|---------------------------------------------|
| peso           | number   | Peso do pacote em quilogramas               |
| distancia      | number   | Distância da entrega em quilômetros         |
| tipoEntrega    | string   | Tipo de entrega: `'padrao'` ou `'expressa'`|

### Tipos de entrega e multiplicadores:

- `'padrao'`: multiplicador = 1.0
- `'expressa'`: multiplicador = 1.5

Valores fixos no script:

```js
const custoPorKg = 5.0;     // R$ por kg
const custoPorKm = 0.2;     // R$ por km

💻 Exemplo de Código
function calcularFrete(peso, distancia, tipoEntrega) {
    const custoPorKg = 5.0;
    const custoPorKm = 0.2;

    let multiplicador;

    switch (tipoEntrega) {
        case 'padrao':
            multiplicador = 1.0;
            break;
        case 'expressa':
            multiplicador = 1.5;
            break;
        default:
            throw new Error("Tipo de entrega inválido. Use 'padrao' ou 'expressa'.");
    }

    const custo = ((peso * custoPorKg) + (distancia * custoPorKm)) * multiplicador;
    return custo.toFixed(2); // Retorna como string formatada
}

🧩 Possíveis Extensões Futuras
Cálculo com base em CEP (via API externa).

Inclusão de seguros e taxas adicionais.

Interface gráfica interativa em HTML/CSS.

Suporte a mais tipos de entrega.
