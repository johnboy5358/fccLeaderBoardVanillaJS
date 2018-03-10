(function(){

  // "use strict"
  var tableWrapper = document.getElementById('table-wrapper')
   
  var topUsers = getTopUsers('https://fcctop100.herokuapp.com/api/fccusers/top/')

  // get data from api.
  var recentPromAry = topUsers('recent')
  var allTimePromAry = topUsers('alltime')

  // display initial 'recent' data
  aryPromiseToHtmlString(recentPromAry)

  // listen for 'recent' button click events.
  document.getElementById('recent').addEventListener('click', function(e){
    e.target.parentElement.parentElement.className = 'recent'
    aryPromiseToHtmlString(recentPromAry)
  })

  // listen for 'alltime' button click events.
  document.getElementById('alltime').addEventListener('click', function(e){
    e.target.parentElement.parentElement.className = 'alltime'
    aryPromiseToHtmlString(allTimePromAry)
  })

  // Functions...

  var transformAryToHtmlString = pipe(
    map(tableRowTemplate),
    join('')
  )

  function aryPromiseToHtmlString (prom) {
    prom.then(ary => {
      document.getElementById('table-wrapper').innerHTML = transformAryToHtmlString(ary)
    })
    .catch(
      function(reason){
        errorMsg(reason)
      }      
    )
  }

  // getTopUsers : String -> String -> Promise
  function getTopUsers(baseUrl){
    return function (type){
      return fetch(baseUrl+type).then(function(response){ return response.json()})
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

  window.onerror = function(msg, url, lineNo, columnNo, error) {
    errorMsg(msg)
  };

  function errorMsg(msg) {
    console.log("An error occurred! : ", msg)
    tableWrapper.innerHTML = '<tr><td class="err-msg">' + msg + '</td></tr>'
  }
}())
