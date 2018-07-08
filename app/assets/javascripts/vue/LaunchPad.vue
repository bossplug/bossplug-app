<template>
<div class="launch-pad"   >

    <div v-for="cell in cells" class="pad-config-cell background-darksteel hoverable">
      <div class="drop-target text-center"
        v-if="cell.label"
        :class="{'missing-files': (cell.path == null && cell.label!='---'), 'preloaded': cell.preloaded }"
        @click="clickedCell" @dblclick="activateCell"
        v-bind:data-label="cell.label"
        v-bind:data-path="cell.path"
        v-bind:data-preloaded="cell.preloaded"
        v-bind:hash="cell.hash"
        v-bind:data-cell-id="cell.cellId" >

       {{ cell.label  }}
     </div>
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

      //these dont work for cells, can only access global data
      getCellLabel() {
        return this.label;
      },

      getCellId() {
        return this.cellId;
      }
    },
    methods: {

      clickedCell(element) {
        var target = element.target;
        var label = target.getAttribute('data-label')
        var path = target.getAttribute('data-path')
        var preloaded = target.getAttribute('data-preloaded')
        var hash = target.getAttribute('hash')
        var cellId = target.getAttribute('data-cell-id') //parse int ?

        console.log('clicked',{label: label, path: path, cellId: cellId })
        this.$root.$emit('activate-audio-file', {label: label, path: path, cellId: cellId, preloaded:preloaded, hash:hash} )

      },
      activateCell(element) {
        var target = element.target;
        var label = target.getAttribute('data-label')
        var path = target.getAttribute('data-path')
        var preloaded = target.getAttribute('data-preloaded')
        var hash = target.getAttribute('hash')
        var cellId = target.getAttribute('data-cell-id') //parse int ?

        console.log('dblclicked',{label: label, path: path, cellId: cellId })
        this.$root.$emit('activate-audio-file', {label: label, path: path, cellId: cellId, preloaded:preloaded, hash:hash } )

      }
    }
  }
</script>
