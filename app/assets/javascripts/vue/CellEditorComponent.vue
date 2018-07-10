<template>

<div class="card-content white-text row h12">


<div class="cell-editor" v-if="cell"   >

  <div class="col s4">


    <div class="title-container ">

      <input type="text" class="white-text" v-if="cell" v-model="cell.name" v-on:change="this.$root.setCellName"  ></input>
    </div>

  </div>
  <div class="col s1 h12">
  </div>
  <div class="col s4 h12">
    <div class="cell-attribute-editor h4">  
      <div class="cell-attribute" v-for="(attr,key) in getAttributes">
         {{attr.key}}  -- {{attr.value}}
      </div>
    </div>
    <div class="cell-action-editor h4" v-for="(attr,key) in getActions">
      {{attr.key}}  -- {{attr.value}}
    </div>
  </div>


</div>

<div class="absolute-top-right btn btn-control transparent hoverable icon icon-cancel clickable" v-on:click="this.$root.closeEditor"></div>
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
      getAttributes(){
        var result = [];

        for (var key in this.cell.attributes ) {
          result.push({key: key, value: this.cell.attributes[key]})
        }

         return result;
      },
      getAttributes(){
        var result = [];

        for (var key in this.cell.actions ) {
          result.push({key: key, value: this.cell.actions[key]})
        }
         return result;
      }
    },
    methods: {
    }
  }
</script>
