<template>
<div class="launch-pad"   >

    <div v-for="cell in cells"
      :label="cell.label" :path="cell.path"
      class="pad-config-cell background-darksteel drop-target text-center"
      :class="labelClasses"
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

      labelClasses() {  //cant get this working

        return { 'missing-files': (this.path == null && this.label)  }
      },

      getCellId() {
        return this.cellId;
      }
    },
    methods: {

      clickedCell() {
        console.log('meep',{label: this.label, path: this.path, cellId: this.cellId })
          this.$root.$emit('activate-audio-file', {label: this.label, path: this.path, cellId: this.cellId } )

      },
      activateCell() {

          this.$root.$emit('activate-audio-file', {label: this.label, path: this.path, cellId: this.cellId } )

      }
    }
  }
</script>
