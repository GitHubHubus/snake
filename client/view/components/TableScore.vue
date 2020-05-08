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
    <table class="col-12 table-sm table-striped">
        <thead>
            <tr>
                <th width="10%">{{trans.number}}</th>
                <th width="60%">{{trans.name}}</th>
                <th width="30%">{{trans.score}}</th>
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
import translate from "../../js/Helper/translator";
import locales from '../../locales/en/translation';

export default {
    name: 'TableScore',
    props: {
        items: Object,
    },
    data: function () {
        return {
            trans: translate(locales.page.score, 'page.score')
        }
    },
}
</script>
