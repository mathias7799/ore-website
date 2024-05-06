const rpcUrl = 'https://cosmopolitan-virulent-panorama.solana-mainnet.quiknode.pro/839eb60d0ce6042b6468cfb12af7ff6a751d0138/';

// Function to make fetch requests
async function fetchData(url, requestData) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };
  
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Return null on error
    }
  }
  
  // Function to get token supply
  async function getTokenSupply(pubkey, commitment = 'finalized') {
    const requestData = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenSupply',
      params: [
        pubkey,
        { commitment: commitment }
      ]
    };
    const responseData = await fetchData(rpcUrl, requestData);
    return responseData ? responseData.result.value.uiAmountString : '0.00';
  }
  
  // Function to get token balance
  async function getTokenBalance(accountPubkey, tokenGetAccountPubkey, commitment = 'finalized') {
    const requestData = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        accountPubkey,
        { "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
        { commitment: "processed", encoding: "jsonParsed" }
      ]
    };
    const responseData = await fetchData(rpcUrl, requestData);
    if (!responseData || !responseData.result.value.length) {
      console.warn('Account does not have a token account for the provided token');
      return '0.00';
    }
    const tokenAccount = responseData.result.value[0];
    return tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || '0.00';
  }
  
  // Main execution
  const tokenProgramPubkey = 'oreoN2tQbHXVaZsr3pf66A48miqcBXCDJozganhEJgz';
  const accountPubkey = 'FTap9fv2GPpWGqrLj3o4c9nHH7p36ih7NbSWHnrkQYqa';
  
  Promise.all([
    getTokenSupply(tokenProgramPubkey),
    getTokenBalance(accountPubkey, tokenProgramPubkey)
  ])
  .then(([totalSupply, tokenBalance]) => {
    const circulatingSupply = (parseFloat(totalSupply) - parseFloat(tokenBalance)).toFixed(2);
    const totalsupply = (parseFloat(totalSupply)).toFixed(2);
    document.getElementById('total-supply').textContent = totalsupply;
    document.getElementById('circulating-supply').textContent = circulatingSupply;
  })
  .catch(error => {
    console.error('Error:', error);
  });
   