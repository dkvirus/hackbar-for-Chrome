let urlField = $('#url_field');
let remarkDataField = $('#remark_data_field');
let remarkDataButton = $('#remark_data_button')
let postDataField = $('#post_data_field');
let refererField = $('#referer_field');
let userAgentField = $('#user_agent_field');
let cookieField = $('#cookie_field');  

let loadUrlBtn = $('#load_url');
let splitUrlBtn = $('#split_url');
let executeBtn = $('#execute');

let enableRemarkBtn = $('#enable_remark_btn')
let enablePostBtn = $('#enable_post_btn');
let enableRefererBtn = $('#enable_referer_btn');
let enableUserAgentBtn = $('#enable_user_agent_btn');
let enableCookieBtn = $('#enable_cookie_btn');
let clearAllBtn = $('#clear_all');
let addSlash = $('#add-slash');

const menu_btn_array = [
    'md5', 'sha1', 'sha256', 'rot13',
    'base64_encode', 'base64_decode', 'url_encode', 'url_decode', 'string_to_ascii', 'ascii_to_string', 'hex_encode', 'hex_decode',
    'sql_mysql_updatexml', 'sql_mysql_extractvalue', 'sql_mysql_tablename', 'sql_mysql_columnname', 'sql_oracle_ctxsys.drithsx.sn', 'sql_oracle_tablename', 'sql_oracle_columnname', 'sql_oracle_pagination',
    'sql_mysql_blind_length', 'sql_mysql_blind_char', 'sql_mysql_blind_timer',
    'sql_mysql_char', 'sql_basic_info_column', 'sql_convert_utf8', 'sql_convert_latin1', 'sql_mssql_char', 'sql_oracle_char', 'sql_union_statement', 'sql_spaces_to_inline_comments',
    'xss_string_from_charcode', 'xss_html_characters', 'xss_alert',
    // LFI  
    // XXE
    'jsonify', 'uppercase', 'lowercase',];

/**
 * 添加事件监听
 */
menu_btn_array.forEach(function (elementID) {
    $('#' + elementID).bind('click', function () {
        onclickMenu(elementID)
    });
});

function onclickMenu(action, val) {
    switch (action) {
        case 'md5':
        case 'sha1':
        case 'sha256':
        case 'rot13':
            encryptionTab(action)
            break;

        case 'base64_encode':
        case 'base64_decode':
        case 'url_encode':
        case 'url_decode':
        case 'string_to_ascii':
        case 'ascii_to_string':
        case 'hex_encode':
        case 'hex_decode':
            encodingTab(action)
            break;

        case 'sql_mysql_updatexml':
        case 'sql_mysql_extractvalue':
        case 'sql_mysql_tablename':
        case 'sql_mysql_columnname':
        case 'sql_mysql_blind_length':
        case 'sql_mysql_blind_char':
        case 'sql_mysql_blind_timer':
        case 'sql_oracle_ctxsys.drithsx.sn':
        case 'sql_oracle_tablename':
        case 'sql_oracle_columnname':
        case 'sql_oracle_pagination':
        case 'sql_mysql_char':
        case 'sql_basic_info_column':
        case 'sql_convert_utf8':
        case 'sql_convert_latin1':
        case 'sql_mssql_char':
        case 'sql_oracle_char':
        case 'sql_union_statement':
        case 'sql_spaces_to_inline_comments':
            sqlTab(action)
            break;

        case 'xss_string_from_charcode':
        case 'xss_html_characters':
        case 'xss_alert':
            xssTab(action)
            break;

        case 'LFI':
            this.setSelectedText(val);
            break;

        case 'jsonify':
        case 'uppercase':
        case 'lowercase':
            otherTab(action)
            break;
    }
    currentFocusField.focus();
}

let currentTabId = chrome.devtools.inspectedWindow.tabId;
let currentFocusField = urlField;

/* Other function */
function jsonValid(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        return false;
    }
}

function getFieldFormData(dataString) {
    let fields = Array();
    let f_split = dataString.trim().split('&');
    for (let i in f_split) {
        let f = f_split[i].match(/(^.*?)=(.*)/);
        if (f.length === 3) {
            let item = {};
            item['name'] = f[1];
            item['value'] = unescape(f[2]);
            fields.push(item);
        }
    }
    return fields;
}

/**
 * ======================================= Tab: Encryption 加密解密 ========================================
 */

