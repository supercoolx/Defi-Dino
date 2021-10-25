import WalletConnectProvider from '@walletconnect/web3-provider'
export const connectors = [
  {
    name: 'MetaMask',
    logo: 'metamask.svg',
    connect: async () => {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        return window.ethereum
      }
      return null
    },
    isInstalled: () => window.ethereum && window.ethereum.isMetaMask
  },
  {
    name: 'Wallet Connect',
    logo: 'walletconnect.svg',
    isInstalled: () => true,
    connect: async () => {
      try {
        const provider = new WalletConnectProvider({
          infuraId: '85d1be5266da47abad7604e77b1159f4',
          qrcode: true,
          pollingInterval: 15000
        })
        await provider.enable()
        return provider
      } catch (error) {
        console.error(error)
        return null
      }
    }
  }
]
