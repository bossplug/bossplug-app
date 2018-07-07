<template>
<div class="tree-menu">
  <div class="label-wrapper" @click="toggleChildren">
    <div :style="indent" :class="labelClasses">
      <i v-if="nodes" class="icon" :class="iconClasses"></i>
      {{ label }}
    </div>
  </div>
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
      return { showChildren: false }
    },
    name: 'tree-menu',
    computed: {
      iconClasses() {
        return {
          'icon-plus-squared': !this.showChildren,
          'icon-minus-squared': this.showChildren
        }
      },
      labelClasses() {
        return { 'has-children': this.nodes }
      },
      indent() {
        return { transform: `translate(${this.depth * 10}px)` }
      }
    },
    methods: {
      toggleChildren() {
        this.showChildren = !this.showChildren;
      }
    }
  }
</script>