function encryptionTab(action) {
    getSelectedText(function (txt) {
        if (txt) {
            switch (action) {
                case 'md5':
                    setSelectedText(Encrypt.md5(txt))
                    break
                case 'sha1':
                    setSelectedText(Encrypt.sha1(txt))
                    break
                case 'sha256':
                    setSelectedText(Encrypt.sha2(txt))
                    break
                case 'rot13':
                    setSelectedText(Encrypt.rot13(txt))
                    break
                default:
            }
        }
    })
}

/**
 * ======================================= Tab: Encoding 编码解码 ========================================
 */

function encodingTab(action) {
    getSelectedText(function (txt) {
        if (txt) {
            switch (action) {
                case 'base64_encode':                   // base64 编码
                    setSelectedText(Encrypt.base64Encode(txt))
                    break
                case 'base64_decode':                   // base64 解码
                    setSelectedText(Encrypt.base64Decode(txt));
                    break
                case 'url_encode':                      // url 编码
                    setSelectedText(urlEncode(txt))
                    break
                case 'url_decode':                      // url 解码
                    setSelectedText(unescape(txt))
                    break
                case 'ascii_to_string':                    // ascii 转字符串
                    setSelectedText(asciiToStr(txt))
                    break
                case 'string_to_ascii':                    // 字符串转 ascii
                    setSelectedText(strToAscii(txt))
                    break
                case 'hex_encode':
                    setSelectedText(Encrypt.strToHex(txt))
                    break;
                case 'hex_decode':
                    setSelectedText(Encrypt.hexToStr(txt))
                    break;
                default:
            }
        }
    })
}

function urlEncode(inputStr) {
    return encodeURIComponent(inputStr).toLowerCase();
}

function asciiToStr(inputStr) {
    const inputArr = inputStr.split(',')
    let strArr = []
    for (let i = 0; i < inputArr.length; i++) {
        strArr.push(String.fromCharCode(inputArr[i]))
    }
    return strArr.join(',')
}

function strToAscii(inputStr) {
    const asciiArr = []
    for(let i = 0; i < inputStr.length; i++){
        const char = inputStr.charAt(i)
        const code = char.charCodeAt()
        asciiArr.push(code)
   }
   
   return asciiArr.join(',')
}

/**
 * ======================================= Tab: SQL ========================================
 */

function sqlTab(action) {
    switch (action) {
        case 'sql_mysql_updatexml':
            var sqlStr = "updatexml(1,concat(0x7e,(select database()),0x7e),1)";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_extractvalue':
            var sqlStr = "(extractvalue(1,concat(0x7e,(select database()),0x7e)))";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_tablename':
            var sqlStr = "select table_name from information_schema.tables where table_schema=database() limit 0,1";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_columnname':
            var sqlStr = 'select column_name from information_schema.columns where table_schema=database() and table_name="xxx" limit 0,1';
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_blind_length':
            var sqlStr = 'length(database())>1';
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_blind_char':
            var sqlStr = 'ascii(substr(database(),1,1))>100';
            this.setSelectedText(sqlStr);
            break;
        case 'sql_mysql_blind_timer':
            var sqlStr = 'if(length((select database()))>1, sleep(5), 1)';
            this.setSelectedText(sqlStr);
            break;
        case 'sql_oracle_ctxsys.drithsx.sn':
            var sqlStr = "1=ctxsys.drithsx.sn(1,(select table_name from (select rownum r,table_name from user_tables) where r=1))"
            this.setSelectedText(sqlStr);
            break;
        case 'sql_oracle_tablename':
            var sqlStr = "select table_name from (select rownum r,table_name from user_tables) where r=1";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_oracle_columnname':
            var sqlStr = "select column_name from (select rownum r,column_name from user_tab_columns where table_name='xxx') where r=1";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_oracle_pagination':
            var sqlStr = "select xxx from (select rownum r, xxx from yyy) where r=1";
            this.setSelectedText(sqlStr);
            break;
        case 'sql_union_statement':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = SQL.selectionToUnionSelect(txt);
                    setSelectedText(newString);
                }
            });
            break;
        case 'sql_mysql_char':
            getSelectedText(function (txt) {
                if (txt) {
                    setSelectedText(SQL.selectionToSQLChar("mysql", txt));
                }
            })
            break
        case 'sql_basic_info_column':
            let sqlBasicStr = 'CONCAT_WS(CHAR(32,58,32),user(),database(),version())';
            this.setSelectedText(sqlBasicStr);
            break;
        case 'sql_convert_utf8':
            getSelectedText(function (txt) {
                if (txt) {
                    setSelectedText("CONVERT(" + txt + " USING utf8)");
                }
            });
            break;
        case 'sql_convert_latin1':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = "CONVERT(" + txt + " USING latin1)";
                    setSelectedText(newString);
                }
            });
            break;
        case 'sql_mssql_char':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = SQL.selectionToSQLChar("mssql", txt);
                    setSelectedText(newString);
                }
            });
            break;
        case 'sql_oracle_char':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = SQL.selectionToSQLChar("oracle", txt);
                    setSelectedText(newString);
                }
            });
            break;
        case 'sql_spaces_to_inline_comments':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = SQL.selectionToInlineComments(txt);
                    setSelectedText(newString);
                }
            });
            break;
        default:
    }
}

