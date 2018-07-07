<template>
<div class="launch-pad"   >

    <div v-for="cell in cells"
      :label="cell.label" :path="cell.path"
      class="pad-config-cell background-darksteel drop-target text-center"
      @click="clickedCell" @dblclick="activateCell"
      v-bind:data-cell-id="cell.cellId"  >
       {{ cell.label }}
    </div>


</div>
</template>




<script>
  export default {
    props: [ 'label', 'path', 'cells', 'cellId',   'depth' ],
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
