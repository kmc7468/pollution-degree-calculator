<svelte:head>
  <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="/assets/css/baguetteBox.min.css">
  <link rel="stylesheet" href="/assets/css/vanilla-zoom.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,600,600i&amp;display=swap">

  <script src="/assets/bootstrap/js/bootstrap.min.js" defer></script>
  <script src="/assets/js/baguetteBox.min.js" defer></script>
  <script src="/assets/js/vanilla-zoom.js" defer></script>
  <script src="/assets/js/theme.js" defer></script>
  <script src="/assets/js/login.js" defer></script>
</svelte:head>

<nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar">
  <div class="container"><a class="navbar-brand logo" href="#">분리수거101</a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navcol-1">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
        <li class="nav-item"><a class="nav-link active" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
      </ul>
    </div>
  </div>
</nav>

<main class="page">
  <section class="clean-block clean-form dark">
    <div class="container">
      <div class="block-heading">
        <h2 class="text-info">Log In</h2>
        <p>서비스 사용기록 확인을 위해 로그인합니다.</p>
      </div>
      <form>
        <div class="mb-3"><label class="form-label" for="email">ID</label><input class="form-control item" type="email" id="idBox" data-bs-theme="light"></div>
        <div class="mb-3"><label class="form-label" for="password">Password</label><input class="form-control" type="password" id="password" data-bs-theme="light"></div>
        <div class="mb-3">
            <div class="form-check"><input class="form-check-input" type="checkbox" id="checkbox" data-bs-theme="light"><label class="form-check-label" for="checkbox">Remember me</label></div>
        </div><button class="btn btn-primary" id="loginBTN" type="submit">Log In</button>
      </form>
    </div>
  </section>
</main>

<footer class="page-footer dark">
  <div class="footer-copyright">
    <p>© 2024 Copyright StartUp101-B-01</p>
  </div>
</footer>
