<template>
<div class="launch-pad"   >
  <div class="label-wrapper"  >
    <div   :class="labelClasses" @click="clickedCell" @dblclick="activateCell" v-bind:data-cell-id="getCellId"  >

      {{ label }}
    </div>
  </div>
  <launch-pad

    v-for="cell in cells"

    :label="cell.label"
    :path="cell.path"
    :cellId="cell.cellId"
    :depth="depth + 1"
  >
  </launch-pad>
</div>
</template>




<script>
  export default {
    props: [ 'label', 'path', 'cellId',   'depth' ],
    data() {
      return {  }
    },
    name: 'launch-pad',
    computed: {

      labelClasses() {
        return {   }
      },

      getCellId() {
        return this.cellId;
      }
    },
    methods: {

      clickedCell() {

          this.$root.$emit('activate-audio-file', {label: this.label, path: this.path, cellId: this.cellId } )

      },
      activateCell() {

          this.$root.$emit('activate-audio-file', {label: this.label, path: this.path, cellId: this.cellId } )

      }
    }
  }
</script>
