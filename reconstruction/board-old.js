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
      $('.cke_button__justifyleft').click(function() {
        $('.js-checked-tag >.checked-text').css('text-align', 'left');
      })
      $('.cke_button__justifycenter').click(function() {
        $('.js-checked-tag >.checked-text').css('text-align', 'center');
      })
      $('.cke_button__justifyright').click(function() {
        $('.js-checked-tag >.checked-text').css('text-align', 'right');
      })
      var tagType = $('.js-checked-tag').attr('data-id');
      if (tagType && tagType.length > 11) {
        tagType = tagType.slice(0, 11)
        if(tagType == 'customField') {
          $('.js-checked-tag')[0].currentData.textContent = $('.js-checked-tag').find('.checked-text').html().replace(/<.*?>/ig,"");
        }
      }
    });

    editor.on('blur', () => {
      $certificateeditor.val(editor.getData());
    });

    var imageAlias = {
      certificatePhoto: true,
      qrCode: true,
      stampIcon: true,
    };

    // 转换RGB
    function colorRgb(color){
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

    $('.js-key-tag').click(function() {
      if(!$(this).hasClass('no-clickable-tag')) {
        $(this).addClass('no-clickable-tag');
        $('.js-drawing-board').append(
          '<div class="board-variable js-visible-tag"' +
          'data-id="'+ $(this).attr('data-id') + '" data-tag="'+ $(this).attr('data-tag') + '" data-select-tag="'+ $(this).attr('data-tag') +'">' +
          '<div class="checked-text">' + $(this).children('.js-tag-text').text() +
          '</div></div>'
        );
        $('[data-tag="' + $(this).attr('data-tag') + '"]').css('width', $(this).outerWidth());
        var $currentEL = $('[data-select-tag=' + $(this).attr('data-tag') + ']');
        var curEl = $('[data-select-tag=' + $(this).attr('data-tag') + ']')[0];
        curEl.basicWidth = $currentEL.width();
        curEl.basicHeight = $currentEL.height();
        curEl.currentData = {
          x: $currentEL.parent().width()/2 - $currentEL.children('.checked-text').width() / 2,
          y: 301 - $currentEL.height() / 2,
          targetWidth: curEl.basicWidth,
          targetHeight: curEl.basicHeight,
          fontSize: 14,
          // padding: 10,
          fontName: 'SimSun',
          textContent: '',
          fieldText : $(this).children('.js-tag-text').text().trim(),
          type: imageAlias[curEl.dataset.tag] ? 'image' : 'varchar',
          dataId : $(this).attr('data-id'),
          color: {
            r: 39,
            g: 39,
            b: 39
          }
        }
      }
      if($('.no-clickable-tag').length == keyTagNum) {
        $('.js-btn-save').addClass('text-bg-green').removeClass('text-bg-gray');
      }
    })

    $(document).on('click', '.js-visible-tag', function() {
      $('.js-delete-btn').addClass('text-bg-red').removeClass('text-bg-gray');
      if(!$(this).hasClass('js-checked-tag')) {
        $(this).addClass('js-checked-tag checked');
        $(this).append('<div class="coor"></div>');
        editor.setData($(this).children('.checked-text').html());
      }
      $(this).siblings().removeClass('js-checked-tag checked');
      $(this).siblings().children('.coor').remove();
      DragScale('js-checked-tag', 'coor');
    })

    $(document).on('input propertychange', '.js-custom-apply', function() {
      var customArea = $(this).val();
      if(customArea != '') {
        $('.js-apply-btn').addClass('text-bg-red').removeClass('text-bg-gray');
      }else {
        $('.js-apply-btn').removeClass('text-bg-red').addClass('text-bg-gray');
      }
    });

    // 自定义文字应用
    $('.js-apply-btn').click(function() {
      if(!$(this).hasClass('text-bg-gray')) {
        $('.js-drawing-board').append(
          '<div class="board-variable js-visible-tag" data-id="customField-'+ customNum +'" data-select-tag="customField'+ customNum +'" data-tag="customField'+ customNum + '">' +
          '<div class="checked-text">' + $('.js-custom-apply').val() +
          '</div></div>'
        );
        $('.js-custom-apply').val('');
        $(this).removeClass('text-bg-red').addClass('text-bg-gray');
        var $currentCustomEL = $('[data-select-tag=customField' + customNum +']');
        var customEL = $('[data-select-tag=customField'+ customNum +']')[0];
        customEL.basicWidth = $currentCustomEL.width();
        customEL.basicHeight = $currentCustomEL.height();
        var defaultX = $currentCustomEL.parent().width()/2 - $currentCustomEL.children('.checked-text').width() / 2;
        var defaultY = $currentCustomEL.parent().height()/2 - $currentCustomEL.height() / 2;
        customEL.currentData = {
          x: isNaN(defaultX)?250:defaultX,
          y: isNaN(defaultY)?250:defaultY,
          targetWidth: customEL.basicWidth,
          targetHeight: customEL.basicHeight,
          fontSize: 14,
          // padding: 10,
          fontName: 'SimSun',
          textContent: $('.js-checked-tag').find('.checked-text').html(),
          fieldText : $currentCustomEL.text().trim(),
          type: 'varchar',
          dataId: 'customField-' + customNum,
          color: {
            r: 39,
            g: 39,
            b: 39
          }
        }
        customNum++;
      }
    })

    // 删除标签
    $('.js-delete-btn').click(function() {
      let $disabledTag = $('[data-id = ' + $('.js-checked-tag').attr('data-id') + ']');
      $('.js-checked-tag').remove();
       editor.setData('');
      $disabledTag.removeClass('no-clickable-tag');
      $(this).removeClass('text-bg-red').addClass('text-bg-gray');
      if($('.no-clickable-tag').length != keyTagNum) {
        $('.js-btn-save').removeClass('text-bg-green').addClass('text-bg-gray');
      }
    })

    // 拖动
    $(document).on('mousedown', '.js-checked-tag', function(ev) {
      $(document).off('mousemove');
      var ev = ev || event;
      var disX = ev.clientX - this.offsetLeft;
      var disY = ev.clientY - this.offsetTop;
      window.dragFlag = true;
      window.self = this;
      var self = this;
      $(document).on('mousemove', '.js-checked-tag', function(ev) {
        if (!window.dragFlag || window.scaleFlag) {
          return;
        }
        var ElLeft = ev.clientX - disX;
        var ElTop = ev.clientY - disY;
        var maxX = 594 - self.basicWidth / 2;
        var maxY = 840 - self.basicHeight / 2;
        var moveXInterval = Math.min(Math.max(0 + self.basicWidth / 2, ElLeft), maxX);
        var moveYInterval = Math.min(Math.max(0 + self.basicHeight / 2, ElTop), maxY);
        self.moveXInterval = moveXInterval;
        self.moveYInterval = moveYInterval;
        $(self).css({'left': moveXInterval + 'px', 'top': moveYInterval + 'px', 'height': $(self).height()});
      })

      $(document).on('mouseup', function() {
        if (window.dragFlag) {
          window.dragFlag = false;
          $(document).off('mousemove');
          var tagName = $('.js-checked-tag').attr('data-tag');
          var result = {
            x: window.self.moveXInterval - window.self.offsetWidth / 2,
            y: window.self.moveYInterval - window.self.offsetHeight / 2,
          }
          window.self.currentData = window.self.currentData || {};
          for(var i in result) {
            window.self.currentData[i] = result[i];
          }
        }
      })
    })

    // 缩放
    function DragScale(targetEl, iconId) {
      var $DragIcon = document.getElementsByClassName(iconId)[0];
      var $targetEl = $('.' + targetEl);
      $targetEl[0].style.transformOrigin = 'left top';
      $DragIcon.onmousedown = function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var disW = $targetEl[0].offsetWidth; // 获取拖拽前div的宽
        var disH = $targetEl[0].offsetHeight; // 获取拖拽前div的高
        if (!$targetEl[0].dataset.transform) {
          $targetEl[0].dataset.transform = window.getComputedStyle($targetEl[0]).transform;
        }
        var basic = {
          // padding: parseInt(window.getComputedStyle($targetEl.children('.checked-text')[0]).padding),
          // fontsize: window.getComputedStyle($targetEl[0]).fontSize,
          transform: $targetEl[0].dataset.transform,
        }
        window.scaleFlag = true;
        document.onmousemove = null;
        $targetEl[0].dataset.currentRatio = 1;
        var targetPosition = {
          left: $targetEl.offset().left,
          top: $targetEl.offset().top - $(document).scrollTop(),
        }
        document.onmousemove = function(ev) {
          if (!window.scaleFlag) {
            return;
          }
          var ev = ev || window.event;
          //拖拽时为了对宽和高限制一下范围，定义两个变量
          var targetWidth = ev.clientX - targetPosition.left;
          var targetHeight = ev.clientY - targetPosition.top;

          var ratioW = targetWidth / disW;
          var ratioH = targetHeight / disH;
          var currentRatio = Math.min(ratioW, ratioH);
          if (currentRatio <= 0.5) {
            currentRatio = 0.5;
          }
          // $targetEl[0].style.transform = basic.transform + 'scale(' + currentRatio + ')';
          $targetEl[0].dataset.currentRatio = currentRatio;
          $targetEl[0].style.width = targetWidth + 'px';
          $targetEl[0].style.height = targetHeight + 'px';
        }
        document.onmouseup = function() {
          if (!window.scaleFlag) {
            return;
          }
          window.scaleFlag = false;
          document.onmousemove = null;
          document.onmouseup = null;
          // var result = {
            // targetWidth: disW * $targetEl[0].dataset.currentRatio,
            // targetHeight: disH * $targetEl[0].dataset.currentRatio,
            // fontSize: Math.floor(parseInt(basic.fontsize) * $targetEl[0].dataset.currentRatio),
            // padding: Math.floor(basic.padding * $targetEl[0].dataset.currentRatio)
          // }
          // $targetEl[0].style.transform = basic.transform;
          // console.log('222',$targetEl,$targetEl.width())
          $targetEl[0].currentData.targetWidth = $targetEl.width();
          $targetEl[0].currentData.targetHeight = $targetEl.height();
          $targetEl[0].currentData = $targetEl[0].currentData || {};
          // $targetEl[0].style.fontSize = result.fontSize + 'px';
          // $targetEl.children('.checked-text')[0].style.padding = result.padding + 'px';
          // for(var i in result) {
          //   $targetEl[0].currentData[i] = result[i];
          // }
        }
      }
    }

    $form = $('#template-step-four-form');
    $('.js-btn-save').click(function() {
      var resultData = {};
      // console.log($('.js-checked-tag').find('.checked-text').html());
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
      if($('.no-clickable-tag').length == keyTagNum) {
        $.post($form.data('url'), { configCoordinate: resultData }, (res) => {
          window.location.href = $form.data('goto');
        });
      } else {
        $(this).addClass('text-bg-gray').removeClass('text-bg-green');
      }
    })

    // 保存后重新编辑页面信息
    function reEdit() {
      for(obj in editParameterObj) {
        if(editParameterObj[obj].textContent) {
          // 自定义数量在原有基础上递增
          if(obj.slice(0, 11) == 'customField') {
            customNum = Number(obj.slice(11)) + 1;
          }
          var textContentHtml = editParameterObj[obj].textContent.split(/\n/g);
          var arrHtml = [];
          for(index in textContentHtml){
            if (textContentHtml[index] != '') {
              var arrItem = textContentHtml[index];
              arrHtml.push('<p>' + arrItem + '</p>');
            }
          }
          var customItem = editParameterObj[obj];
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
    reEdit();
  };
});