/**
 * ======================================= Tab: XSS ========================================
 */

function xssTab(action) {
    switch (action) {
        case 'xss_string_from_charcode':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = XSS.selectionToChar('stringFromCharCode', txt);
                    setSelectedText(newString);
                }
            });
            break;
        case 'xss_html_characters':
            getSelectedText(function (txt) {
                if (txt) {
                    const newString = XSS.selectionToChar('htmlChar', txt);
                    setSelectedText(newString);
                }
            });
            break;

        case 'xss_alert':
            const alertStr = "<script>alert(1)</script>";
            this.setSelectedText(alertStr);
            break;
        default:
    }
}

/**
 * ======================================= Tab: LFI ========================================
 */

$('#lfi .lfi_data').bind('click', function (e) {
    onclickMenu('LFI', this.text);
});

/**
 * ======================================= Tab: Other ========================================
 */

function otherTab(action) {
    getSelectedText(function (txt) {
        switch (action) {
            case 'jsonify':
                if (txt && jsonBeautify(txt)) {
                    setSelectedText(jsonBeautify(txt));
                }
                break
            case 'uppercase':
                if (txt) {
                    setSelectedText(upperCaseString(txt));
                }
                break
            case 'lowercase':
                if (txt) {
                    setSelectedText(lowerCaseString(txt));
                }
                break
            default:
        }
    })
}

function jsonBeautify(inputStr) {
    let jsonString = jsonValid(inputStr);
    if (jsonString) {
        return JSON.stringify(jsonString, null, 4);
    }
    return false;
}

function upperCaseString(inputStr) {
    return inputStr.toUpperCase();
}

function lowerCaseString(inputStr) {
    return inputStr.toLowerCase();
}

/**
 * ======================================================================================
 */

function getSelectedText(callbackFunction) {
    const selectionStart = currentFocusField.prop('selectionStart');
    const selectionEnd = currentFocusField.prop('selectionEnd');
    if (selectionEnd - selectionStart < 1) {
        $('#myModal').modal();
        $('#myModal input').val("");
        $('#myModal button').bind('click', () => {
            const selected_text = $('#myModal input').val();
            callbackFunction(selected_text);
            $('#myModal').modal('hide');
        });
    } else {
        callbackFunction(currentFocusField.val().substr(selectionStart, selectionEnd - selectionStart));
    }
}

function setSelectedText(str) {
    let selectionStart = currentFocusField.prop('selectionStart');
    let selectionEnd = currentFocusField.prop('selectionEnd');
    let pre = currentFocusField.val().substr(0, selectionStart);
    let post = currentFocusField.val().substr(selectionEnd, currentFocusField.val().length);
    currentFocusField.val(pre + str + post);
    currentFocusField[0].setSelectionRange(selectionStart, selectionEnd + str.length)
}

/**
 * ======================================================================================
 */

function loadUrl() {
    chrome.runtime.sendMessage({
        tabId: currentTabId,
        action: 'load_url',
        data: null
    }, function (message) {
        if (!message) return 
        if ('url' in message && message.url) {
            urlField.val(message.url);
        }
        if ('data' in message && message.data && postDataField.val() === "") {
            postDataField.val(message.data);
        }
        if ('headers' in message && message.headers) {
            const h = message.headers;
            if(h.referer){
                refererField.val(h.referer);
            }
            if(h.cookie){
                cookieField.val(h.cookie);
            }
            if(h.user_agent){
                userAgentField.val(h.user_agent);
            }
        }
    });
}

function splitUrl() {
    let uri = currentFocusField.val();
    uri = uri.replace(new RegExp(/&/g), "\n&");
    uri = uri.replace(new RegExp(/\?/g), "\n?");
    currentFocusField.val(uri);
    return true;
}

function exec(cmd) {
    return chrome.devtools.inspectedWindow.eval(cmd);
}

