<template>
  <main class="container">
    <h1>
      hi devhub north
    </h1>
    <!-- Form -->
    {{ error }}
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="prompt">
      <button :aria-busy="status === 'pending'">
        Make a request
      </button>
    </form>
    <!-- App -->
    <MalleableComponent />
  </main>
</template>

<script setup lang="ts">
import '@picocss/pico'

const malleables = reactive({
  query: `
    query List {
      cards {
        name
        abilities {
          effect
          name
          type
        }
        evolveFrom
        category
        rarity
        energyType
        attacks {
          cost
          damage
          effect
        }
        description
      }
    }`,
  template: `
<ul>
  <li v-for="card in data?.data.cards">
    {{ card.name }}
  </li>
</ul>
`
})

const prompt = ref('')
const error = ref()
const status = ref<'pending' | 'error' | 'idle'>('idle')
async function handleSubmit () {
  status.value = 'pending'
  try {
    const result = await $fetch('/api/completion', {
      method: 'POST',
      body: {
        prompt: prompt.value,
        malleables
      }
    })
    Object.assign(malleables, result)
    console.log(({result}))
    status.value = 'idle'
  } catch (e) {
    error.value = e
    status.value = 'error'
  }
  prompt.value = ''
}

const MalleableComponent = defineComponent({
  async setup () {
    const query = toRef(malleables, 'query')

    const { data } = useFetch('https://api.tcgdex.net/v2/graphql', {
      method: 'POST',
      body: { query },
    })

    return () => h({
      template: malleables.template,
      data: () => ({ data: data.value })
    })

  }
})
</script>
