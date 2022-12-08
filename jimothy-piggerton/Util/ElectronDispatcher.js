if(!window.electronApi) {
  console.error("not connected to electron api")
  window.electronApi = {
    send: ()=>{},
    receieve: ()=>{},
  }
}
// function ElectronCall(func, ...args) {
//   window.electronApi.send(func, args);
// }