import mongoose from 'mongoose';

export async function waitForMongo(timeoutMs = 10000) {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    return true;
  }

  return new Promise((resolve) => {
    const started = Date.now();

    const check = () => {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        cleanup();
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        cleanup();
        resolve(false);
        return;
      }
      timer = setTimeout(check, 150);
    };

    const onConnected = () => {
      cleanup();
      resolve(true);
    };

    let timer;
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      mongoose.connection.off('connected', onConnected);
    };

    mongoose.connection.once('connected', onConnected);
    check();
  });
}
