<template>
  <div class="tree-menu">
    <div class="cont" :style="indent" @click="toggleChildren()" >{{ label }}</div>
    <tree-menu
      v-if="showChildren"
      v-for="node in nodes"
      :nodes="node.nodes"
      :label="node.label"
      :depth="depth + 1"
    >
    </tree-menu>
  </div>
</template>
<script>
  export default {
    props: [ 'label', 'nodes', 'depth' ],
    data() {
      return { showChildren: true }
    },
    name: 'tree-menu',
    computed: {
      indent() {
        return { transform: `translate(${this.depth * 10}px)` }
      }
    },
    methods: {
      toggleChildren() {
        console.log('meep')
        this.showChildren = !this.showChildren;
      }
    }
  }
</script>
