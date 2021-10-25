<template>
  <div>
    <WalletModal v-show="isModalOpen" />
    <navbar />
    <section>
        <div class="index dinos market-section">
            <div class="container">
                <div class="index-header market-header">
                    <h3>Dino Market</h3>
                </div>
                <div class="col-md-12">
                  <div class="market-bg">
                  <div class="market-filters">
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'sortBy','sort')" :config="sortBy"></vue-dropdown>
                      </div>
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'Body','trait')" :config="Body"></vue-dropdown>
                      </div>
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'Head','trait')" :config="Head"></vue-dropdown>
                      </div>
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'Eyes','trait')" :config="Eyes"></vue-dropdown>
                      </div>
                  </div>
                  <div class="market-filters">
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'Color','trait')" :config="Color"></vue-dropdown>
                      </div>
                      <div class="market-filter">
                          <vue-dropdown @setSelectedOption="setNewSelectedOption($event,'Mouth','trait')" :config="Mouth"></vue-dropdown>
                      </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
                </div>
                <dino-card :market="true" />
            </div>
        </div>
    </section>

    <!-- Dino Modal -->
    <dino-modal :market="true" />
  </div>
</template>

<script>
import VueDropdown from 'vue-dynamic-dropdown'
import { mapState } from 'vuex'
import Navbar from '../components/Navbar.vue'
import DinoModal from './DinoModal.vue'
import DinoCard from '../components/DinoCard.vue'
import WalletModal from '../components/WalletModal/index.vue'
export default {
  computed: mapState([
    'isModalOpen',
    'account',
    'wrongChainId',
    'totalSupply',
    'minting'
  ]),
  components: { Navbar, DinoCard, DinoModal, WalletModal, VueDropdown },
  methods: {
    setNewSelectedOption (selectedOption, element, type) {
      this[element].placeholder = selectedOption.value
      this.$store.commit('SET_FILTER', { filter: 'sortBy', value: selectedOption.value, type: type })
    }
  },
  data: function () {
    return {
      sortBy: {
        options: [
          {
            value: 'PRICE (LOW TO HIGH)'
          },
          {
            value: 'PRICE (HIGH TO LOW)'
          },
          {
            value: 'ID (LOW TO HIGH)'
          },
          {
            value: 'ID (HIGH TO LOW)'
          }
        ],
        prefix: 'Sort By',
        backgroundColor: '#fff'
      },
      Body: {
        options: [
          {
            value: 'Plague Doctor'
          },
          {
            value: 'Jean Shirt'
          },
          {
            value: 'Pirate'
          },
          {
            value: 'Sweater'
          },
          {
            value: 'Turtleneck and Chain'
          },
          {
            value: 'Butcher'
          },
          {
            value: 'Soccer Player'
          },
          {
            value: 'Red Jumpsuit'
          },
          {
            value: 'Sensei'
          },
          {
            value: 'Gown'
          },
          {
            value: 'Samurai Armor'
          },
          {
            value: 'Santa Suit'
          },
          {
            value: 'Scrubs'
          },
          {
            value: 'Naked'
          },
          {
            value: 'Jersey'
          },
          {
            value: 'Librarian'
          },
          {
            value: 'Lone Wolf'
          },
          {
            value: 'Vice'
          },
          {
            value: 'Devil Wings'
          },
          {
            value: 'Trees'
          },
          {
            value: 'Toga'
          },
          {
            value: 'Lumberjack'
          },
          {
            value: 'Angel Wings'
          },
          {
            value: 'Clown Suit'
          },
          {
            value: 'Fighter Pilot'
          },
          {
            value: 'Turtleneck'
          },
          {
            value: 'Sailor'
          },
          {
            value: 'Royal Mantle'
          },
          {
            value: 'Inner Tube'
          },
          {
            value: 'Suit and tie'
          },
          {
            value: 'Spartan Armor'
          },
          {
            value: 'Ninja Uniform'
          },
          {
            value: 'Tie Dye'
          },
          {
            value: 'Shark Costume'
          },
          {
            value: 'Astronaut Suit'
          },
          {
            value: 'Avalanche'
          },
          {
            value: 'Cave Man'
          },
          {
            value: 'Biker Jacket'
          }
        ],
        prefix: 'Body',
        backgroundColor: '#fff'
      },
      Head: {
        options: [
          {
            value: 'test'
          },
          {
            value: 'test'
          },
          {
            value: 'test'
          }
        ],
        prefix: 'Head',
        backgroundColor: '#fff'
      },
      Eyes: {
        options: [
          {
            value: 'test'
          },
          {
            value: 'test'
          },
          {
            value: 'test'
          }
        ],
        prefix: 'Eyes',
        backgroundColor: '#fff'
      },
      Color: {
        options: [
          {
            value: 'test'
          },
          {
            value: 'test'
          },
          {
            value: 'test'
          }
        ],
        prefix: 'Color',
        backgroundColor: '#fff'
      },
      Mouth: {
        options: [
          {
            value: 'test'
          },
          {
            value: 'test'
          },
          {
            value: 'test'
          }
        ],
        prefix: 'Mouth',
        backgroundColor: '#fff'
      }
    }
  }
}
</script>

<style>
.card-content .tag-list-item {
  padding:7px 5px
}

.market-header {
  margin-bottom:30px
}

.no-data {
  color:#fff;
  text-align: center;
  font-size: 30px;
  line-height: 60px;
}

html {
  min-height: 100% !important;
    height: 100%;
}

.market-filter {
  width:25%;
  float:left
}

.market-filters {
  display:block
}

.market-bg {
  background:#fff!important;
  padding:10px;
  border-radius: 20px;
  margin-bottom:32px;
}

.dropdown {
  border:5px solid #000!important;
  margin:10px!important;
  color:#FFA035!important;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 25px;
  border-radius: 5px!important;
}

.dropdown .text {
  font-family: "Dinosaur"!important;
  font-size:18px!important
}

.expand {
    position: absolute;
    z-index: 999;
    background: #fff;
    top: 50px;
    border: 6px solid #000!important;
    border-radius: 5px;
    display:none;
    height:auto!important
}

.option {
   font-family: "Dinosaur"!important;
   font-size:18px!important;
   padding:7px 15px!important;
   font-weight: inherit!important;
}

.expanded .text {
  color:#000!important
}

.expanded .expand {
  display:inline-block!important;
}

.market-section .card {
    max-width: none;
    margin: 0;
}

</style>
