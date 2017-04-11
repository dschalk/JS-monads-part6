
var rep = new RegExp('<<>>', 'g');
var rep2 = new RegExp(',', 'g');

function MonadState2(g, state) {
  console.log('someone called with g and state', g, state);
  this.id = g;
  this.s = state;
  this.bnd = (func, ...args) => func(this.s, ...args);  
  this.ret = function (a) {
    return window[this.id] = new MonadState(this.id, a);
  };
};

taskMonad = new MonadState2( 'taskMonad', [] );

MonadState2.prototype.html = "";

MonadState2.prototype.run2 = function (str) {
  console.log('[o]o[o]o[o]o[o]o[o]o[o]o[o]o[o]o[o] In run2. str and typeof str are ', str, typeof str );
  if (typeof str === 'undefined' || str === "no file") {
    this.s = [];
    this.html = '';
    return;
  }
  var newAr = str.split('@').map(v => v.split(','));
  newAr.map(v => {
    v[0] = v[0].replace(rep, ',');
    v[1] = eval(v[1]);
  });
  this.s = newAr;
  console.log('In run >>>>>>>>>>>>>>>>>>>> this.s is', this.s );
  // "two",false,"alfred","jane","none"
  var arr = this.s.slice();
  console.log('In MonadState.run2. <o><o><o><o><o><o><o> this.s is', this.s );
  var nodeObject = [];
  var n = -1
  var showCheck, showUnCheck, showGreen, showLineThrough;
  arr.map(a => {
    n+=1
    showCheck = a[1] ? "none" : "inline"
    showUnCheck = a[1] ? "inline" : "none"
    showGreen = a[1] ? "green" : "yellow"
    showLineThrough = a[1] ? "line-through" : "none"
    console.log('In MonadState2.prototype.run2. a[1], showCheck, showUnCheck, showGreen, showLineThrough', a[1] === "checked", showCheck, showUnCheck, showGreen, showLineThrough);
    nodeObject.push(h('div#' + n +'.todo', [
      h('span.task3', { style: { color: showGreen, textDecoration: showLineThrough } }, 'Task: ' + a[0]),
      h('br'),
      h('input#cbx',  { props: { type: 'checkbox', checked: a[1] }}), 
      h('label.tao4', { for: 'cbx', style: {display: showUnCheck}}, 'The task is completed' ),
      h('label.tao4', { for: 'cbx', style: {display: showCheck}}, 'The task is not completed' ),
      h('br'),
      h('span.tao', 'Author: ' + a[2] + ' / ' + 'Responsibility: ' + a[3]),
      h('br'),
      h('button#edit1', {props: {innerHTML: 'edit'}}),
      h('input#edit2', { props: { type:'textarea', value: a[0] }, style: { display: a[4] } }),
      h('button#delete', 'delete'),
      h('br'),
      h('button#chbox1', {style: {display: showUnCheck}}, 'change to not completed'),
      h('button#chbox2', {style: {display: showCheck}}, 'change to completed'),
      h('hr')   
    ])) 
  });  
  taskMonad.html = nodeObject;
};





