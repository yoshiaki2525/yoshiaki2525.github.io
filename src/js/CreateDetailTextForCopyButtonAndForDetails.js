/**
 * 関数一覧
 *
 * INSERT_APPROPRIATE_TAGS - 詳細を適切なタグで囲む関数
 * REPLACE_BLANK_LINES_TO_BR_TAG - 引数で受け取ったテキスト内の連続する改行文字(空白行)ををbrタグに変換する関数
 * REPLACE_URL_WITHOUT_A_TAG_TO_LINK_WITH_A_TAG - テキスト内からURLを見つけてaタグで囲む関数
 * TRIGGER - コピーボタン用と詳細用の詳細テキスト作って出力する関数
 * TEXT_SELECT_FOR_COPY_BUTTON -コピーボタン用のテキストを全選択する関数
 * TEXT_SELECT - 詳細用のテキストを全選択する関数
 * CLEAR_TEXTAREA - ユーザーが詳細をコピペする入力フォームの値を削除する関数
 *
 *
 */

/**
 * 詳細を適切なタグで囲む関数
 *
 * param {String} - 店舗詳細テキスト
 *
 * return　HPの詳細用のタグが付いた店舗詳細テキスト
 */
function INSERT_APPROPRIATE_TAGS(textData) {
  const ContentEndTitleStartTags = "</span>\n<span class='detail_titel'>";
  //テキスト全体を詳細テキストBOXタグで囲む為にテキストの文頭にタグを付加
  textData = "<div class='detail_box'><span class='detail_titel'>" + textData;

  // すべての改行文字をbrタグに変換
  textData = textData.replace(/\r\n/g, '<br>');
  textData = textData.replace(/(\n|\r)/g, '<br>');

  // ２個以上連続する<br>をコンテンツ終了タイトル開始タグに変換。
  textData = textData.replace(/(<br>){2,}/g, '\n' + ContentEndTitleStartTags);

  //タイトタグとbrタグの最小にタイトル終了タグとコンテンツの開始タグを挿入する
  const TitleStartTag = "<span class='detail_titel'>";
  const brTag = '<br>';
  const Regexp_BetweenTitleStartBrTag = new RegExp(
    TitleStartTag + '(.*?)' + brTag,
    'g'
  );

  const Regexp_setAppropriateTags = function (all, titleText, br, href) {
    console.log(arguments);
    return (
      "<span class='detail_titel'>" +
      titleText +
      "</span>\n<span class='detail_text'>"
    );
  };

  textData = textData.replace(
    Regexp_BetweenTitleStartBrTag,
    Regexp_setAppropriateTags
  ); // マッチした部分だけ残すように置換

  //見た目を整える等の微調整
  //コード側から見やすくするために<br>の後に改行文字を入れる
  textData = textData.replace(/<br>/g, '<br>\n');

  //テキスト全体を詳細テキストBOXで囲む為にテキストの末尾にもタグを付加
  textData += '</div>';

  //予期せぬ実行等の微調整
  // たまに 〜</span><span class='detail_titel'></span><span class='detail_titel'>と何もない段落が出来てしまう場合があるのでそれを削除
  textData = textData.replace(
    /<\/span><span class='detail_titel'><\/span><span class='detail_titel'>/,
    ''
  );

  // タイトタグの直後にbrタグが来る場合を修正
  textData = textData.replace(
    /<span class='detail_titel'>(\r\n|\n|\r}\b)*<br \/>/g,
    "<span class='detail_titel'>"
  );
  const textDataVerAppropriateTags = textData;

  return textDataVerAppropriateTags;
}
/**
 * 引数で受け取ったテキスト内の連続する改行文字(空白行)ををbrタグに変換する関数
 *
 * param {String} - 店舗詳細テキスト
 *
 * return　{String} - HPのコピーボタン用の詳細テキスト
 */
function REPLACE_BLANK_LINES_TO_BR_TAG(textData) {
  //テキスト全体をコピーボタンタグで囲む為にテキストの文頭にタグを付加
  textData = "<pre class='preHidden'>" + textData;

  // 連続する改行文字(空白行)をbrタグに変換
  textData = textData.replace(/\r\n{2,}/g, '<br>\n');
  textData = textData.replace(/(\n|\r){2,}/g, '<br>\n');

  //テキスト全体をコピーボタンタグで囲む為にテキストの末尾にもタグを付加
  textData += '</pre>';

  const textDataVerForCopyButton = textData;

  return textDataVerForCopyButton;
}
/**
 * テキスト内からURLを見つけてaタグで囲む関数
 *
 * param {String} - 店舗詳細テキスト
 *
 * return　- URLがリンクに変換された店舗詳細テキスト
 */
function REPLACE_URL_WITHOUT_A_TAG_TO_LINK_WITH_A_TAG(textData) {
  const regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_:/~?%&;=+#',()*!]+))/g; // ']))/;正規表現（/〜/）を解釈してくれないエディタ等で自動整形を崩さないため。
  const Regexp_makeLink = function (all, url, h, href) {
    return (
      '<a href="h' +
      href +
      '" target="_blank" rel="noopener noreferrer">' +
      url +
      '</a>'
    );
  };
  const textDataVerUrlToLink = textData.replace(regexp_url, Regexp_makeLink);

  return textDataVerUrlToLink;
}
/**
 * コピーボタン用と詳細用の詳細テキスト作って出力する関数
 *
 * return
 */
function TRIGGER() {
  const textData = document.getElementById('text').value;
  const textDataVerForCopyButton = REPLACE_BLANK_LINES_TO_BR_TAG(textData);
  const textDataVerAppropriateTags = INSERT_APPROPRIATE_TAGS(textData);
  const textDataVerAppropriateTagsAndUrlToLink =
    REPLACE_URL_WITHOUT_A_TAG_TO_LINK_WITH_A_TAG(textDataVerAppropriateTags);
  document.getElementById('result').value =
    textDataVerAppropriateTagsAndUrlToLink;
  document.getElementById('resultForCopyButton').value =
    textDataVerForCopyButton;
  document.getElementById('resultHTML').innerHTML =
    textDataVerAppropriateTagsAndUrlToLink;
}
/**
 * コピーボタン用のテキストを全選択する関数
 *
 * return
 */
function TEXT_SELECT_FOR_COPY_BUTTON() {
  // コピー対象を取得
  const CopyTarget = document.getElementById('resultForCopyButton');

  // コピー対象のテキストを選択する
  CopyTarget.select();
}
/**
 * 詳細用のテキストを全選択する関数
 *
 * return
 */
//
function TEXT_SELECT() {
  // コピー対象を取得
  const CopyTarget = document.getElementById('result');

  // コピー対象のテキストを選択する
  CopyTarget.select();
}
/**
 * ユーザーが詳細をコピペする入力フォームの値を削除する関数
 *
 * return
 */
function CLEAR_TEXTAREA() {
  const Textarea = document.getElementById('text');
  Textarea.value = '';
}
