


export default class LocalStorageHelper {
  constructor( ){

  }

  static async get(key)
  {
    try{
      return JSON.parse( window.localStorage.getItem(key) )
    }catch(e){console.error(e)}
  }
  static async set(key,value)
  {
    return window.localStorage.setItem(key,JSON.stringify(value))
  }



}
