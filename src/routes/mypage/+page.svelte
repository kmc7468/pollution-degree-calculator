<svelte:head>
  <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="/assets/css/baguetteBox.min.css">
  <link rel="stylesheet" href="/assets/css/vanilla-zoom.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,600,600i&amp;display=swap">

  <script src="/assets/bootstrap/js/bootstrap.min.js" defer></script>
  <script src="/assets/js/baguetteBox.min.js" defer></script>
  <script src="/assets/js/vanilla-zoom.js" defer></script>
  <script src="/assets/js/theme.js" defer></script>
  <script src="/assets/js/list.js" defer></script>
</svelte:head>

<nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar">
  <div class="container"><a class="navbar-brand logo" href="#">분리수거101</a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navcol-1">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
      </ul>
    </div>
  </div>
</nav>

<main class="page">
  <section class="clean-block clean-cart dark">
    <div class="container">
      <div class="block-heading">
        <h2 class="text-info">MyPage</h2>
        <p>분리수거 기록 및 포인트 기록</p>
      </div>
      <div class="content">
        <div class="row g-0">
          <div class="col-md-12 col-lg-8">
            <div id="tlists" class="items">
              <div class="product">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-3">
                    <div class="product-image"><img class="img-fluid d-block mx-auto image" src="/assets/img/tech/image2.jpg"></div>
                  </div>
                  <div class="col-md-5 product-info"><a class="product-name" href="#">Lorem Ipsum dolor</a>
                    <div class="product-specs">
                      <div><span>Display:&nbsp;</span><span class="value">5 inch</span></div>
                      <div><span>RAM:&nbsp;</span><span class="value">4GB</span></div>
                      <div><span>Memory:&nbsp;</span><span class="value">32GB</span></div>
                    </div>
                  </div>
                  <div class="col-6 col-md-2 price"><span>$120</span></div>
                </div>
              </div>
              <div class="product">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-3">
                    <div class="product-image"><img class="img-fluid d-block mx-auto image" src="/assets/img/tech/image2.jpg"></div>
                  </div>
                  <div class="col-md-5 product-info"><a class="product-name" href="#">Lorem Ipsum dolor</a>
                    <div class="product-specs">
                      <div><span>Display:&nbsp;</span><span class="value">5 inch</span></div>
                      <div><span>RAM:&nbsp;</span><span class="value">4GB</span></div>
                      <div><span>Memory:&nbsp;</span><span class="value">32GB</span></div>
                    </div>
                  </div>
                  <div class="col-6 col-md-2 price"><span>$120</span></div>
                </div>
              </div>
              <div class="product">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-3">
                    <div class="product-image"><img class="img-fluid d-block mx-auto image" src="/assets/img/tech/image2.jpg"></div>
                  </div>
                  <div class="col-md-5 product-info"><a class="product-name" href="#">Lorem Ipsum dolor</a>
                    <div class="product-specs">
                      <div><span>Display:&nbsp;</span><span class="value">5 inch</span></div>
                      <div><span>RAM:&nbsp;</span><span class="value">4GB</span></div>
                      <div><span>Memory:&nbsp;</span><span class="value">32GB</span></div>
                    </div>
                  </div>
                  <div class="col-6 col-md-2 price"><span>$120</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-4">
            <div class="bg-body-tertiary summary">
              <h3>Summary</h3>
              <h4 class="border-primary-subtle" style="border-color: var(--bs-primary-border-subtle);"><span class="text">Subtotal</span><span class="price">$360</span></h4>
              <h4><span class="text">Discount</span><span class="price">$0</span></h4>
              <h4><span class="text">Shipping</span><span class="price">$0</span></h4>
              <h4><span class="text">Total</span><span class="price">$360</span></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="page-footer dark">
  <div class="footer-copyright">
    <p>© 2024 Copyright StartUp101-B-01</p>
  </div>
</footer>
