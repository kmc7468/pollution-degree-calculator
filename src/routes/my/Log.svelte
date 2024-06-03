<script lang="ts">
  export let image: string;
  export let title: string;
  export let point: number;
</script>

<div class="product">
<div class="row justify-content-center align-items-center">
  <div class="col-md-3">
    <div class="product-image"><img class="img-fluid d-block mx-auto image" src={image}></div>
  </div>
  <div class="col-md-5 product-info"><a class="product-name" href="#">{title}</a>
    <!-- <div class="product-specs">
      <div><span>Display:&nbsp;</span><span class="value">5 inch</span></div>
      <div><span>RAM:&nbsp;</span><span class="value">4GB</span></div>
      <div><span>Memory:&nbsp;</span><span class="value">32GB</span></div>
    </div> -->
  </div>
  <div class="col-6 col-md-2 price"><span>+{point} 포인트</span></div>
</div>
</div>
