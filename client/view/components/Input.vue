<template lang="html">
    <input
            :placeholder="props.label"
            :type="props.type"
            :max="props.max"
            :min="props.min"
            :step="props.step"
            class="mb-3 form-control"
            v-on:change="update" 
    />
</template>

<script>
export default {
    name: 'Input',
    props: {
        props: Object,
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
