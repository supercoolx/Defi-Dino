<template>
    <div class="dino-modal" v-if="getCurrentDino!==null" :class="{ 'active' : showModal }">
        <div class="overlay"></div>
        <div class="modal-content">
            <div class="icon" @click="closeModal()"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg></div>
            <div class="dino-modal-content">
                <div class="card">
                    <div class="card-img">
                        <img alt="" :src="getCurrentDino.image">
                    </div>
                    <div class="card-content">
                        <div class="card-content-header">
                            <span>{{getCurrentDino.points}}</span>
                            <h4>{{getCurrentDino.name}}</h4>
                        </div>
                        <div class="tag-list">
                            <div class="tag-list-item" v-for="(attr) of getCurrentDino.attributes" :key="attr.id">
                                {{attr.task.trait_type}}  <span> {{attr.task.points}} </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dino-content">
                    <h2>Attributes</h2>
                    <table>
                        <tr v-for="(attrs) of getCurrentDino.attributes" :key="attrs.id">
                            <th>{{attrs.task.trait_type}}</th>
                            <td>{{attrs.task.value}}</td>
                        </tr>
                    </table>
                    <div class="rectangle"></div>
                   <div class="buy-market" v-if="market===true">
                      <h2>Buy This Dino</h2>
                      <div class="sell-footer">
                      <img src="../assets/image/avax.svg" class="avax-logo avax-price-alt" alt="">
                      <span class="avax-price avax-price-right">{{getCurrentDino.price}} AVAX</span>
                      <button class="highlight" @click="buyDino(getCurrentDino.nftId,getCurrentDino.price)">BUY DINO</button>
                    </div>
                   </div>
                   <div class="send-market" v-if="market===false">
                    <div class="sell-dino">
                        <h2>Sell your dino</h2>
                       <div class="quantity">
                            <input type="number" v-model="marketPrice" placeholder="1">
                            <label for="">AVAX</label>
                       </div>
                        <button class="highlight" v-if="getCurrentDino.forSale===-1" @click="marketPlace(getCurrentDino.nftId)">List for sale</button>
                        <button class="highlight" v-if="getCurrentDino.forSale!==-1" @click="marketPlace(getCurrentDino.nftId)">Update Price</button>
                        <button class="highlight cancel-btn" v-if="getCurrentDino.forSale!==-1" @click="updateMarketCancel(getCurrentDino.nftId)">Cancel</button>
                    </div>
                    <div class="sell-dino transfer-wallet">
                        <h2> Transfer to wallet </h2>
                        <div class="quantity">
                            <input type="text" v-model="transferWalet" placeholder="0x0000...31337">
                            <button class="highlight" @click="sendNFT(getCurrentDino.nftId)">send</button>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { shortenAddress } from '../utils'
import { ethers } from 'ethers'

