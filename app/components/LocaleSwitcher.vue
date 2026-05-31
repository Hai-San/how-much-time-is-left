<script setup>
const { locale, locales, setLocale } = useI18n()

const options = computed(() =>
  locales.value.map((l) => ({ value: l.code, label: l.name })),
)
</script>

<template>
  <BaseSelect
    :model-value="locale"
    :options="options"
    :aria-label="$t('app.title')"
    @update:model-value="setLocale"
  />
</template>
