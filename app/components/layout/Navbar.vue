<script lang="ts" setup>
defineProps({
  isText: {
    type: Boolean,
    default: false,
  },
})

const navigation = getNavigation('home') as Record<string, Navigation>

const route = useRoute()
</script>

<template>
  <div class="mx-auto my-2 flex w-full items-center justify-center">
    <header class="rounded-full">
      <SpotlightButton
        rounded
        transparent
        :animate="false"
        class="border border-white/10"
      >
        <nav class="z-10 flex h-[50px] justify-around gap-2 p-1 transition-all duration-300 ease-in-out sm:h-[45px] sm:hover:gap-4">
          <NuxtLink
            v-for="item in navigation"
            :id="item.name.toLowerCase()"
            :key="item.name"
            :aria-label="item.name + ' navigation link'"
            :class="[
              item.to === route.path
                ? 'border border-white/5 bg-zinc-900/10 shadow-2xl shadow-white/50 backdrop-blur-3xl text-shadow-sm text-[#06B6D4]'
                : 'text-muted',
            ]"
            :to="item.to"
            class="flex items-center rounded-full border border-transparent px-4 py-1 transition-all duration-300 ease-in-out hover:border-white/5 hover:bg-zinc-900/50 hover:backdrop-blur-3xl sm:px-6"
          >
            <span
              class="font-medium tracking-wide text-base select-none"
            >
              {{ item.name }}
            </span>
          </NuxtLink>
        </nav>
      </SpotlightButton>
    </header>
  </div>
</template>
