<template>

  <div>
    <WalletModal v-show="isModalOpen" />
<transition name="fade" mode="out-in">
    <section>
         <navbar />
        <div class="banner">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="banner-content">
                            <div class="content-top">
                                <img src="../assets/image/defi-dinos.png" class="img-fluid logo"/>
                                <img src="../assets/image/unique-dinosaur-nfts.png" class="img-fluid tag"/>
                            </div>
                            <div class="element">
                                <div class="element-image">
                                    <img src="@/assets/image/dinos.gif" alt="">
                                </div>
                                <div class="element-box align-self-center">
                                    <div class="element-box-inner">
                                        <div class="element-box-inner-header">
                                            <a href="#" @click.prevent="decrease()">-</a>
                                            <span> {{ dino }}</span>
                                            <a href="#" @click.prevent="increase()">+</a>
                                        </div>
                                        <button @click="mint" :disabled="minting">Mint!</button>
                                    </div>
                                   <p class="force-white">
                                    {{ totalSupply }}/4,999 MINTED<br />
                                    1 AVAX EACH
                                  </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</transition>
     <router-view/>
    <!-- Dino Modal -->
    <dino-modal />

  </div>

</template>

<script>
import DinoModal from './DinoModal.vue'
import Navbar from '../components/Navbar.vue'

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import WalletModal from '../components/WalletModal/index.vue'
import { shortenAddress } from '../utils'
import { ethers } from 'ethers'
import { connectors } from '../connectors'

export default {
  components: {
    Navbar,
    DinoModal,
    WalletModal
  },
  computed: mapState([
    'isModalOpen',
    'account',
    'wrongChainId',
    'totalSupply',
    'minting',
    'claim',
    'myDinos'
  ]),
  data () {
    return {
      dino: 1,
      headerFix: true
    }
  },
  mounted () {
    this.connectNetwork()
    this.connectWallet(connectors[0])
  },
  watch: {
    $route: {
      immediate: true,
      handler (to, from) {
        document.title = to.meta.title || 'DeFi Dinos'
      }
    }
  },
  methods: {
    ...mapActions(['connectWallet', 'connectNetwork']),
    ...mapMutations(['openWalletModal', 'setMinting', 'AddTransaction']),
    ...mapGetters(['useMintContract']),
    shortenAddress,
    calculateGasMargin (value) {
      return value
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
        .div(ethers.BigNumber.from(10000))
    },
    mint () {
      const contract = this.useMintContract()
      if (contract) {
        contract.estimateGas
          .mintNFT(this.dino, {
            value: ethers.utils.parseEther((this.dino * 1.5).toString())
          })
          .then((estimatedGas) => {
            contract
              .mintNFT(this.dino, {
                value: ethers.utils.parseEther((this.dino * 1.5).toString()),
                gasLimit: this.calculateGasMargin(estimatedGas)
              })
              .then((res) => {
                if (res.hash) {
                  this.AddTransaction({
                    hash: res.hash,
                    summery: `Minted ${this.dino} Dinos`
                  })
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
    increase () {
      if (this.dino < 5) {
        this.dino += 1
      }
    },
    decrease () {
      if (this.dino > 1) {
        this.dino -= 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/transitions/fade/fade';
  @import '../styles/transitions/fade/fade-in-down';
  @import '../styles/transitions/fade/fade-in-right';
  @import '../styles/transitions/fade/fade-in-up';
  @import '../styles/transitions/fade/fade-in-left';

  p.force-white {
    color: #fff!important;
    text-shadow: 0px 3px 1px #000!important;
  }

  .element-image img {
    border: 10px solid #FFFFFF;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 20px;
  }

  .banner {
    background-image: url('../assets/image/bg.svg');
    background-position: inherit!important;
  }

  .banner .content-top {
    padding-top:50px;
  }

  body {
    background-size:cover
  }

  .banner-content {
    padding-bottom:0;
    justify-content: space-evenly!important
  }

  /*
  .header-top {
    position: fixed;
    top: 0;
    width:100%;
    z-index: 999;
  } */

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
