<template>
  <div>
    <div class="row" v-if="!market">
      <div class="col-md-4" v-for="(item,index) of myDinos" :key="`${item.id}`">
        <div class="card">
            <div class="card-img" @click="showModal(index)">
                <img :src="item.image" alt="">
            </div>
            <div class="card-content">
                <div class="card-content-header">
                    <span>{{item.points}}</span>
                    <h4 @click="showModal()">{{item.name}}</h4>
                </div>
                <div class="tag-list">
                    <div class="tag-list-item" v-for="(attr) of item.attributes" :key="attr.id">
                      {{attr.task.trait_type}}  <span> {{attr.task.points}} </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="market">
      <template v-for="(item,index) of marketPlaceItems">
      <div class="col-md-4" v-if="item.show===1||item.show===undefined" :key="`${item.id}`">
        <div class="card">
            <div class="card-img" @click="showModal2(index)">
                <img :src="item.image" alt="">
            </div>
            <div class="card-content">
                <div class="card-content-header">
                    <span>{{item.points}}</span>
                    <h4 @click="showModal2(index)">{{item.name}}</h4>
                </div>
                <div class="tag-list">
                    <div class="tag-list-item" v-for="(attr) of item.attributes" :key="attr.id">
                      {{attr.task.trait_type}}  <span> {{attr.task.points}} </span>
                    </div>
                </div>
                <div class="sell-footer">
                  <img src="../assets/image/avax.svg" class="avax-logo" alt="">
                  <span class="avax-price">{{item.price}} AVAX</span>
                </div>
            </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['market'],
  computed: mapState([
    'isModalOpen',
    'account',
    'wrongChainId',
    'totalSupply',
    'minting',
    'myDinos',
    'marketPlaceItems'
  ]),
  methods: {
    showModal (data) {
      this.$store.commit('SET_MODAL', true)
      this.$store.commit('SET_CURRENT_MODAL', data)
    },
    showModal2 (data) {
      this.$store.commit('SET_MODAL', true)
      this.$store.commit('SET_CURRENT_MODAL2', data)
    }
  }
}
</script>

<style>

    .avax-logo {
      height:41px!important;
      width:41px!important;
      display:inline-block;
      vertical-align: -webkit-baseline-middle;
    }

    .avax-price {
      font-size:20px;
      font-size:20px;
      margin-left:10px;
    }

    .sell-footer {
      margin-top:11px
    }

    .my-dino-margin {
        margin-left: -30px;
        margin-right: -30px;
    }

    .card {
      margin-bottom:50px!important
    }
</style>
