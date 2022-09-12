<template>
    <ModalComponent :state="true" :onClose="false" :showClose="false">
            <div v-if="step2fa === '2fa-required'">
                <div class="px-4 py-5 sm:p-6 flex flex-col items-center">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Verify One Time Password</h3>
                    <div class="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Enter the pin code from Google Authenticator app:</p>
                    </div>
                    <div class="mt-5 flex gap-x-5 items-end">
                        <div class="w-full sm:max-w-xs">
                            <input type="text" v-model="oneTimePassword" name="otpCode" id="otpCode" class="pl-2 block h-[36px] w-full border rounded-md border-gray-400 shadow-sm sm:text-sm" />
                        </div>
                        <button @click="onVerifyOTP" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Verify
                        </button>
                    </div>
                </div>
            </div>
            
            <div v-if="step2fa === 'generate-secret'">
                <h4 class="text-center my-5 text-2xl">Two Factor Authentication</h4>
                <div>
                    <p class="text-left">Two-Factor Authentication (2FA) works by adding an additional layer of security to your account. It requires an additional login credential - beyond just the username and password - to gain account access, and getting that second credential requires access to something that belongs to you.</p>
                </div>
                <div class="text-center my-5">
                    <div class="mt-3">
                        <button @click="onGenerateSecret" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Generate Secret Key to Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="step2fa === 'generate-qrcode'">
                <h4 class="text-center my-5 text-2xl">Set up Google Authenticator</h4>
                <div>
                    <p class="text-left">1. Scan this QR code with your Google Authenticator App. Alternatively, you can use the code: <br><strong class="text-red-400">{{ secret }}</strong></p>
                    <div v-cloak v-html="qrImage" class="flex justify-center">
                    </div>
                    <p class="text-left">2. Enter the pin code from Google Authenticator app:</p>
                </div>
                <div class="text-center my-5">
                    <div class="mt-5 flex gap-x-5 items-end">
                        <div class="w-full sm:max-w-xs text-left">
                            <input type="text" v-model="optCode" name="otpCode" id="otpCode" class="pl-2 block h-[36px] w-full border rounded-md border-gray-400 shadow-sm sm:text-sm" />
                        </div>
                        <button @click="on2faEnable" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Enable 2fa
                        </button>
                    </div>
                </div>
            </div>

    </ModalComponent>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import accountService from '../services/account';
import ModalComponent from '../components/modal.vue';
import { useAccountStore } from '../stores/account';
import router from '../router';

export default defineComponent({
    name: 'setupTwofa',
    components: {
        ModalComponent,
    },
    setup() {
        let   qrImage         = ref('');
        let   secret          = ref('');
        let   step2fa         = ref('');
        let   optCode         = ref('');
        let   oneTimePassword = ref('');
       
        const accountStore     = useAccountStore();
        const otpSetupRequired = ref(accountStore.getIsOtpSetupRequired);
        const otpRequired      = ref(accountStore.getIsOtpRequired);
        const tempUserId       = ref(accountStore. getOtpUserId);

        if (otpSetupRequired.value) {
            step2fa.value = 'generate-secret';
        } 
        
        if (otpRequired.value) {
            step2fa.value = '2fa-required'; 
        }

        const onGenerateSecret = async () => {
            await accountService.generate2faSecret({ user_id: tempUserId.value })
            .then(() => {
                step2fa.value = 'generate-qrcode';
                onLoadQRcode();
            });
        }

        const onLoadQRcode = async () => {
            await accountService.genTwofaQRcode({ user_id: tempUserId.value })
            .then((response) => {
                qrImage.value = response.qr_image_url;
                secret.value = response.secret;
            })
            .catch((error) => {
                console.log(error);
            });
        }

        const on2faEnable = async () => {
            await accountService.enable2fa({ user_id: tempUserId.value, otp_code: optCode.value })
            .then((response) => {
                if (response.token != '') {
                    accountStore.login(response.token);
                    accountStore.removeOtpUserId();
                    router.push({ name: 'dashboard' });
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }

        const onVerifyOTP = async () => {
            await accountService.verifyOtp({ user_id: tempUserId.value, otp_code: oneTimePassword.value })
            .then((response) => {
                if (response.token != '') {
                    accountStore.login(response.token);
                    accountStore.removeOtpUserId();
                    router.push({ name: 'dashboard' });
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }

        return {
            step2fa,
            secret,
            qrImage,
            optCode,
            oneTimePassword,
            onGenerateSecret,
            on2faEnable,
            onVerifyOTP,
        }
    }
});
</script>