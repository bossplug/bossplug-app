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


    <div class="cell-attribute-editor h8" v-if="!addingAttribute">
      <div class="btn " v-on:click="showAddAttribute">Add Attribute</div>

      <div class="cell-attribute"
      v-for="(attr,key) in getActiveAttributes"
      :class="{'enabled': attr.value}"
      v-bind:data-attr="attr.key"
      v-bind:data-value="attr.value"
      @click="clickedAttribute"
      >

         {{attr.key}}

      </div>
    </div>
    <div class="cell-attribute-select h8"  v-if="addingAttribute">

      meeeppp
        <div class="cell-attribute"
        v-for="(attr,key) in getAvailableAttributes"
        :class="{'enabled': attr.value}"
        v-bind:data-attr="attr.key"
        v-bind:data-value="attr.value"
        @click="clickedAttribute"
        >

           {{attr.key}}

        </div>

    </div>
  </div>


</div>

<div class="absolute-top-right btn btn-control transparent hoverable icon icon-cancel clickable" v-on:click="this.$root.closeEditor"></div>
</div>
</template>


<script>
  export default {
    props: [ 'cell','adding-attribute'  ], //need snake case here 
    data() {
      return {  }
    },
    name: 'cell-editor',
    computed: {
      getActiveAttributes(){
        var result = [];

        for (var key in this.cell.attributes ) {
          if(this.cell.attributes[key].enabled)
          {
            result.push({key: key, value: this.cell.attributes[key]})
          }
        }

         return result;
      },
      getAvailableActions(){
        var result = [];

        for (var key in this.cell.attributes ) {
          result.push({key: key, value: this.cell.attributes[key]})
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
      },
      showAddAttribute(element)
      {

        this.$root.toggleAddNewAttribute(true)
      }

    }
  }
</script>
