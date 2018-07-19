define(function(require, exports, module) {

  exports.run = function() {

    var $certificateeditor = $('#certificateeditor');
    var editor = CKEDITOR.replace('certificateeditor', {
      toolbar: [
        { items: [ 'FontSize', 'Font','JustifyLeft', 'JustifyCenter', 'JustifyRight', 'TextColor', '-'] },
        // { items: [ 'Font', 'Bold', 'Italic', 'Underline', 'TextColor', '-'] }
      ],
      allowedContent: true,
      height: 150,
      font_names: '宋体;黑体;楷体;Times New Roman;'
    });
    var styleArr = [];
    var editParameterObj = JSON.parse($('.js-reEditData').val());
    var fontFamily = 'SimSun';
    var textAlign = '';
    var fontColor = {r: 39, g: 39, b: 39};
    var keyTagNum = $('.js-key-tag').length;
    var customNum = 1;
    var resultData = {};
    var imageAlias = {
      certificatePhoto: true,
      qrCode: true,
      stampIcon: true,
    };
    var $form = $('#template-step-four-form');
    console.log(editParameterObj)

    editor.on('change', (e) => {
      $certificateeditor.val(editor.getData());
      $('.js-checked-tag .checked-text').html(editor.getData());
      // 取出所有的style样式
      var reg = /(?<=(=")).*?(?=;")/g;
      styleArr = editor.getData().match(reg);
      if(styleArr) {
        for(var i = 0; i < styleArr.length; i++) {
          var styleItem = styleArr[i].split(':');
          if(styleItem[0] == 'font-family') {
            if(styleItem[1] == '黑体') {
              fontFamily = 'SimHei';
            }else if (styleItem[1] == '宋体') {
              fontFamily = 'SimSun';
            }else if (styleItem[1] == '楷体') {
              fontFamily = 'kaiTi';
            }else {
              fontFamily = styleItem[1];
            }
            $('.js-checked-tag').css('font-family', fontFamily);
            $('.js-checked-tag .checked-text >p >span').css('font-family', fontFamily);
          }
          if(styleItem[0] == 'color') {
            $('.js-checked-tag').css('color', styleItem[1]);
          }
          if(styleItem[0] == 'font-size') {
            $('.js-checked-tag').css('font-size', styleItem[1]);
          }
        }
      }
      var checkedWidth = $('.js-checked-tag').width();
      var checkedHeight = $('.js-checked-tag').height();
      var $checkedText = $('.js-checked-tag >.checked-text');
      var tagType = $('.js-checked-tag').attr('data-id');

      $('.cke_button__justifyleft').click(function() {
        $checkedText.css('text-align', 'left');
      })
      $('.cke_button__justifycenter').click(function() {
        $checkedText.css('text-align', 'center');
      })
      $('.cke_button__justifyright').click(function() {
        $checkedText.css('text-align', 'right');
      })

      if (tagType && tagType.length > 11) {
        tagType = tagType.slice(0, 11)
        var currentTextHtml = $('.js-checked-tag').find('.checked-text').html();
        if(tagType == 'customField') {
          $('.js-checked-tag')[0].currentData.textContent = currentTextHtml.replace(/<.*?>/ig,"");
        }
      }
    });

    editor.on('blur', () => {
      $certificateeditor.val(editor.getData());
    });

    // 转换RGB
    function colorRgb(color) {
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      var sColor = color.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = "#";
          for (var i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return ({r: sColorChange[0], g: sColorChange[1], b: sColorChange[2]});
      } else {
        return sColor;
      }
    };

    function changeClass(el, addClaaName, removeClassName) {
      $('.' + el).addClass(addClaaName).removeClass(removeClassName);
    };

    function appendTag(obj,ev) {
      if (!obj.el.hasClass(obj.addClassName)) {
        obj.el.addClass(obj.addClassName);
      }
      $('.js-drawing-board').append(
        '<div class="board-variable js-visible-tag"' +
        'data-id="'+ obj.dataId + '" data-tag="'+ obj.dataTag + '" data-select-tag="'+ obj.dataTag +'">' +
        '<div class="checked-text">' + obj.text + '</div></div>'
      );
      $('[data-tag="' + obj.dataTag + '"]').css('width', obj.outerWidth);

      if($('.no-clickable-tag').length == keyTagNum) {
        changeClass('js-btn-save', 'text-bg-green', 'text-bg-gray');
      }
      getData(obj);
      // 删除标签
      $('.js-delete-btn').click(function() {
        deleteTag(obj);
      })
    }

    function getData(obj) {
      var $currentEL = $('[data-select-tag=' + obj.dataTag + ']');
      var curEl = $('[data-select-tag=' + obj.dataTag + ']')[0];
      if ($('.js-drawing-board').hasClass('horizontal-drawing-board')) {
        var curElX = 201 - $currentEL.height() / 2;
      } else {
        var curElX = 301 - $currentEL.height() / 2;
      }
      curEl.basicWidth = $currentEL.width();
      curEl.basicHeight = $currentEL.height();
      curEl.currentData = {
        x: $('.js-drawing-board').width()/2 - $currentEL.width() / 2,
        y: curElX,
        status: 'unselected',
        targetWidth: curEl.basicWidth,
        targetHeight: curEl.basicHeight,
        fontSize: 14,
        fontName: 'SimSun',
        textContent: obj.cusContent || '',
        fieldText : obj.text,
        type: imageAlias[curEl.dataset.tag] ? 'image' : 'varchar',
        dataId : obj.dataId,
        color: {
          r: 39,
          g: 39,
          b: 39
        }
      }
    }

    a();
    b();
    var status = c(el, keys=['width', 'x']);
    d(status)

    addTag ({tagDetils, container, defaultStatus})
        setDefaultStatus();
        createTag();
        setTagDeatils();
        appendTag(container);




    function deleteTag(obj) {
      var $disabledTag = $('[data-id = ' + $('.js-checked-tag').attr('data-id') + ']');
      $('.js-checked-tag').remove();
      editor.setData('');
      $disabledTag.removeClass(obj.addClassName);
      changeClass('js-delete-btn', 'text-bg-gray', 'text-bg-red');
      if($('.no-clickable-tag').length != keyTagNum) {
        changeClass('js-btn-save', 'text-bg-gray', 'text-bg-green');
      }
    }

    $('.js-key-tag').click(function() {
      appendTag({
        el: $(this),
        dataId: $(this).attr('data-id'),
        dataTag: $(this).attr('data-tag'),
        text: $(this).children('.js-tag-text').text(),
        outerWidth: $(this).outerWidth(),
        addClassName: 'no-clickable-tag'
      },event)
    });

    // 自定义字段
    $('.js-apply-btn').click(function() {
      if(!$(this).hasClass('text-bg-gray')) {
        appendTag({
          el: $(this),
          dataId: 'customField' + customNum,
          dataTag: 'customField' + customNum,
          text: $('.js-custom-apply').val(),
          outerWidth: $(this).outerWidth(),
          cusContent: $('.js-custom-apply').val(),
        },event)
        customNum++;
        $('.js-custom-apply').val('');
        $(this).removeClass('text-bg-red').addClass('text-bg-gray');
      }
    });

    var moveHandle = {
      drag: () => {
        dragHandle();
      },
      scale: () => {
        scaleHandle();
      },
    }

    // 拖动
    function dragAction(ev) {
      $('.js-checked-tag').mousedown(function(ev) {
        $('.js-checked-tag').unbind('mousemove');
        var ev = ev || window.event;
        var scaleEl = $('.coor')[0];
        var currentEl = $(this)[0];
        var Elstatus = currentEl.currentData.status;
        Elstatus = 'drag';
        Elstatus = 'scale';
        var originalW = $(this).width(); // 获取拖拽前div的宽
        var originalH = $(this).height(); // 获取拖拽前div的高

        if (ev.target != scaleEl) {
          var originalX = ev.clientX - this.offsetLeft;
          var originalY = ev.clientY - this.offsetTop;
        }

        $('.js-checked-tag').mousemove(function(ev) {
          const currantHandle = moveHandle[Elstatus] || () => {
            console.error('move handle is unavaliable', Elstatus);
          };
          currantHandle();


          var ev = ev || window.event;
          var self = this;
          if (Elstatus == 'draged') {
            return;
          }
          var ElLeft = ev.clientX - originalX;
          var ElTop = ev.clientY - originalY;
          var maxX = 594 - currentEl.currentData.targetWidth / 2;
          var maxY = 840 - currentEl.currentData.targetHeight / 2;
          var moveXInterval = Math.min(Math.max(0 + currentEl.currentData.targetWidth / 2, ElLeft), maxX);
          var moveYInterval = Math.min(Math.max(0 + currentEl.currentData.targetHeight / 2, ElTop), maxY);
          window.self.moveXInterval = moveXInterval;
          window.self.moveYInterval = moveYInterval;
          $(self).css({'left': moveXInterval + 'px', 'top': moveYInterval + 'px', 'height': $(self).height()});
          Elstatus = 'draging';
        });

        $(document).on('mouseup', '.js-checked-tag', function() {
          if (Elstatus == 'draging') {
            Elstatus = 'draged';
            var self = $(this)[0];
            $('.js-checked-tag').unbind('mousemove');
            var result = {
              x: window.self.moveXInterval - originalW / 2,
              y: window.self.moveYInterval - originalH / 2,
            }
            self.currentData = self.currentData || {};
            for(var i in result) {
              self.currentData[i] = result[i];
            }
          }
        });
      });
    }

    // 缩放
    function scaleAction(targetEl, iconId) {
      var $DragIcon = $('.' + iconId);
      var $targetEl = $('.' + targetEl);
      $DragIcon.mousedown(function(ev) {
        var ev = ev || window.event;
        ev.preventDefault();
        ev.stopPropagation();
        $targetEl[0].currentData.status = 'scaling';
        window.targetPosition = {
          left: $targetEl.offset().left,
          top: $targetEl.offset().top - $(document).scrollTop(),
        }
        document.onmousemove = function(ev) {
          var ev = ev || window.event;
          var targetWidth = ev.clientX - targetPosition.left;
          var targetHeight = ev.clientY - targetPosition.top;
          $targetEl[0].style.width = targetWidth + 'px';
          $targetEl[0].style.height = targetHeight + 'px';
        }
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          $targetEl[0].currentData.targetWidth = $targetEl.width();
          $targetEl[0].currentData.targetHeight = $targetEl.height();
          $targetEl[0].currentData = $targetEl[0].currentData || {};
        }
      });
    }

    function tagCheckedAction(el) {
      changeClass('js-delete-btn', 'text-bg-red', 'text-bg-gray');
      var $this = $(el);
      if(!$this.hasClass('js-checked-tag')) {
        $this.addClass('js-checked-tag checked');
        $this.append('<div class="coor"></div>');
        editor.setData($this.children('.checked-text').html());
      }
      $this.siblings().removeClass('js-checked-tag checked');
      $this.siblings().children('.coor').remove();
    }

    $(document).on('click', '.js-visible-tag', function() {
      tagCheckedAction(this);
      dragAction();
      scaleAction('js-checked-tag', 'coor');
    })

    $(document).on('input propertychange', '.js-custom-apply', function() {
      var customArea = $(this).val();
      if(customArea != '') {
        changeClass('js-apply-btn', 'text-bg-red', 'text-bg-gray');
      }else {
        changeClass('js-apply-btn', 'text-bg-gray', 'text-bg-red');
      }
    });

    function saveAction() {
      $('.js-visible-tag').map(function(key, item) {
        resultData[item.dataset.tag] = item.currentData;
        if(item.style.fontFamily != '') {
          resultData[item.dataset.tag].fontName = item.style.fontFamily.trim();
        }
        if(item.style.fontSize) {
          resultData[item.dataset.tag].fontSize = item.style.fontSize.slice(0, -2);
        }
        if(item.style.color) {
          var styleColor = item.style.color.slice(4, -1).split(',');
          resultData[item.dataset.tag].color = {r: styleColor[0].trim(), g: styleColor[1].trim(), b: styleColor[2].trim()};
        }
      })
      console.log(resultData);
    }

    function sendRequest() {
      if($('.no-clickable-tag').length == keyTagNum) {
        $.post($form.data('url'), { configCoordinate: resultData }, (res) => {
          window.location.href = $form.data('goto');
        });
      } else {
        $(this).addClass('text-bg-gray').removeClass('text-bg-green');
      }
    }

    // 保存
    $('.js-btn-save').click(function() {
      saveAction();
      sendRequest();
    })

    function customTagRebound() {
      for(obj in editParameterObj) {
        if(editParameterObj[obj].textContent) {
          // 自定义数量在原有基础上递增
          if(obj.slice(0, 11) == 'customField') {
            customNum = Number(obj.slice(11)) + 1;
          }
          var textContentHtml = editParameterObj[obj].textContent.split(/\n/g);
          var customItem = editParameterObj[obj];
          var arrHtml = [];
          for(index in textContentHtml){
            if (textContentHtml[index] != '') {
              var arrItem = textContentHtml[index];
              arrHtml.push('<p>' + arrItem + '</p>');
            }
          }
          $('.js-drawing-board').append(
            '<div class="board-variable js-visible-tag"' + 'data-id="'+ customItem.dataId +
            '" data-tag="'+ obj + '" data-select-tag="' + obj +'"style="width:' + customItem.targetWidth + 'px;' +
            'height:' + customItem.targetHeight + 'px;left:' + (Number(customItem.targetWidth/2) + Number(customItem.x )) + 'px;' +
            'top:' + (Number(customItem.targetHeight/2) + Number(customItem.y )) + 'px;font-family:'+ customItem.fontName +';' +
            'font-size:'+ customItem.fontSize +'px;color:rgb('+ (customItem.color.r +','+ customItem.color.g+','+customItem.color.b) +');">' +
            '<div class="checked-text">' + arrHtml.join("") + '</div></div>'
          );
          var customEl = $('[data-select-tag='+ obj +']');
          customEl[0].basicWidth = customEl.width();
          customEl[0].basicHeight = customEl.height();
          customEl[0].currentData = customItem;
        }
      }
    }

    function commonTagRebound() {
      for(obj in editParameterObj) {
        var item = editParameterObj[obj];
        var dataId = item.dataId;
        var keyEl = $('[data-id='+ dataId +']');
        if(item.dataId) {
          keyEl.click();
        }
        var boardkeyEl = $('[data-select-tag='+ obj +']');
        boardkeyEl.css({'width':item.targetWidth + 'px','height':item.targetHeight + 'px',
          'left':(Number(item.targetWidth/2) + Number(item.x)) + 'px',
          'top':(Number(item.targetHeight/2) + Number(item.y)) + 'px',
          'font-family':item.fontName,'font-size': item.fontSize +'px',
          'color':'rgb(' + (item.color.r +','+ item.color.g+','+item.color.b) + ')'});
        // boardkeyEl.children('.checked-text').css('padding', item.padding + 'px');
        if (boardkeyEl[0]) {
          boardkeyEl[0].currentData = item;
        }
      }
    }

    // 保存后重新编辑页面信息
    function rebound() {
      customTagRebound();
      commonTagRebound();
    }
    rebound();
  };
});