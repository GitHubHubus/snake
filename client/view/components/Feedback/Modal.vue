<template lang="html">
    <div class="modal fade feedback" id="feedbackModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{trans.feedback.feedback}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input type="text" :placeholder="trans.feedback.email" class="form-control mb-2" v-model="email">
                        <textarea :placeholder="trans.feedback.message" class="form-control message" v-model="message"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{trans.close}}</button>
                    <button v-on:click="send" type="button" class="btn btn-primary">{{trans.send}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import translate from "../../../js/Helper/translator";
import locales from '../../../locales/en/translation';
import api from "../../../js/Api";
import $ from "jquery";

export default {
    name: 'FeedbackModal',
    data: function () {
        return {
            trans: translate(locales.page.modal, 'page.modal'),
            email: '',
            message: ''
        }
    },
    methods: {
        send() {
            let data = {email: this.email, message: this.message};

            api.email.post(data).then(() => {
                $('#feedbackModal').modal('hide');
            });
        },
    }
}
</script>
