<template>
  <div>
    <WalletModal v-show="isModalOpen" />
    <navbar />
    <section class="roadmap">
      <div class="container">
        <h2>MINT ROADMAP / $GB Deflation</h2>
        <div class="roadmap-items">
          <div class="roadmap-item">
            <div class="progress">
              25%
            </div>
            <div class="info">
              <h5>🔥 100 AVAX $GB Burn </h5>
              <p>100 AVAX will be used to buy and burn $GB</p>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="progress">
              50%
            </div>
            <div class="info">
              <h5>🔥 150 AVAX $GB Burn</h5>
              <p>100 AVAX will be used to buy and burn $GB</p>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="progress">
              75%
            </div>
            <div class="info">
              <h5>🎁 200 AVAX Giveaway</h5>
              <p>We’re giving 10 AVAX to 20 people!<br />🔐 Winners decided by smart contract<br />No purchase necessary. <a href="/sweepstakes.html">Official rules.</a></p>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="progress">
              100%
            </div>
            <div class="info">
              <h5>🛍 🔥️ Marketplace Release! </h5>
              <p>Minters get <span>3% </span> royalties on second-hand sales, <br> and <span>2% </span> is used to buy and burn $GB!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Rarity Index -->
    <section>
        <div class="index">
            <div class="container">
                <div class="index-header">
                    <h3>DINO POINTS INDEX</h3>
                    <p>
                       DeFi Dinos use a point-based system to determine tiers. The more points your Dino has, the closer they are to Legendary. There are 5 traits with a maximum of 5 points per trait, making the range of points 5 to 25.
                    </p>
                    <p>
                       There’s also a few totally unique Mythical Dinos mixed in. You'll know immediately if you get one.
                    </p>
                </div>
                <div class="row fix-card">
                    <div class="col-xl-4 col-lg-5 col-md-12 col-12">
                            <div class="card">
      <div class="card-img" @click="showModal()">
          <img src="@/assets/image/card-img.jpg" alt="">
      </div>
      <div class="card-content">
          <div class="card-content-header">
              <span>11</span>
              <h4 @click="showModal()">DeFi Dino #10817</h4>
          </div>
          <div class="tag-list">
              <div class="tag-list-item"> SKIN <span> 3 </span></div>
              <div class="tag-list-item"> Head <span> 3 </span></div>
              <div class="tag-list-item"> Eyes <span> 3 </span></div>
              <div class="tag-list-item"> Body <span> 3 </span></div>
              <div class="tag-list-item"> Mouth <span> 3 </span></div>
          </div>
      </div>
  </div>
                    </div>
                    <div class="col-xl-8 col-lg-7 col-md-12 col-12  align-self-center">
                        <div class="index-right-img">
                          <img src="@/assets/image/class-range.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
      <div class="container">
          <div class="index-header">
              <h3>FAQ</h3>
               <div class="faq-">
                  <h2>What can I do with my dino?</h2>
                  <p>Whatever you want! You have a non-exclusive license to use your Dino as you like. <br> Stream it, crop it, mod it, bop it -- just be nice to it, please.</p>

                  <h2>How much is each dino?</h2>
                  <p>While available, you can mint your own Dinos at 1 AVAX each.</p>

                  <h2>How many dinos can I buy?</h2>
                  <p>As many as you want! You are limited to minting 20 Dinos per transaction, though.</p>

                  <h2>How many traits are there?</h2>
                  <p>There’s over 100 available hand-drawn traits for each Dino.</p>

                  <h2>Do you offer marketplace royalties?</h2>
                  <p>Of course! 3% for minters and 2% for a $GB buy-and-burn.</p>

                  <h2>Are there plans for after the marketplace?</h2>
                  <p>Oh yeah. The future is the future, baby. Let's just say dinos will take over control of the marketplace.</p>

                  <h2>What’s the team’s favorite dinosaur?</h2>
                  <p>We're torn between T-Rexs and Sauropods. Pterodactyls are cool, too.</p>
               </div>
          </div>
      </div>
    </section>

    <!-- Dino Modal -->
    <dino-modal />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '../components/Navbar.vue'
import DinoModal from './DinoModal.vue'
import WalletModal from '../components/WalletModal/index.vue'
export default {
  computed: mapState([
    'isModalOpen',
    'account',
    'wrongChainId',
    'totalSupply',
    'minting'
  ]),
  components: {
    Navbar,
    DinoModal,
    WalletModal
  }
}
</script>

<style>

.faq__nav-item {
  display:none!important;
}

.faq-wrapper {
  max-width:100%!important;
}

.accordion__value {
  font-family: Arial;
    font-size: 18px;
    color: #fff!important;
}

.accordion__title {
  padding-bottom: 10px!important;
    padding-left: 0!important;
}

.accordion {
  border: 0px!important
}

.accordion__toggle-button::before, .accordion__toggle-button::after {
  background:#fff!important
}

.accordion__value {
  padding-left:0!important;
  line-height: 28px;
}

.faq {
  padding:0!important
}

.card {
  margin: 25px;
    margin-top: 0;
}

.card-content .tag-list-item {
  padding: 7px 6px;
}
.index-right-img img{
      position: relative;
    top: -18px;
}

.card-content-header h4 {
  font-size: 25px;
}

.fix-card {
  margin-left:-15px
}

.fix-card .col-xl-8 {
  padding-left:0
}

.faq- {
  font-family:'Helvetica'
}

.faq- h2 {
  font-size:38px;
  color:#fff;
  margin-top:50px;
}

.faq- h2:first-child {
    margin-top:10px
}

.faq- p {
  margin-top:17px;
  line-height: 41px;
}

</style>
