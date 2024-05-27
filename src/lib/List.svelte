<script lang="ts">
  import ListItem from "$lib/ListItem.svelte";

  interface Item {
    image: string;
    queryResult?: string;
  };
  let items: Item[] = [];

  export const addItem = (image: string) => {
    const item: Item = {
      image,
    };
    items = [item, ...items.slice(0, 4)]; // 5개만 표시

    fetch("/api/gpt", {
      method: "POST",
      body: image,
    }).then((response) => response.text()).then((queryResult) => {
      item.queryResult = queryResult;
      items = [...items];
    });
  };
</script>

<div>
  {#each items as { image, queryResult }}
    <ListItem imageSrc={image} queryResult={queryResult} />
  {/each}
</div>
