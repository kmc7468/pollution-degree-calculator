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

<script lang="ts">
  import Log from "./Log.svelte";

  /** @type {import("./$types").PageData} */
  export let data;

  $: plus = data.pointLogs.filter((pointLog: any) => pointLog.deltaPoint > 0).reduce((acc: number, pointLog: any) => acc + pointLog.deltaPoint, 0);
  $: minus = -data.pointLogs.filter((pointLog: any) => pointLog.deltaPoint < 0).reduce((acc: number, pointLog: any) => acc + pointLog.deltaPoint, 0);
  $: total = plus - minus;
</script>

<nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar">
<div class="container">
  <a class="navbar-brand logo" href="#">분리수거 101</a>
  <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
    <span class="visually-hidden">Toggle navigation</span>
    <span class="navbar-toggler-icon"></span>
  </button>
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
    <h2 class="text-info">마이 페이지</h2>
    <p>포인트 적립 기록이 아래에 표시돼요.</p>
  </div>
  <div class="content">
  <div class="row g-0">
    <div class="col-md-12 col-lg-8">
    <div id="tlists" class="items">
      {#each data.pointLogs as pointLog}
        <Log image={pointLog.trash.image} title={pointLog.trash.name} point={pointLog.deltaPoint} />
      {/each}
      {#if data.pointLogs.length === 0}
        <p>포인트 적립 기록이 없어요.</p>
      {/if}
    </div>
    </div>
    <div class="col-md-12 col-lg-4">
      <div class="bg-body-tertiary summary">
        <h3>요약</h3>
        <h4 class="border-primary-subtle" style="border-color: var(--bs-primary-border-subtle);"><span class="text">적립</span><span class="price">{total} 포인트</span></h4>
        <h4><span class="text">사용</span><span class="price">{minus} 포인트</span></h4>
        <h4><span class="text">합계</span><span class="price">{total} 포인트</span></h4>
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
