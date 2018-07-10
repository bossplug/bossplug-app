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
  <div class="col s6 h12">


    <div class="cell-attribute-editor h10" v-if="!addingAttribute">
      <div class="btn btn-small black-text " v-on:click="showAddAttribute">Add Attribute</div>

      <div class="h12 vertical-scroll">
          <div class="cell-attribute background-darksteel"
          v-for="(attr,key) in getActiveAttributes"
          :class="{'enabled': attr.value}"
          v-bind:data-name="attr.value.name"
          v-bind:data-value="attr.value.value"

          >
          <span class="clickable btn btn-xs grey icon icon-cancel"  @click="removeAttribute" v-bind:data-name="attr.value.name"   > </span>

            <span> {{attr.value.label}} </span>

            <input type="text" class="" :class="{'hidden':attr.value.type == 'valueless','attribute-value-input':attr.value.type != 'valueless'}"
            v-bind:data-name="attr.value.name"
            v-model="attr.value.value" v-on:change="setAttribute"> {{attr.value.units}} </input>

          </div>
        </div>
    </div>
    <div class="cell-attribute-select h10 vertical-scroll"  v-if="addingAttribute">


        <div class="cell-attribute"
        v-for="(attr,key) in getAvailableAttributes"
        v-bind:data-name="attr.value.name"
        v-bind:data-value="attr.value.value"
        @click="enableAttribute"
        >

         {{attr.value.label}}

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

        console.log('got attrs',this.cell.attributes)
        for (var key in this.cell.attributes ) {

          if(this.cell.attributes[key] && this.cell.attributes[key].enabled)
          {

            result.push({key: key, value: this.cell.attributes[key]})
          }
        }

         return result;
      },
      getAvailableAttributes(){
        var result = [];

        for (var key in this.cell.attributes ) {
          if(this.cell.attributes[key] && !this.cell.attributes[key].enabled)
          {

          result.push({key: key, value: this.cell.attributes[key]})
          }
        }

         return result;
      }
    },
    methods: {
      clickedAttribute(element) {
        var target = element.target;
        var name = target.getAttribute('data-name')
        var value = !target.getAttribute('data-value')  //toggle

        this.$root.setCellAttribute(this.cell.cellId,name,value)
      },

      removeAttribute(element) {
        var target = element.target;
        var name = target.getAttribute('data-name')

        this.$root.setCellAttribute(this.cell.cellId,name,null,false)
      },

      showAddAttribute(element)
      {
        console.log('uhhh')
        this.$root.toggleAddNewAttribute(true)
      },
      enableAttribute(element)
      {

        var target = element.target;
        var name = target.getAttribute('data-name')
        var value = target.getAttribute('data-value')  //toggle
          console.log('enable!!',name,value,this.cell.cellId)
        this.$root.setCellAttribute(this.cell.cellId,name,null,true)
        //this.$root.toggleAddNewAttribute(false)  //causes issues
      },

      setAttribute(element)
      {
        var target = element.target;
        var name = target.getAttribute('data-name')
        var value = target.value
          console.log('set!!',name,value,this.cell.cellId)
        this.$root.setCellAttribute(this.cell.cellId,name,value,true)
      }

    }
  }
</script>
