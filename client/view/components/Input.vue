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
            this.$emit('update', [this.props.key, e.target.value]);
        },
    }
}
</script>
