<template>

<div class="card-content white-text row h12">


<div class="cell-editor" v-if="cell"   >

  <div class="col s4">


    <div class="title-container "> 

      <input type="text" class="white-text" v-if="cell" v-model="cell.name" v-on:change="setCellName"  ></input>
    </div>

  </div>
  <div class="col s1 h12">
  </div>
  <div class="col s4 h12">
    <div class="cell-attribute-editor h4">
      cell attr
    </div>
    <div class="cell-action-editor h4">
      cell action
    </div>
  </div>


</div>

<div class="absolute-top-right btn btn-control transparent hoverable icon icon-cancel clickable" v-on:click="closeEditor"></div>
</div>
</template>


<script>
  export default {
    props: [ 'cell','test' ],
    data() {
      return {  }
    },
    name: 'cell-editor',
    computed: {

    },
    methods: {

      clicked(element) {

      }
    }
  }
</script>