export default {
  props: ['market'],
  data () {
    return {
      transferWalet: null,
      marketPrice: 1
    }
  },
  methods: {
    ...mapActions(['connectWallet', 'connectNetwork']),
    ...mapMutations(['openWalletModal', 'setSendingNFT', 'AddTransaction']),
    ...mapGetters(['useMintContract']),
    shortenAddress,
    calculateGasMargin (value) {
      return value
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
        .div(ethers.BigNumber.from(10000))
    },
    closeModal () {
      this.$store.commit('SET_MODAL', false)
    },
    updateMarketCancel (tokenId) {
      const contract = this.useMintContract()
      if (contract) {
        contract.estimateGas
          .cancelListing(tokenId, {})
          .then((estimatedGas) => {
            contract
              .cancelListing(tokenId, {
                gasLimit: this.calculateGasMargin(estimatedGas)
              })
              .then((res) => {
                if (res.hash) {
                  this.dino = 1
                  this.setSendingNFT(false)
                  this.$toast.open('Canceled!')
                }
              })
              .catch((error) => {
                this.setSendingNFT(false)
                console.error(error)
              })
          })
          .catch((error) => {
            this.setSendingNFT(false)
            this.$toast.error(error.message)
            console.error(error)
          })
      } else {
        this.$toast.error('Please Connect Your Wallet')
      }
    },
    marketPlace (tokenId) {
      const contract = this.useMintContract()
      if (contract) {
        contract.estimateGas
          .setListing(tokenId, this.marketPrice, {})
          .then((estimatedGas) => {
            contract
              .setListing(tokenId, this.marketPrice, {
                gasLimit: this.calculateGasMargin(estimatedGas)
              })
              .then((res) => {
                if (res.hash) {
                  this.dino = 1
                  this.setSendingNFT(false)
                  this.$toast.open('On sale now!')
                }
              })
              .catch((error) => {
                this.setSendingNFT(false)
                console.error(error)
              })
          })
          .catch((error) => {
            this.setSendingNFT(false)
            this.$toast.error(error.message)
            console.error(error)
          })
      } else {
        this.$toast.error('Please Connect Your Wallet')
      }
    },
    buyDino (tokenId, price) {
      const contract = this.useMintContract()
      if (contract) {
        contract.estimateGas
          .buyListing(tokenId, {
            value: ethers.utils.parseEther((price).toString())
          })
          .then((estimatedGas) => {
            contract
              .buyListing(tokenId, {
                value: ethers.utils.parseEther((price).toString()),
                gasLimit: this.calculateGasMargin(estimatedGas)
              })
              .then((res) => {
                if (res.hash) {
                  this.dino = 1
                  this.setMinting(false)
                  this.$toast.open('Transaction Confirmed !!')
                }
              })
              .catch((error) => {
                this.setMinting(false)
                console.error(error)
              })
          })
          .catch((error) => {
            this.setMinting(false)
            this.$toast.error(error.message)
            console.error(error)
          })
      } else {
        this.$toast.error('Please Connect Your Wallet')
      }
    },
    sendNFT (tokenId) {
      const contract = this.useMintContract()
      if (this.transferWalet === null) { return false }
      if (this.transferWalet.substring(0, 2) !== '0x' && this.transferWalet.length !== 42) {
        this.$toast.error('Please enter a valid wallet!')
        return false
      }
      if (contract) {
        contract.estimateGas
          .transferFrom(this.account, this.transferWalet, tokenId, {})
          .then((estimatedGas) => {
            contract
              .transferFrom(this.account, this.transferWalet, tokenId, {
                gasLimit: this.calculateGasMargin(estimatedGas)
              })
              .then((res) => {
                if (res.hash) {
                  this.dino = 1
                  this.setSendingNFT(false)
                  this.$toast.open('Transaction Confirmed !!')
                }
              })
              .catch((error) => {
                this.setSendingNFT(false)
                console.error(error)
              })
          })
          .catch((error) => {
            this.setSendingNFT(false)
            this.$toast.error(error.message)
            console.error(error)
          })
      } else {
        this.$toast.error('Please Connect Your Wallet')
      }
    }
  },
  computed: {
    ...mapState([
      'isModalOpen',
      'account',
      'wrongChainId',
      'totalSupply',
      'minting',
      'claim',
      'myDinos',
      'marketPlaceItems'
    ]),
    showModal () {
      return this.$store.getters.getModal
    },
    getCurrentDino () {
      return this.$store.getters.getCurrentModal
    },
    getCurrentDino2 () {
      return this.$store.getters.getCurrentModal
    }
  }
}
</script>

<style>

.avax-price-alt {
  vertical-align: middle!important;
}

.avax-price-right {
  margin-right:20px!important
}

.buy-market .sell-footer {
  padding-left:15px;
}

.buy-market h2 {
  margin-bottom:20px!important;
  margin-top:20px!important;
}

.dino-modal {
    z-index: 99999;
    }
.card {
    border: 5px solid #000000;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    max-width:363px;
    margin-left:0!important
}

.dino-content {
    width:100%;
    padding:10px;
}

.cancel-btn {
    background:#D0410A!important
}

.modal-content {
        padding: 30px 30px;
}

.rectangle {
    height:6px;
    width:100%;
    background:#000;
    margin-top:30px;
}

.quantity {
    margin-top:17px!important;
}

.dino-modal-content .card {
    margin-bottom:0!important
}

.v-toast {
    z-index: 99999!important;
}

</style>
