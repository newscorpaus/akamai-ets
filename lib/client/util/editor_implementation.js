'use strict';

module.exports = (ace) => {

    let defaults = {
        theme : 'chrome',
        mode  : 'html'
    };

    return (id) => {

        let editor  = ace.edit(id),
            session = editor.getSession();

        editor.setTheme(`ace/theme/${defaults.theme}`);
        editor.setHighlightActiveLine(false);
        editor.setShowPrintMargin(false);
        editor.setOption('scrollPastEnd', 0.33);

        session.setUseWrapMode(true);                 // wrap source
        session.setWrapLimitRange(80, 100);           // min & max line length
        session.setMode(`ace/mode/${defaults.mode}`); // support mixed HTML, CSS & JS
        session.setUseWorker(false);                  // disable syntax validation

        session.setUseSoftTabs(true);
        session.setTabSize(4);

        return editor;

    };

};
