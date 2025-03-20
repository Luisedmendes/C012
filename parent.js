import { Worker } from 'worker_threads'


const cars = [
  { name: 'Carro 1', speed: 10, fuel: 50 },
  { name: 'Carro 2', speed: 8, fuel: 60 },
  { name: 'Carro 3', speed: 12, fuel: 45 }
];

const workers = cars.map(car => {
  const worker = new Worker('./worker.js', {workerData: {...car, x: Math.random()}});
  
  worker.on('message', msg => {
      console.log(`[${msg.name}] Distância: ${msg.distance}m | Combustível: ${msg.fuelLevel?.toFixed(2) || 'Acabou'}`);
      if (msg.status) console.log(`🚨 ${msg.name} está ${msg.status}`);
  });

  return worker;
});