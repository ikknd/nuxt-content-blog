<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash, joinURL } from 'ufo'

const route = useRoute()

const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug as string[] : [route.params.slug as string])
const path = computed(() => withLeadingSlash(joinURL('en', ...slug.value)))

const { data: page } = await useAsyncData(path.value, async () =>
  await queryCollection('content_en').path(path.value).first() as Collections['content_en'],
)

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const { profile } = useAppConfig()

const { copy } = useClipboard()

defineShortcuts({
  meta_o: {
    usingInput: true,
    handler: () => {
      copy(profile.email!)
      toast.success('Email copied to clipboard')
    },
  },
})
</script>

<template>
  <div v-if="page">
    <FolioMeta
      :page
      :is-writing="route.path.includes('/articles/')"
    />
    <ContentRenderer
      dir="ltr"
      :value="page"
    />
  </div>
</template>
