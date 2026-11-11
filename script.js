/*
  jQuery 實作功能：
  1. click()：處理按鈕點擊
  2. slideToggle()：顯示／隱藏學習筆記
  3. $.getJSON()：透過 Ajax 讀取 JSON 檔案
*/
$(function () {
  // 功能一：切換亮色、深色主題
  let isLight = false;
  $('#theme-btn').on('click', function () {
    isLight = !isLight;
    $('body').attr('data-theme', isLight ? 'light' : 'dark');
    $('#theme-label').text(isLight ? '深色模式' : '亮色模式');
    $('#theme-icon').text(isLight ? '☾' : '☀');
    $(this).attr('aria-pressed', String(isLight));
    $(this).attr('aria-label', isLight ? '切換深色主題' : '切換亮色主題');
  });

  // 功能二：按一下按鈕，累加數字
  let count = 0;
  $('#count-btn').on('click', function () {
    count += 1;
    $('#click-count').text(count);
  });

  // 功能三：使用 jQuery 動畫展開／收合筆記
  $('#notes-btn').on('click', function () {
    const $panel = $('#learning-notes');
    const opening = !$panel.is(':visible');
    if (opening) $panel.removeAttr('hidden').hide();
    $panel.stop(true, true).slideToggle(260, function () {
      if (!opening) $panel.attr('hidden', true);
    });
    $(this).attr('aria-expanded', String(opening))
      .text(opening ? '收合學習筆記 ↑' : '顯示學習筆記 ↓');
  });

  // 功能四：Ajax 非同步讀取 projects.json，並生成卡片
  $('#load-btn').on('click', function () {
    const $btn = $(this);
    $btn.prop('disabled', true).text('資料載入中...');
    $('#load-status').text('正在透過 Ajax 讀取 projects.json');
    $('#ajax-results').empty();
    $.getJSON('projects.json')
      .done(function (data) {
        if (!data || !Array.isArray(data.projects)) throw new Error('JSON 格式不正確');
        data.projects.forEach(function (project) {
          const $item = $('<div>').addClass('ajax-item');
          $('<strong>').text(project.title).appendTo($item);
          $('<span>').text(project.category).appendTo($item);
          $('#ajax-results').append($item);
        });
        $('#load-status').text('讀取成功！已取得 ' + data.projects.length + ' 筆 JSON 資料。');
      })
      .fail(function () {
        const msg = location.protocol === 'file:'
          ? '讀取失敗：請上傳至 GitHub Pages 後操作，或使用本機伺服器開啟。'
          : '讀取失敗：請確認 projects.json 與 index.html 在同一個資料夾。';
        $('#load-status').text(msg);
      })
      .always(function () {
        $btn.prop('disabled', false).text('重新載入 JSON 資料 ↗');
      });
  });
});
