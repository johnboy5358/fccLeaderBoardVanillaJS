(function(){

  // "use strict"
  var tableWrapper = document.getElementById('table-wrapper')
  try {

    // decoupled and curried helper functions.
    // const map = fn => coll => Array.prototype.map.call(coll, fn)
    function map(fn) {
      return function (coll) {
        return Array.prototype.map.call(coll, fn);
      };
    }

    // const join = init => data => Array.prototype.join.call(data, init)
    function join(init) {
      return function (data) {
        return Array.prototype.join.call(data, init);
      };
    }

    // const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
    function pipe() {
      for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
      }

      return function (x) {
        return fns.reduce(function (v, f) {
          return f(v);
        }, x);
      };
    }

    function getTopUsers(baseUrl){
      return async function (type){
        return await fetch(baseUrl+type).then(function(response){ return response.json()})
     }
    }

    // fn :: template constructs each user table row.
    function tableRowTemplate(user, i){
      var url = `http://www.freecodecamp.org/${user.username}`
      return (`
        <tr>
          <td class="rank">${i+1}</td>
          <td class="username">
            <a href="${url}" target="_blank"><img class="avatar" src="${user.img}" />${user.username}</a>
          </td>
          <td class="recent">${user.recent}</td>
          <td class="alltime">${user.alltime}</td>
        </tr>`)
    }

    function makeBtnClickEvt(targ, listen, dataString) {

      var listener = document.querySelector(listen)
      
      listener.addEventListener('click', function(e){
        listener.parentElement.parentElement.className = listen.slice(1)
        targ.innerHTML = dataString
      })

    }
  
    (async function () {

      var transformAryToHtmlString = pipe(
        map(tableRowTemplate),
        join('')
      )

      // get data from api.
      var recentData = await getTopUsers('https://fcctop100.herokuapp.com/api/fccusers/top/')('recent')
      var allTimeData = await getTopUsers('https://fcctop100.herokuapp.com/api/fccusers/top/')('alltime')

      // Initialise table.
      tableWrapper.innerHTML = transformAryToHtmlString(recentData)

      // make click events.
      makeBtnClickEvt(tableWrapper, '#recent', transformAryToHtmlString(recentData))
      makeBtnClickEvt(tableWrapper, '#alltime', transformAryToHtmlString(allTimeData))   
      

    }())
  }

  catch(err) {
    tableWrapper.innerHTML = `<tr class="error"><td>Opps! Something went wrong: ${err.message}.</td></tr>`
    console.log(err.message)
  }

}())
