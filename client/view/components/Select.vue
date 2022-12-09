<template lang="html">
    <div class="form-group row">
        <label :for="props.key" class="col-sm-3 col-form-label">{{props.label}}</label>
        <div class="col-sm-9">
            <select
                v-model="selected"
                v-on:change="update"
                :id="props.key"
                :disabled="lock"
                class="mb-3 form-control"
            >
              <option :value="opt" v-for="opt in props.choices">{{opt}}</option>
            </select>
        </div>
    </div>
</template>

<script>
import translate from "../../js/Helper/translator";
import locales from '../../locales/en/translation';

export default {
    name: 'Select',
    props: {
        props: Object,
        lock: Boolean
    },
    data: function () {
        return {
            trans: translate(locales.page, 'page'),
            selected: this.props.default
        }
    },
    methods: {
        update(e) {
          console.log('123');
            this.$emit('update', [this.props.key, e.target.value]);
        },
    }
}
</script>
