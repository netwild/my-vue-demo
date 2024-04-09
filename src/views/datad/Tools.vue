<template>
  <div>
    表格：
    <table>
      <thead>
        <tr>
          <th @click="sortBy('name')">姓名</th>
          <th @click="sortBy('address')">地址</th>
          <th @click="sortBy('desc')">备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import dataGener from '@/utils/dataGener'
export default {
  props: {},
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.initStaticData()
  },
  methods: {
    initStaticData() {
      // for (let i = 0; i < 100; i++) {
      //   this.data.push({
      //     id: i,
      //     name: dataGener.name(),
      //     address: dataGener.address(),
      //     desc: dataGener.text()
      //   })
      // }
      // console.log(this.data)
      console.log('uuid: ' + dataGener.uuid())
      console.log('number: ' + dataGener.number())
      console.log('float: ' + dataGener.float())
      console.log('string: ' + dataGener.string())
      console.log('word: ' + dataGener.word())
      console.log('sentence: ' + dataGener.sentence())
      console.log('paragraphs: ' + dataGener.paragraphs())
      console.log('text: ' + dataGener.text())
      console.log('name: ' + dataGener.name())
      console.log('sex: ' + dataGener.sex())
      console.log('birthday: ' + dataGener.birthday())
      console.log('age: ' + dataGener.age())
      console.log('city: ' + dataGener.city())
      console.log('addr: ' + dataGener.addr())
      console.log('mobile: ' + dataGener.mobile())
      console.log('phone: ' + dataGener.phone())
      console.log('email: ' + dataGener.email())
      console.log('ipv4: ' + dataGener.ip())
      console.log('ipv6: ' + dataGener.ipv6())
      console.log('nation: ' + dataGener.nation())
      console.log('polStatus: ' + dataGener.polStatus())
    },
    sortBy() {}
  }
}
</script>

<style scoped></style>
