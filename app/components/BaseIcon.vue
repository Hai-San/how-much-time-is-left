<script setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const icons = import.meta.glob('~/assets/icons/*.svg');

const cache = new Map();

const icon = computed(() => {
  if (cache.has(props.name)) {
    return cache.get(props.name);
  }

  const path = `/assets/icons/${props.name}.svg`;
  const loader = icons[path];

  if (!loader) {
    console.warn(`Icon "${props.name}" not found`);
    return null;
  }

  const component = defineAsyncComponent(loader);

  cache.set(props.name, component);

  return component;
});
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :font-controlled="false"
  />
</template>
