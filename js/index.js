window.onload = function(){
  var top = 0;
  var maxtop;
  container.addEventListener('mousewheel',function(e){
    top += e.deltaY*0.3;
    onscrolltopchange(top);
    e.preventDefault();
  },false);

  var onscrolltopchange = function(top){
    top = Math.max(0,top);
    top = Math.min(maxtop,top);
    scrollbar.style.top = top + 'px';
    chapters.style.top =  - chapters.offsetHeight*(top/container.offsetHeight) + 'px';
  };

  var prev = null;
  database.sort(function(a,b){
    return Number(a.title) - Number(b.title);
  });
  var setcomic = function(index){
    comic.scrollTop = 0;
    comic.innerHTML = '';
    setTimeout(function(){
      var img;
      database[index].contents.forEach(function(path){
	img = document.createElement('img');
	img.src = path;
	comic.appendChild(img);
      });
    },20);
  };

  var nextcomic = function(){
    localStorage.index = Number(localStorage.index) + 1;
    setcomic(localStorage.index);
  };

  document.addEventListener('keydown',function(e){
    if(e.keyCode == 74){
      nextcomic();
    }
  },false);

  var t1;
  window.onresize = function(){

    comic.style.left = (window.outerWidth - container.offsetWidth - comic.offsetWidth )/2 + container.offsetWidth + 'px';

    var step = 30;
    var ch = database.length*step;
    chapters.style.height = ch + 'px';
    var sh = container.offsetHeight * (container.offsetHeight/ch);
    scrollbar.style.height = sh + 'px';
    maxtop = container.offsetHeight - sh;

    var tp  = container.offsetHeight * (Number(localStorage.index)/database.length);
    top = tp;
    onscrolltopchange(tp);

    clearTimeout(t1);
    t1 = setTimeout(function(){
      chapters.innerHTML = '';
      database.map(function(data,i){
	var chapter = document.createElement('div');
	if(i == localStorage.index ){
	  chapter.className = 'chapter current';
	  prev = chapter;
	}else{
	  chapter.className = 'chapter';
	}
	chapter.innerHTML = database[i].title;
	chapter.style.top = i*step + 'px';
	chapter.setAttribute('index',i);
	chapters.appendChild(chapter);
      });
    },200);
  };
  window.onresize();

  if(localStorage.index){
    setcomic(localStorage.index);
  }

  chapters.addEventListener('click', function(e){
    var el = e.target;
    if( e.target == this ){
      return;
    }
    localStorage.index = el.getAttribute('index');

    var data = database[el.getAttribute('index')].contents;
    // var random = Math.floor( Math.random()*(data.length-1));
    document.body.style.backgroundImage = 'url(' + data[0] + ')';

    if(prev){
      prev.classList.remove('current');
    }
    el.classList.add('current');
    prev  =  el;

    setcomic( el.getAttribute('index') );
  },false);

  // var t2;
  // window.addEventListener('scroll',function(e){
  //   if( window.scrollY >= comic.offsetHeight - window.innerHeight){
  //     clearTimeout(t2);
  //     t2 = setTimeout(function(){
  //       localStorage.index = Number(localStorage.index) + 1;
  //       setcomic(localStorage.index);
  //     },10);
  //   }
  // },false);
};
