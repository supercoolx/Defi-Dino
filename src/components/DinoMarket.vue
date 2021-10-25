<template>
  <div class="row">
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
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState([
    'isModalOpen',
    'account',
    'wrongChainId',
    'totalSupply',
    'minting',
    'myDinos'
  ]),
  methods: {
    showModal (data) {
      this.$store.commit('SET_MODAL', true)
      this.$store.commit('SET_CURRENT_MODAL', data)
    }
  }
}
</script>

<style>
    .my-dino-margin {
        margin-left: -30px;
        margin-right: -30px;
    }

    .card {
      margin-bottom:50px!important
    }
</style>
