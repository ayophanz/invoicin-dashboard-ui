<template>
    <div class="mb-2 input-component">
        <label v-if="label !== ''" :for="name" class="block text-sm font-medium text-gray-700">{{ label }}</label>
        <div class="mt-1 flex flex-col">
            <input v-model="input" 
                :type="type" 
                :name="name" 
                :id="name"
                :class="errorMessage !== '' ? 'border-red-500' : 'border-gray-300'"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <span v-if="errorMessage !== ''" class="text-sm text-red-500">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, toRef, defineComponent, onMounted, watch } from 'vue';

    export default defineComponent({
        name: 'InputComponent',
        props: {
            value: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                default: '',
            },
            type: {
                type: String,
                default: 'text',
            },
            errorMessage: {
                type: String,
                default: '',
            }
        },
        setup(props, { emit }) {
            const value = toRef(props, 'value');
            let input = ref();

            onMounted(() => {
                input.value = value.value;
            });

            watch(input, (value) => {
               emit('onchangeData', {name: props.name, value: value});
            });
            
            return {
                input,
            };
        },
    })
</script>
