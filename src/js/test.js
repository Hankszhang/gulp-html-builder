// eslint-disable-next-line
var vueInstance = new Vue({
    el: '#app',
    data: function () {
        return {
            phone: '',
            isSending: false,
            sendText: '发送验证码'
        };
    },
    methods: {
        sendCode: function () {
            var that = this;
            if (this.isSending) {
                return;
            }
            var number = this.phone;
            var numberReg = /^1[0-9]{10}$/;
            if (number.length) {
                if (numberReg.test(number)) {
                    $.ajax({
                        type: 'POST',
                        url: '/api/invite/sendSMS',
                        data: {
                            phone: number
                        },
                        success: function (res) {
                            if (res.r === 0) {
                                var count = 60;
                                that.isSending = true;
                                that.sendText = '已发送(' + count-- + ')';
                                var timer = setInterval(function () {
                                    if (count > 0) {
                                        that.sendText = '已发送(' + count-- + ')';
                                    }
                                    else {
                                        clearInterval(timer);
                                        that.sendText = '发送验证码';
                                        that.isSending = false;
                                    }
                                }, 1000);
                            }
                            else {
                                that.$message.error(res.msg || '发送失败，请稍后重试');
                            }
                        },
                        error: function (e) {
                            that.$message.error('发送失败，请稍后重试');
                        }
                    });
                }
                else {
                    this.$message.error('请输入正确的手机号');
                }
            }
            else {
                this.$message.error('请输入手机号');
            }
        }
    }
});
