import { parentPort, workerData } from "worker_threads";

const { name, velocidade, fuel, pista, sharedBuffer } = workerData;

let combustivel = fuel;
let tempoTotal = 0;

const TEMPO_PITSTOP = 3;
const LIMITE_CRITICO = 30;

const semaphore = new Int32Array(sharedBuffer);

function acquire() {
  while (true) {
    const acquired = Atomics.compareExchange(semaphore, 0, 0, 1);
    if (acquired === 0) {
      break; 
    }
    Atomics.wait(semaphore, 0, 1); 
  }
}

function release() {
  Atomics.store(semaphore, 0, 0); 
  Atomics.notify(semaphore, 0, 1);
}

function deveParar() {
  return combustivel <= LIMITE_CRITICO;
}

function corridaAsync(index = 0) {
  if (index >= pista.length) {
    parentPort.postMessage({
      name,
      message: `${name} concluiu a corrida em ${tempoTotal} unidades de tempo`,
      tempoTotal,
    });
    return;
  }

  const { tamanho, dificuldade } = pista[index];
  const custoCombustivel = (velocidade / tamanho) * 50 * dificuldade;
  combustivel -= custoCombustivel;
  tempoTotal += 1;

  if (combustivel <= LIMITE_CRITICO) {
    if (deveParar()) {
      parentPort.postMessage({ name, message: `${name} está aguardando pit stop...`, tempoTotal });

      acquire();
      parentPort.postMessage({ name, message: `${name} entrou no pit stop`, tempoTotal });

      setTimeout(() => {
        tempoTotal += TEMPO_PITSTOP;
        combustivel = fuel;

        release();
        parentPort.postMessage({ name, message: `${name} saiu do pit stop`, tempoTotal });

        setTimeout(() => corridaAsync(index + 1), 0);
      }, TEMPO_PITSTOP * 100);
      return;
    }
  }

  if (combustivel <= 0) {
    parentPort.postMessage({
      name,
      message: `${name} ficou sem combustível e parou!`,
      tempoTotal: Number.MAX_SAFE_INTEGER,
    });
    return;
  }

  parentPort.postMessage({
    name,
    message: `${name} está correndo na posição ${index} da pista`,
    tempoTotal,
    combustivel,
  });

  setTimeout(() => corridaAsync(index + 1), 50);
}

corridaAsync();
