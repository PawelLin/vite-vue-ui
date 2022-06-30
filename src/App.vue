<script setup lang="ts">
import { ref } from 'vue'
const inputText = ref('123')
const inputInt = ref(12)
const inputDecimal = ref(123.45)
const inputDecimalSection = ref(123.45)
const inputPhone = ref('13700623447')
const inputBankCard = ref('6222021942500196213')
const inputIdCard = ref('610402198203115081')
const showValue = ref(false)
// setTimeout(() => {
//     inputPhone.value = '13333333333'
//     inputBankCard.value = '666666666666666666'
//     inputIdCard.value = '44444444444444444'
// }, 2000)
</script>

<template>
    <h4 class="title">vue3-pawel-ui</h4>
    <fieldset>
        <legend>
            输入框
            <!-- <input v-model="showValue" type="checkbox" name="" id="" /> -->
        </legend>
        <div>
            <label>文本</label>
            <PwInput v-model="inputText" :maxlength="8" :regExp="/^[a-zA-Z\d\u4e00-\u9fa5']*$/" />
            <span v-show="showValue">{{ inputText }}</span>
        </div>
        <div>
            <label>整数</label>
            <PwInput v-model.number="inputInt" type="number" :integer="1" :decimal="2" :max="1" :min="0" />
            <span v-show="showValue">{{ inputInt }}</span>
        </div>
        <div>
            <label>金额</label>
            <PwInput
                v-model.number="inputDecimal"
                type="number"
                :integer="8"
                :decimal="2"
                :max="99999999"
                :min="-99999999"
            />
            <span v-show="showValue">{{ inputDecimal }}</span>
        </div>
        <div>
            <label>金额区间</label>
            <PwInput
                v-model.number="inputDecimalSection"
                type="number"
                :integer="8"
                :decimal="2"
                :max="100000000.98"
                :min="-100000000.98"
            />
            <span v-show="showValue">{{ inputDecimalSection }}</span>
        </div>
        <div>
            <label>手机号</label>
            <PwInput v-model="inputPhone" format="phone" />
            <span v-show="showValue">{{ inputPhone }}</span>
        </div>
        <div>
            <label>银行卡</label>
            <PwInput v-model="inputBankCard" format="bankCard" />
            <span v-show="showValue">{{ inputBankCard }}</span>
        </div>
        <div>
            <label>身份证</label>
            <PwInput v-model="inputIdCard" format="idCard" />
            <span v-show="showValue">{{ inputIdCard }}</span>
        </div>
    </fieldset>
</template>

<style>
html,
body {
    color: #515a6e;
}
fieldset {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
}
/* fieldset:hover {
    box-shadow: 0 2px 7px rgba(0,0,0,.15);
    border-color: transparent;
}
fieldset:hover > legend {
    text-shadow: -1px -1px #eee;
} */
input {
    padding: 4px 7px;
    height: 24px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
input:hover,
input:focus {
    border-color: #42b983;
}
input:focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 240, 204, 0.2);
}
#app > fieldset {
    margin-top: 12px;
}
fieldset label,
.ivu-input-group-prepend {
    display: inline-block;
    min-width: 70px;
}
fieldset div + div {
    margin-top: 10px;
}
.title {
    position: relative;
    text-align: center;
}
.title:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 12%;
    height: 2px;
    max-width: 50px;
    transform: translateX(-50%);
    background-color: #42b983;
}
</style>
