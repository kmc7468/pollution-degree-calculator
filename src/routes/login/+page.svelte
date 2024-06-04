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
  import { phoneNumberRegex } from "$lib/patterns";

  /** @type {import("./$types").ActionData} */
  export let form;
</script>

<nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar">
<div class="container">
  <a class="navbar-brand logo" href="/">분리배출 101</a>
  <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
    <span class="visually-hidden">Toggle navigation</span>
    <span class="navbar-toggler-icon"></span>
  </button>
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
    <h2 class="text-info">로그인</h2>
    <p>포인트 적립 기록을 확인하려면 로그인이 필요해요.</p>
  </div>
  <form method="POST">
    <div class="mb-3">
      <label class="form-label" for="phoneNumber">휴대폰 번호</label>
      <input class="form-control item" type="tel" data-bs-theme="light"
             name="phoneNumber" value={form?.phoneNumber ?? ""}
             required pattern={phoneNumberRegex.source}>
    </div>
    <div class="mb-3">
      <label class="form-label" for="password">비밀번호</label>
      <input class="form-control" type="password" data-bs-theme="light"
             name="password" required minlength=4>
    </div>
    {#if form?.message}
      <div class="alert alert-danger" role="alert">{form.message}</div>
    {/if}
    <button class="btn btn-primary" type="submit">로그인</button>
  </form>
</div>
</section>
</main>

<footer class="page-footer dark">
<div class="footer-copyright">
  <p>© 2024 Copyright StartUp101-B-01</p>
</div>
</footer>
