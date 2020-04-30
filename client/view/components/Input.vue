<template lang="html">
    <input :placeholder="props.label" :type="props.type" :max="props.max" :min="props.min" :step="props.step" class="mb-3 form-control" />
</template>

<script>
export default {
    name: 'Input',
    props: {
        props: Object,
    },
}
</script>
