import { Worker } from 'worker_threads';
const pista = 
  [
    { tamanho: 100, dificuldade: 1 },
    { tamanho: 200, dificuldade: 2 },
    { tamanho: 100, dificuldade: 2 },
    { tamanho: 50, dificuldade: 3 },
    { tamanho: 300, dificuldade: 2 },
    { tamanho: 50, dificuldade: 2 },
    { tamanho: 10, dificuldade: 1 },
    { tamanho: 200, dificuldade: 2 },
    { tamanho: 500, dificuldade: 5 }
  ]
const cars = [
  { name: 'Carro 1', velocidade: 10, fuel: 100, pista },
  { name: 'Carro 2', velocidade: 8, fuel: 120, pista },
  { name: 'Carro 3', velocidade: 12, fuel: 90, pista }
];


const workers = [];
const tempos = [];

function checkWinner() {
  const vencedor = tempos.reduce((prev, current) => (prev.tempoTotal < current.tempoTotal ? prev : current));
  console.log(`O vencedor é: ${vencedor.name} com o tempo de ${vencedor.tempoTotal} unidades!`);
}

cars.forEach(car => {
  const worker = new Worker('./worker.js', { workerData: car });

  worker.on('message', msg => {
    console.log(`[${msg.name}] ${msg.message}`);
    if (msg.message.includes('concluiu a corrida') || msg.message.includes('ficou sem combustível e parou!')) {
      tempos.push({ name: msg.name, tempoTotal: msg.tempoTotal, parou: msg?.parou ?? false });
      if (tempos.length === cars.length) {
        checkWinner();
      } 
    }
  });

  workers.push(worker);
});

