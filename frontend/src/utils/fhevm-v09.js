
import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

let instance = null;

export async function getInstance() {
    if (instance) return instance;

    await initSDK(); // loads TFHE WASM

    const config = {
        ...SepoliaConfig,
        network: window.ethereum,
    };

    instance = await createInstance(config);
    return instance;
}
