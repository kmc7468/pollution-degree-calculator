<svelte:head>
  <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="/assets/css/baguetteBox.min.css">
  <link rel="stylesheet" href="/assets/css/vanilla-zoom.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,600,600i&amp;display=swap">

  <script src="/assets/bootstrap/js/bootstrap.min.js" defer></script>
  <script src="/assets/js/baguetteBox.min.js" defer></script>
  <script src="/assets/js/vanilla-zoom.js" defer></script>
  <script src="/assets/js/theme.js" defer></script>
</svelte:head>

<script lang="ts">
  /** @type {import("./$types").PageData} */
  export let data;
</script>

<nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar">
<div class="container">
  <a class="navbar-brand logo" href="/">분리수거 101</a>
  <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
    <span class="visually-hidden">Toggle navigation</span>
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navcol-1">
    <ul class="navbar-nav ms-auto">
      <li class="nav-item"><a class="nav-link active" href="/">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
      <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
    </ul>
  </div>
</div>
</nav>

<main class="page">
  <section class="clean-block clean-hero" style="background-image:url(&quot;/assets/img/tech/image4.jpg&quot;);color:rgba(9, 162, 255, 0.85);">
    <div class="text">
      <h2>누이 좋고, 매부 좋고.</h2>
      <p>깨끗한 쓰레기를 버릴 때마다 포인트를 드려요.<br>여러분과 지구를 위해, 저희 분리수거 101 팀이 도울게요.</p>
      {#if data.isLogin}
        <p>이미 로그인 하셨네요!</p>
        <a class="btn btn-outline-light btn-lg" href="/mypage">마이 페이지로 이동하기</a>
      {/if}
      {#if !data.isLogin}
        <p>로그인 후 환경 보호에 동참해 보세요.</p>
        <a class="btn btn-outline-light btn-lg" href="/login">로그인</a>
      {/if}
      <!-- <button class="btn btn-outline-light btn-lg" type="button"></button> -->
    </div>
  </section>
</main>

<footer class="page-footer dark">
<div class="footer-copyright">
  <p>© 2024 Copyright StartUp101-B-01</p>
</div>
</footer>
