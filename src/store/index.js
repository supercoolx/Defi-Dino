import Vue from 'vue'
import Vuex from 'vuex'
import { ethers } from 'ethers'
import axios from 'axios'
import abi from '../constants/abi.json'
Vue.use(Vuex)
const ChainParams = {
  chainId: '0xa869',
  chainName: 'Avalanche FUJI C-Chain',
  nativeCurrency: {
    name: ' AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://cchain.explorer.avax-test.network']
}

const contractAddress = '0x0B40a3eC14F423Cf110277CF8298f158c245F15f'
const StorageId = 'transactions'

function shouldCheck (lastBlockNumber, tx) {
  if (!tx.hash || tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

const getRecentTransactions = () => {
  const trx = localStorage.getItem(StorageId)
  if (trx) return JSON.parse(localStorage.getItem(StorageId))
  return {}
}
export default new Vuex.Store({
  state: {
    URI: 'https://defidinos-nft.vercel.app/metadata/',
    FullMeta: 'https://nft.defidinos.com/metadata.json',
    moodal: 0,
    library: null,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    wrongChainId: null,
    isModalOpen: false,
    totalSupply: 0,
    minting: false,
    transactions: {},
    blockNumber: null,
    headerFix: true,
    myDinos: [],
    marketPlaceItems: [],
    myDinosQuery: 0,
    currentModal: null,
    sendingNFT: false,
    allNFT: []
  },
  mutations: {
    SET_MODAL (state, modal) {
      state.moodal = modal
    },
    SET_FILTER (state, data) {
      if (data.type === 'sort') {
        if (data.value === 'PRICE (LOW TO HIGH)') {
          state.marketPlaceItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        }
        if (data.value === 'PRICE (HIGH TO LOW)') {
          state.marketPlaceItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        }
        if (data.value === 'ID (LOW TO HIGH)') {
          state.marketPlaceItems.sort((a, b) => parseFloat(a.nftId) - parseFloat(b.nftId))
        }
        if (data.value === 'ID (HIGH TO LOW)') {
          state.marketPlaceItems.sort((a, b) => parseFloat(b.nftId) - parseFloat(a.nftId))
        }
      }
      if (data.type === 'trait') {
        const filterItems = state.marketPlaceItems.map(nft => {
          if (nft.attributes.find(({ task }) => task.value === data.value) !== undefined) {
            nft.show = 1
          } else {
            nft.show = 0
          }
          return nft
        })
        state.marketPlaceItems = filterItems
      }
    },
    SET_CURRENT_MODAL (state, data) {
      state.currentModal = state.myDinos[data]
    },
    SET_CURRENT_MODAL2 (state, data) {
      state.currentModal = state.marketPlaceItems[data]
    },
    setMinting (state, payload) {
      state.minting = payload
      if (payload === false) {
      }
    },
    setSendingNFT (state, payload) {
      state.sendingNFT = payload
    },
    openWalletModal (state) {
      state.isModalOpen = true
    },
    closeWalletModal (state) {
      state.isModalOpen = false
    },
    blockNumberCallback (state, { blockNumber, library }) {
      this.commit('updateTotalSupply', library)
      this.commit('checkAndFinalizeTransactions')
      if (typeof state.blockNumber !== 'number') {
        return (state.blockNumber = blockNumber)
      }
      state.blockNumber = Math.max(blockNumber, state.blockNumber)
    },
    updateTotalSupply (state, library) {
      const contract = new ethers.Contract(contractAddress, abi, library)
      contract.totalSupply().then((supply) => {
        state.totalSupply = supply.toString()
      })
    },
    getMarketPlaceItems (state) {
      const contract = new ethers.Contract(contractAddress, abi, state.signer)
      contract.getForSale().then(async (items) => {
        const marketItems = items.toString().split(',')
        marketItems.map(async (NFT) => {
          const price = await contract.Marketplace(NFT)
          const attributes = state.allNFT[NFT].attributes
          attributes.splice(0, 1)
          const points = attributes.map(bill => parseFloat(bill.points)).reduce((acc, bill) => bill + acc)
          const data = {
            nftId: NFT,
            price: price[1].toNumber(),
            points: points,
            attributes: attributes.map((task) => { return { task, id: Date.now().toString(36) + Math.random().toString(36).substring(2) } }),
            image: state.allNFT[NFT].image,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            name: state.allNFT[NFT].name
          }
          state.marketPlaceItems.push(data)
        })
      })
    },
    getAllNFT (state) {
      axios(state.FullMeta)
        .then(data => {
          state.allNFT = data.data
        })
    },
    getMyDinos (state) {
      const contract = new ethers.Contract(contractAddress, abi, state.signer)
      if (state.myDinosQuery === 0) {
        state.myDinosQuery = 1
        contract.tokensOfOwner(state.account).then((supply) => {
          contract.getForSale().then((sales) => {
            const myNFT = supply.toString().split(',')
            const myDinosItems = myNFT.map(nftId => {
              const attributes = state.allNFT[nftId].attributes
              attributes.splice(0, 1)
              const points = attributes.map(bill => parseFloat(bill.points)).reduce((acc, bill) => bill + acc)
              const forSale = sales.toString().indexOf(nftId)
              const metaData = {
                id: Date.now().toString(36) + Math.random().toString(36).substring(2),
                name: state.allNFT[nftId].name,
                nftId: nftId,
                image: state.allNFT[nftId].image,
                points: points,
                forSale: forSale,
                attributes: attributes.map((task) => { return { task, id: Date.now().toString(36) + Math.random().toString(36).substring(2) } })
              }
              return metaData
            })
            state.myDinos = myDinosItems
          })
        })
      }
    },
    AddTransaction (state, { hash, summery }) {
      const transactions = getRecentTransactions()
      transactions[hash] = {
        hash,
        summery
      }
      localStorage.setItem(StorageId, JSON.stringify(transactions))
      state.transactions = transactions
    },
    ClearTransactions (state) {
      localStorage.removeItem(StorageId)
      state.transactions = {}
    },
    checkedTransactions (state, { chainId, hash, blockNumber }) {
      const transactions = getRecentTransactions()
      const tx = transactions[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(
          blockNumber,
          tx.lastCheckedBlockNumber
        )
      }
      transactions[hash] = tx
      localStorage.setItem(StorageId, JSON.stringify(transactions))
      state.transactions = transactions
    },
    finalizeTransaction (state, { hash, receipt }) {
      const transactions = getRecentTransactions()
      const tx = transactions[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = new Date().getTime()
      transactions[hash] = tx
      localStorage.setItem(StorageId, JSON.stringify(transactions))
      state.transactions = transactions
    },
    checkAndFinalizeTransactions (state) {
      const { chainId, library, blockNumber, transactions } = state
      if (!chainId || !library || !blockNumber) return
      Object.keys(transactions)
        .filter((hash) => shouldCheck(blockNumber, transactions[hash]))
        .forEach((hash) => {
          library
            .getTransactionReceipt(hash)
            .then((receipt) => {
              if (receipt) {
                this.commit('finalizeTransaction', {
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex
                  }
                })
                Vue.$toast.open(transactions[hash]?.summery)
              } else {
                this.commit('checkedTransaction', {
                  chainId,
                  hash,
                  blockNumber
                })
              }
            })
            .catch((error) => {
              console.error(`failed to check transaction hash: ${hash}`, error)
            })
        })
    },
    getAllTransactions (state) {
      state.transactions = getRecentTransactions()
    }
  },
  actions: {
    async fetchAccountData ({ state }) {
      if (state.library) {
        state.signer = state.library.getSigner()
        state.chainId = await state.signer.getChainId()
        if (state.chainId !== 43113) {
          state.wrongChainId = true
          const lib = state.library
          const account = await state.signer.getAddress()
          await lib?.send('wallet_addEthereumChain', [ChainParams, account])
        } else {
          state.wrongChainId = false
        }
        if (!state.wrongChainId) {
          state.account = await state.signer.getAddress()
          this.commit('getMarketPlaceItems')
          this.commit('getMyDinos')
          this.commit('getAllNFT')
        }
      }
    },
    async handleChainChanged ({ state }) {
      if (state.provider) {
        state.library = new ethers.providers.Web3Provider(state.provider)
        this.dispatch('fetchAccountData')
      }
    },
    async handleDisconnect ({ state }) {
      state.library = null
      state.provider = null
      state.account = null
      state.signer = null
      state.chainId = null
      state.wrongChainId = null
    },
    async handleAccountsChanged ({ state }, accounts) {
      if (state.provider) {
        if (accounts.length > 0) {
          state.library = new ethers.providers.Web3Provider(state.provider)
          this.dispatch('fetchAccountData')
        } else {
          this.dispatch('handleDisconnect')
        }
      }
    },
    async connectWallet ({ state }, connector) {
      if (connector && connector.isInstalled() && !state.library) {
        const provider = await connector.connect()
        if (provider) {
          state.isModalOpen = false
          state.provider = provider
          state.library = new ethers.providers.Web3Provider(provider)
          this.dispatch('fetchAccountData')
          provider.on('chainChanged', () => this.dispatch('handleChainChanged'))
          provider.on('networkChanged', () =>
            this.dispatch('handleChainChanged')
          )
          provider.on('accountsChanged', (accounts) =>
            this.dispatch('handleAccountsChanged', accounts)
          )
          provider.on('disconnect', () => this.dispatch('handleDisconnect'))
        }
      }
    },
    async disconnectWallet ({ state }) {
      if (
        state.provider &&
        state.provider?.disconnect &&
        typeof state.provider?.disconnect === 'function'
      ) {
        state.provider.disconnect()
      }
      this.dispatch('handleDisconnect')
    },
    async connectNetwork ({ state, commit }) {
      commit('getAllTransactions')
      const library = new ethers.providers.JsonRpcProvider(
        'https://api.avax-test.network/ext/bc/C/rpc'
      )
      commit('updateTotalSupply', library)
      library
        .getBlockNumber()
        .then((blockNumber) =>
          commit('blockNumberCallback', { blockNumber, library })
        )
        .catch((error) =>
          console.error(
            `Failed to get block number for chainId: ${state.chainId}`,
            error
          )
        )
      library.on('block', (blockNumber) =>
        commit('blockNumberCallback', { blockNumber, library })
      )
    }
  },
  modules: {},
  getters: {
    useMintContract (state) {
      if (!state.signer) {
        return null
      }
      return new ethers.Contract(contractAddress, abi, state.signer)
    },
    getModal (state) {
      return state.moodal
    },
    getCurrentModal (state) {
      return state.currentModal
    },
    closeModal (state) {

    }
  }
})
