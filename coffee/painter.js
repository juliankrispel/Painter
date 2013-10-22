// Generated by CoffeeScript 1.6.3
var Brush, Brush2, ImageSource, MovingBrushPainter, Painter, _ref, _ref1, _ref2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Brush = (function() {
  function Brush(w, h) {
    this.pos = new Mutable().setType(new RandomPosition().setRange(0, w, 0, h));
    this.pos.cycle.setRange(20, 100);
    this.bsize = new Mutable().setType(new RandomIntervalNumber().setRange(10, 20));
    this.bsize.cycle.setRange(20, 100);
    this.type = 'circle';
  }

  Brush.prototype.update = function() {
    this.pos.update();
    this.bsize.update();
    return this;
  };

  Brush.prototype.x = function() {
    return this.pos.valueOf().x | 0;
  };

  Brush.prototype.y = function() {
    return this.pos.valueOf().y | 0;
  };

  Brush.prototype.size = function() {
    return this.bsize.value.val | 0;
  };

  return Brush;

})();

Brush2 = (function() {
  function Brush2(w, h) {
    this.pos = new Mutable().setType(new RandomPosition().setRange(0, w, 0, h));
    this.pos.cymode = 'irregular';
    this.pos.upmode = 'discrete';
    this.pos.cycle.setRange(100, 200);
    this.delta = new Mutable().setType(new RandomPosition().setRange(-10, 10, -10, 10));
    this.delta.cymode = 'irregular';
    this.delta.upmode = 'linp';
    this.delta.cycle.setRange(10, 50);
    this.sizem = new Mutable().setType(new RandomIntervalNumber().setRange(2, 30));
    this.sizem.upmode = 'linp';
    this.sizem.cymode = 'irregular';
    this.sizem.cycle.setRange(20, 100);
    this.type = 'circle';
    this.update();
  }

  Brush2.prototype.update = function() {
    var D, S;
    this.pos.update();
    this.sizem.update();
    S = +this.sizem.value;
    this.delta.value.setRange(-S / 2, S / 2, -S / 2, S / 2);
    this.delta.update();
    D = this.delta.valueOf();
    this.pos.value.x.setValue(this.pos.value.x + D.x);
    this.pos.value.y.setValue(this.pos.value.y + D.y);
    return this.bsize = +this.sizem.value | 0;
  };

  Brush2.prototype.x = function() {
    return this.pos.valueOf().x | 0;
  };

  Brush2.prototype.y = function() {
    return this.pos.valueOf().y | 0;
  };

  Brush2.prototype.size = function() {
    return this.bsize;
  };

  return Brush2;

})();

ImageSource = (function(_super) {
  __extends(ImageSource, _super);

  function ImageSource() {
    this.getImageCount = __bind(this.getImageCount, this);
    this.setSize = __bind(this.setSize, this);
    _ref = ImageSource.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ImageSource.prototype.defaults = {
    width: 0,
    height: 0,
    images: []
  };

  ImageSource.prototype.setSize = function(width, height) {
    this.state.width = width;
    return this.state.height = height;
  };

  ImageSource.prototype.getImageCount = function() {
    return this.state.images.length;
  };

  ImageSource.prototype.getImage = function(index) {
    return this.state.images[index];
  };

  ImageSource.prototype.addImage = function(img) {
    return this.state.images.push(img);
  };

  return ImageSource;

})(Base);

Painter = (function(_super) {
  __extends(Painter, _super);

  function Painter() {
    _ref1 = Painter.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Painter.prototype.defaults = {
    imgSrc: null,
    brushCount: 6
  };

  Painter.prototype.init = function() {};

  Painter.prototype.paint = function(renderer, destination) {};

  Painter.prototype.update = function() {};

  Painter.prototype.setImageSource = function(image) {
    return this.state.imgSrc = image;
  };

  return Painter;

})(Base);

MovingBrushPainter = (function(_super) {
  __extends(MovingBrushPainter, _super);

  function MovingBrushPainter() {
    this.init = __bind(this.init, this);
    _ref2 = MovingBrushPainter.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  MovingBrushPainter.prototype.setBrushes = function(num) {
    this.state.brushCount = num;
    return this.init;
  };

  MovingBrushPainter.prototype.init = function() {
    var i, _results;
    this.PS = new PublishSubscriber();
    this.brushes = [];
    i = 0;
    _results = [];
    while (i <= this.state.brushCount) {
      this.brushes[i] = new Brush2(this.state.imgSrc.state.width, this.state.imgSrc.state.height);
      this.PS.makePublic(this.brushes[i].sizem.value, 'min', 'brushMinSize');
      this.PS.makePublic(this.brushes[i].sizem.value, 'max', 'brushMaxSize');
      _results.push(++i);
    }
    return _results;
  };

  MovingBrushPainter;

  MovingBrushPainter.prototype.paint = function(renderer, dest) {
    var i, imgCount, imgIndex, src, _results;
    imgIndex = 0;
    imgCount = this.state.imgSrc.getImageCount();
    i = 0;
    _results = [];
    while (i < this.state.brushCount) {
      src = this.state.imgSrc.getImage(imgIndex);
      renderer.renderBrush(this.brushes[i], src, dest);
      imgIndex++;
      if (imgIndex === imgCount) {
        imgIndex = 0;
      }
      _results.push(++i);
    }
    return _results;
  };

  MovingBrushPainter.prototype.update = function() {
    var br, _i, _len, _ref3;
    _ref3 = this.brushes;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      br = _ref3[_i];
      br.update();
    }
    return this;
  };

  return MovingBrushPainter;

})(Painter);