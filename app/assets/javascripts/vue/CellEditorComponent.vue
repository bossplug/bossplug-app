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
      <div class="cell-attribute"
      v-for="(attr,key) in getAttributes"
      :class="{'enabled': attr.value}"
      v-bind:data-attr="attr.key"
      v-bind:data-value="attr.value"
      @click="clickedAttribute"
      >

         {{attr.key}}

      </div>
    </div>
    <div class="cell-action-editor h4 hidden" v-for="(attr,key) in getActions">
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
      getActions(){
        var result = [];

        for (var key in this.cell.actions ) {
          result.push({key: key, value: this.cell.actions[key]})
        }
         return result;
      }
    },
    methods: {
      clickedAttribute(element) {
        var target = element.target;
        var attribute = target.getAttribute('data-attr')
        var value = !target.getAttribute('data-value')  //toggle

        this.$root.setCellAttribute(this.cell.cellId,attribute,value)
      }

    }
  }
</script>
