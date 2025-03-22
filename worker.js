import { parentPort, workerData } from 'worker_threads';

const { name, velocidade, fuel, pista } = workerData;
let tempoTotal = 0; 
let combustivel = fuel;
const LIMITE_CRITICO = 0.2 * fuel; 
const TEMPO_PITSTOP = 5; 

function deveParar() {
  
  return Math.random() < 0.5;
}


function corrida() {
  
  for (let index = 0; index < pista.length; index++) {
    const { tamanho, dificuldade } = pista[index];

    
    const custoCombustivel = (velocidade / tamanho) * 50 * dificuldade;
    combustivel -= custoCombustivel;

    tempoTotal += 1; 
    if (combustivel <= LIMITE_CRITICO) {
      
      if (deveParar()) {
        
        tempoTotal += TEMPO_PITSTOP; 
        combustivel = fuel; 
        parentPort.postMessage({ name, message: `${name} foi ao pit stop!`, tempoTotal, combustivel });
      } else {
        
        parentPort.postMessage({ name, message: `${name} decidiu continuar sem parar!`, tempoTotal, combustivel });
      }
    } else {
      parentPort.postMessage({ name, message: `${name} está correndo na posição ${index} da pista`, tempoTotal, combustivel });
    }

    if (combustivel <= 0) {
      parentPort.postMessage({ name, message: `${name} ficou sem combustível e parou!`, tempoTotal: Number.MAX_SAFE_INTEGER });
      return; 
    }
  }

  
  parentPort.postMessage({ name, message: `${name} concluiu a corrida em ${tempoTotal} unidades de tempo`, tempoTotal });
}

corrida();
