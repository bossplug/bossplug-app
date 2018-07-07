<template>
<div class="tree-menu"   >
  <div class="label-wrapper" @click="toggleChildren"  >
    <div :style="indent" :class="labelClasses" v-on:mousedown="emitDragEvent" v-on:dblclick="emitActionEvent" v-bind:data-node-id="getNodeId"  >
      <i v-if="nodes" class="icon" :class="iconClasses"></i>
      {{ label }}
    </div>
  </div>
  <tree-menu
    v-if="showChildren"
    v-for="node in nodes"
    :nodes="node.nodes"
    :label="node.label"
    :path="node.path"
    :nodeId="node.nodeId"
    :depth="depth + 1"
  >
  </tree-menu>
</div>
</template>




<script>
  export default {
    props: [ 'label', 'path', 'nodeId', 'nodes', 'depth' ],
    data() {
      return { showChildren: this.depth == 0 }
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
        return { 'has-children': this.nodes, 'draggable-file': !this.nodes }
      },
      indent() {
        return { transform: `translate(${this.depth * 10}px)` }
      },
      getNodeId() {
        return this.nodeId;
      }
    },
    methods: {
      toggleChildren() {
        this.showChildren = !this.showChildren;
      },
      emitDragEvent() {
        if(!this.nodes)
        {
          this.$root.$emit('drag-audio-file', {label: this.label, path: this.path, nodeId: this.nodeId } )
        }
      },
      emitActionEvent() {
        if(!this.nodes)
        {
          this.$root.$emit('activate-audio-file', {label: this.label, path: this.path, nodeId: this.nodeId } )
        }
      }
    }
  }
</script>
