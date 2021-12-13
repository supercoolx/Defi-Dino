<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="Wallet Modal" aria-describedby="Connect Your Wallet">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            {{ account ? 'Account' : 'Connect Wallet ' }}
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="closeWalletModal"
            aria-label="Close modal"
          >
            x
          </button>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body">
            <ul class="wallets" v-if="!account">
              <li
                v-for="(connector, index) in connectors"
                v-bind:key="index"
                @click="connectWallet(connector)"
              >
                {{ connector.name }}
                <img
                  class="walleticon"
                  :src="require(`../../assets/image/${connector.logo}`)"
                  alt="wallet icon"
                />
              </li>
            </ul>
            <ul class="wallets" v-if="account">
              <li>
                <span class="account_detail">
                  {{ shortenAddress(account) }}
                  <jazzicon
                    :address="account"
                    :diameter="26"
                    class="jazzicon"
                  />
                  <button @click="disconnectWallet" class="disconnect_button">
                    Disconnect
                  </button>
                </span>
              </li>
            </ul>
            <div v-if="account" class="transactions_container">
              <small v-if="!transactions.length < 0"
                >Your transactions will appear here...</small
              >
              <ul class="transactions">
                <li v-for="trx in transactions" v-bind:key="trx.hash">
                  <a
                    class="summery"
                    :href="getScanLink(trx.hash, 'transaction')"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ trx.summery }}
                    <img src="../../assets/image/rise-arrow.png" alt="icon" />
                  </a>
                  <div class="loader" v-if="!trx.receipt"></div>
                  <img
                    src="../../assets/image/check-circle.svg"
                    alt="check circle"
                    v-if="trx.receipt.status === 1"
                  />
                  <img
                    src="../../assets/image/x-circle.svg"
                    alt="check circle"
                    v-if="trx.receipt.status !== 1"
                  />
                </li>
              </ul>
            </div>
          </slot>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { connectors } from '../../connectors'
import { shortenAddress, getScanLink } from '../../utils'
import Jazzicon from 'vue-jazzicon'
export default {
  name: 'WalletModal',
  components: {
    [Jazzicon.name]: Jazzicon
  },
  computed: {
    ...mapState(['account', 'transactions'])
  },
  data () {
    return {
      connectors
    }
  },
  methods: {
    shortenAddress,
    getScanLink,
    ...mapActions(['connectWallet', 'disconnectWallet']),
    ...mapMutations(['closeWalletModal']),
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style>
 .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    padding: 18px;
}
</style>
