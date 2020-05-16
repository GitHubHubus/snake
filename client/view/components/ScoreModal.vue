<template lang="html">
    <div class="modal fade" id="scoreModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{trans.score.new_score}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="form-group">
                            <input type="text" placeholder="Name" class="form-control" v-model="name">
                        </div>
                        <div class="form-group">
                            <input type="hidden" class="form-control" :value="score">
                            <input type="hidden" class="form-control" :value="type">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{trans.close}}</button>
                    <button v-on:click="post" type="button" class="btn btn-primary">{{trans.send}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import translate from "../../js/Helper/translator";
import locales from '../../locales/en/translation';
import api from "../../js/Api";
import $ from "jquery";

export default {
    name: 'ScoreModal',
    props: {
        type: Number,
        score: Number
    },
    data: function () {
        return {
            trans: translate(locales.page.modal, 'page.modal'),
            name: ''
        }
    },
    methods: {
        post() {
            let data = {score: this.score, type: this.type, name: this.name};

            api.score.post(data).then(() => {
                $('#scoreModal').modal('hide');
            });
        },
    }
}
</script>
