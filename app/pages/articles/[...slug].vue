<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { withLeadingSlash, joinURL } from 'ufo'

const route = useRoute()

const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug as string[] : [route.params.slug as string])
const path = computed(() => withLeadingSlash(joinURL('articles', ...slug.value)))

const { data: page } = await useAsyncData(path.value, async () =>
  await queryCollection('articles').path(path.value).first() as Collections['articles'],
)

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const { copy } = useClipboard()

function copyArticleLink() {
  copy(`${window.location.origin}${route.fullPath}`)
  toast.success('Article link copied to clipboard')
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      copy(`${window.location.origin}${route.fullPath}`)
      toast.success('Article link copied to clipboard')
    },
  },
})

defineOgImage({
  url: page.value.image,
})
</script>

<template>
  <div v-if="page">
    <FolioMeta
      :page
      :is-writing="route.path.includes('/articles/')"
    />
    <NuxtLink
      to="/writing"
      class="mx-auto my-8 flex cursor-pointer items-center gap-2 px-4 text-muted hover:text-primary transition-colors duration-200 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
    >
      <UIcon
        name="lucide:arrow-left"
        class="size-4"
      />
      <span class="text-sm font-extralight">
        Writing
      </span>
    </NuxtLink>
    <article class="writing mx-auto px-4 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <h1>
        {{ page?.title }}
      </h1>
      <div class="info-section mt-1 flex flex-col gap-2 sm:flex-row sm:gap-4">
        <p>{{ page?.date }}</p>
        <p class="hidden sm:block">
          |
        </p>
        <p>{{ page?.readingTime }} mins to read</p>
        <p class="hidden sm:block">
          |
        </p>
        <UTooltip
          text="Copy link"
          :shortcuts="['⌘', 'K']"
        >
          <p
            class="flex cursor-pointer select-none items-center gap-1 transition-colors duration-200 hover:text-primary"
            @click="copyArticleLink"
          >
            Share article
          </p>
        </UTooltip>
      </div>
      <ContentRenderer
        v-if="page"
        dir="ltr"
        :value="page"
      />
    </article>
  </div>
</template>

<style scoped>
.info-section {
  font-weight: 200;
  color: #7d8084;
  text-decoration: none;
  text-align: left;
}
</style>
