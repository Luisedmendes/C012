import { parentPort, workerData } from 'worker_threads';

const { name, speed, fuel, x } = workerData;
let distance = 0;
let fuelLevel = fuel;
console.log(x)
function race() {
    if (fuelLevel > 0) {
        distance += speed;
        fuelLevel -= Math.random() * 2; 
        parentPort.postMessage({ name, distance, fuelLevel });
        setTimeout(race, 1000); 
    } else {
        parentPort.postMessage({ name, distance, status: 'Parado (Sem combustível)' });
    }
}

race();