<template lang="html">
    <div class="text-center">
        <div>
            <span class="rating-name ml-2">{{score.key}}</span>
            <span class="rating-name ml-2">{{score.name}}</span>
            <span class="rating-score ml-5">{{score.score}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RowScore',
    props: {
        score: Object,
    },
}
</script>
