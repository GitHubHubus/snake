<style>
td {
  text-align: center;
  vertical-align: middle;
}
thead {
    text-align: center;
    vertical-align: middle;
}
</style>

<template lang="html">
    <table class="table-sm table-striped">
        <thead>
            <tr>
                <th width="10%">#</th>
                <th width="60%">Name</th>
                <th width="30%">Score</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for='item in items'>
                <td>{{item.key}}</td>
                <td>{{item.name}}</td>
                <td>{{item.score}}</td>
            </tr>
        </tbody>

    </table>
</template>

<script>
export default {
    name: 'TableScore',
    props: {
        items: Object,
    },
}
</script>
