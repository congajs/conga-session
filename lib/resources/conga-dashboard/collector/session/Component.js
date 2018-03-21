import Vue from 'vue';

import './component.css';

const DANGER_TIME = 7500;
const WARNING_TIME = 3500;

export default Vue.extend({

    template: `

        <div id="session-collector" v-if="d !== null">
            
            <blockquote>
                <p>
                    This is the session data attached to the request.
                </p>
            </blockquote>
            
            <div class="body">
            
                <pre><code class="json">{{ session.dump }}</code></pre>
                
            </div>

        </div>

    `,

    props: ['d', 'request'],

    data: function() {
        return {
            session: {
                dump: '',
                realms: []
            }
        };
    },

    watch: {
        d: function(d) {
            if (!d) {
                return;
            }

            console.log('the session data', d);

            this.session.dump = JSON.stringify(d, null, 4);
        },
        request: function(request) {
            if (request === null) {
                return;
            }
            //console.log('twig collector', request.collectedData['TwigJS']);
        }
    },


    updated: function() {
        window.hljs.initHighlighting.called = false;
        window.hljs.initHighlighting();
    }
});