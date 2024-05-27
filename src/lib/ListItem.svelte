<script lang="ts">
  export let imageSrc = "";
  export let queryResult: string | undefined;
</script>

<div>
  <img src={imageSrc} width=640 height=360 />
  <p>{queryResult ?? "Loading..."}</p>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
