'use strict';

module.exports = (createEditor, byId, fetch, debounce, example) => {

    let editors  = {
            source : createEditor('editor-source'),
            debug  : createEditor('editor-debug')
        },

        elements = byId(
            'toggle-debug', 'panel-preview', 'panel-debug', 'preview'
        ),

        self = () => {

            editors.debug.setReadOnly(true);
            editors.source.on('change', debounce(self.update.bind(null, editors, elements), 500));
            editors.source.setValue(example, -1);
            editors.source.focus();

            self.toggle(elements);

        };

    self.toggle = (elements) => {

        let debug = false;

        elements['toggle-debug'].addEventListener('click', function(event) {

            let caption = !debug ? 'PREVIEW' : 'DEBUG';

            elements['toggle-debug'].innerHTML = caption;
            elements['panel-preview'].classList.toggle('hide');
            elements['panel-debug'].classList.toggle('hide');

            if (!debug) { editors.debug.resize(); }

            debug = !debug;

        }, false);

    };

    self.update = (editors, elements) => {

        let input   = editors.source.getValue(),
            panel   = elements['panel-preview'],
            preview = elements['preview'];

        fetch('/process', {
            method  : 'POST',
            headers : {
                'Accept'       : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ esi : input })
        }).then(res => {
            return res.json();
        }).then(data => {
            if (!data.id) { return; }
            panel.classList.toggle('transparent');
            setTimeout(function() {
                preview.setAttribute('srcdoc', data.preview);
                panel.classList.toggle('transparent');
            }, 1000);
            editors.debug.setValue(data.debug, -1);
        });

    };

    return self;

};
