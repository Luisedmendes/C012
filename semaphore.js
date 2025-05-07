const shared = new SharedArrayBuffer(4); 
const sem = new Int32Array(shared);

function acquire() {
  while (true) {
    if (Atomics.compareExchange(sem, 0, 0, 1) === 0) {
      return;
    }
  }
}

function release() {
  Atomics.store(sem, 0, 0);
}

export { sem, shared };