function execute() {
    let Headers = {
        referer: null,
        user_agent: null,
        cookie: null
    }

    let post_data = null;
    let method = 'GET';

    if (enableRefererBtn.prop('checked')) {
        Headers.referer = refererField.val();
    }
    if (enableUserAgentBtn.prop('checked')) {
        Headers.user_agent = userAgentField.val();
    }
    if (enableCookieBtn.prop('checked')) {
        Headers.cookie = cookieField.val();
    }
    if (enablePostBtn.prop('checked')) {
        method = 'POST';
        post_data = getFieldFormData(postDataField.val());
    }

    let url = urlField.val();
    url = url.replace(new RegExp(/\n|\r/g), '').trim();
    if (!(new RegExp(/^(http:\/\/|https:\/\/|view-source:)/gi)).test(url)) {
        url = 'http://' + url;
    }
    if (!url) {
        return;
    }
    if (method === 'GET') {
        let code = 'const url = "' + encodeURIComponent(url) + '";';
        code += 'window.location.href = decodeURIComponent(url);';
        chrome.devtools.inspectedWindow.eval(code, function (result, isException) {
            setTimeout(() => { currentFocusField.focus() }, 100);
        });
    } else {
        let code = 'var post_data = "' + encodeURIComponent(JSON.stringify(post_data)) + '"; var url = "' + encodeURIComponent(url) + '";';
        code += 'var fields = JSON.parse(decodeURIComponent(post_data));';
        code += 'const form = document.createElement("form");';
        code += 'form.setAttribute("method", "post");';
        code += 'form.setAttribute("action", decodeURIComponent(url));';
        code += 'fields.forEach(function(f) { var input = document.createElement("input"); input.setAttribute("type", "hidden"); input.setAttribute("name", f[\'name\']); input.setAttribute("value", f[\'value\']); form.appendChild(input); });';
        code += 'document.body.appendChild(form);'
        code += 'form.submit();';
        exec(code)
    }

    chrome.runtime.sendMessage({
        tabId: currentTabId,
        action: 'send_requests',
        data: { ...Headers, url, method, post_data }
    });
}

/**
 * Load URL 按钮
 */
loadUrlBtn.bind('click', function () {
    loadUrl();
});

/**
 * Split URL 按钮
 */
splitUrlBtn.bind('click', function () {
    splitUrl();
});

/**
 * Execute 按钮
 */
executeBtn.bind('click', function () {
    execute();
});

/**
 * Add 按钮
 */
addSlash.click(function () {
    let currentValue = currentFocusField.val();
    currentValue += "/"
    currentFocusField.val(currentValue);
});

/**
 * ================================================================================
 */

// toggle element
function toggleElement(elementBtn, elementBlock) {
    if (elementBtn.prop('checked')) {
        elementBlock.show();
    } else {
        elementBlock.hide();
    }
}

enableRemarkBtn.click(function () {
    toggleElement($(this), remarkDataField.closest('.block'))
});

enablePostBtn.click(function () {
    toggleElement($(this), postDataField.closest('.block'))
});
enableRefererBtn.click(function () {
    toggleElement($(this), refererField.closest('.block'))
});
enableUserAgentBtn.click(function () {
    toggleElement($(this), userAgentField.closest('.block'))
});
enableCookieBtn.click(function () {
    toggleElement($(this), cookieField.closest('.block'))
});

remarkDataButton.click(function () {
    remarkDataField.val('')
})

enableRemarkBtn.click()
enablePostBtn.click()
enableRefererBtn.click()
enableUserAgentBtn.click()
enableCookieBtn.click()

/**
 * Clear All 按钮：只清空请求头三个文本框的内容
 */
clearAllBtn.on('click', function () {
    refererField.val('');
    userAgentField.val('');
    cookieField.val('');
    urlField.val('')  
    postDataField.val('')
});

/**
 * 几个文本框绑定点击事件
 */
urlField.on('click', onFocusListener);
postDataField.on('click', onFocusListener);
refererField.on('click', onFocusListener);
userAgentField.on('click', onFocusListener);
cookieField.on('click', onFocusListener);
remarkDataField.on('click', onFocusListener);

function onFocusListener() {
    currentFocusField = $(this);
    console.log('currentFocusField', currentFocusField)
}

/**
 * 按【Ctrl + Enter】组合键，发出请求
 */
urlField.on('keypress', onSendRequest);
postDataField.on('keypress', onSendRequest);
refererField.on('keypress', onSendRequest)
userAgentField.on('keypress', onSendRequest);
cookieField.on('keypress', onSendRequest);

function onSendRequest (event) {
    if ('key' in event && event.charCode === 13) {
        execute();
        event.preventDefault();
    }
}