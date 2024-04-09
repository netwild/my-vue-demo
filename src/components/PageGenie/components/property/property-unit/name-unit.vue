<!--
 * @Author: lzz
 * @Date: 2024-03-18 11:06:41
 * @LastEditTime: 2024-03-18 13:32:05
-->
<template>
    <el-form-item label="名称">
        <el-input v-model="value" class="hide-spin-button" style="width: 100%"></el-input>
    </el-form-item>
</template>

<script>
export default {
    name: "name-editor",
    props: {
        designer: Object,
        selectedWidget: Object,
        optionModel: Object,
    },
    data() {
        value: ''
    }
}
</script>

<style scoped></style>