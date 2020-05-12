<template lang="html">
    <div class="form-group row">
        <label :for="props.key" class="col-sm-3 col-form-label">{{props.label}}</label>
        <div class="col-sm-9">
            <input
                :placeholder="trans.range_values + ': ' + props.min + ' - ' + props.max"
                :type="props.type"
                :max="props.max"
                :min="props.min"
                :step="props.step"
                class="mb-3 form-control"
                v-on:change="update"
                :id="props.key"
                :disabled="lock"
            />
        </div>
    </div>
</template>
range_values
<script>
import translate from "../../js/Helper/translator";
import locales from '../../locales/en/translation';

export default {
    name: 'Input',
    props: {
        props: Object,
        lock: Boolean
    },
    data: function () {
        return {
            trans: translate(locales.page, 'page')
        }
    },
    methods: {
        update(e) {
            let value = e.target.value;
            if (value > this.props.max) {
                value = this.props.max;
            } else if (value < this.props.min) {
                value = this.props.min;
            }

            if (this.props.step) {
                value = value - (value % this.props.step);
            }

            e.target.value = value;
            this.$emit('update', [this.props.key, e.target.value]);
        },
    }
}
</script>
