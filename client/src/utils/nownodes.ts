// NOWNodes Configuration for Casper Network
export const NOWNODES_API_KEY = "7124d260-d51a-47f1-8bc0-ed8a97a64a3e";
export const NOWNODES_CASPER_RPC_URL = `https://cspr.nownodes.io/${NOWNODES_API_KEY}`;

export const fetchFromNOWNodes = async (method: string, params: any[] = []) => {
  try {
    const response = await fetch(NOWNODES_CASPER_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': NOWNODES_API_KEY
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      })
    });
    return await response.json();
  } catch (error) {
    console.error('NOWNodes API Error:', error);
    throw error;
  }
};
