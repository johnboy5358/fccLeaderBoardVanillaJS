!(function(){

  // "use strict"
  const tableWrapper = document.getElementById('table-wrapper')
  try {

    // decoupled and curried helper functions.
    // const map = fn => coll => Array.prototype.map.call(coll, fn)
    var map = function map(fn) {
      return function (coll) {
        return Array.prototype.map.call(coll, fn);
      };
    };

    // const join = init => data => Array.prototype.join.call(data, init)
    var join = function join(init) {
      return function (data) {
        return Array.prototype.join.call(data, init);
      };
    };

    // const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
    var pipe = function pipe() {
      for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
      }

      return function (x) {
        return fns.reduce(function (v, f) {
          return f(v);
        }, x);
      };
    };

    function getTopUsers(baseUrl){
      return async function (type){
        return await fetch(baseUrl+type).then(response => response.json())
     }
    }

    // fn :: template constructs each user table row.
    function tableRowTemplate(user, i){
      let url = `http://www.freecodecamp.org/${user.username}`
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

    const makeBtnClickEvt = (targ, listen, dataString) => {

      const listener = document.querySelector(listen)
      listener.addEventListener('click', function(e){
        listener.parentElement.parentElement.className = listen.slice(1)
        targ.innerHTML = dataString
      })

    }
  
    (async function () {

      const transformAryToHtmlString = pipe(
        map(tableRowTemplate),
        join('')
      )

      // get data from api.
      const recentData = await getTopUsers('https://fcctop100.herokuapp.com/api/fccusers/top/')('recent')
      const allTimeData = await getTopUsers('https://fcctop100.herokuapp.com/api/fccusers/top/')('alltime')

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
