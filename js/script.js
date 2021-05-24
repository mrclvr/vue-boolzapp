var app = new Vue({

    el: '#root',
    data: {
        contacts: [
            {
                name: 'Mìchèlé',
                avatar: '_1',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        text: 'Hai portato a spasso il cane?',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        text: 'Ricordati di dargli da mangiare',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 16:15:22',
                        text: 'Tutto fatto!',
                        status: 'received'
                    },
                    {
                        date: '25/05/2021 16:15:22',
                        text: 'Test IERI',
                        status: 'received'
                    }
                ],
            },
            {
                name: 'Fàbìo',
                avatar: '_2',
                visible: true,
                messages: [
                    {
                        date: '20/03/2020 16:30:00',
                        text: 'Ciao come stai?',
                        status: 'sent'
                    },
                    {
                        date: '20/03/2020 16:30:55',
                        text: 'Bene grazie! Stasera ci vediamo?',
                        status: 'received'
                    },
                    {
                        date: '20/03/2020 16:35:00',
                        text: 'Mi piacerebbe ma devo andare a fare la spesa.',
                        status: 'sent'
                    },
                    {
                        date: '26/05/2021 16:35:00',
                        text: 'Test OGGI',
                        status: 'sent'
                    }
                ],
            },     
            {
                name: 'Sàmùèlé',
                avatar: '_3',
                visible: true,
                messages: [
                    {
                        date: '28/03/2020 10:10:40',
                        text: 'La Marianna va in campagna',
                        status: 'received'
                    },
                    {
                        date: '28/03/2020 10:20:10',
                        text: 'Sicuro di non aver sbagliato chat?',
                        status: 'sent'
                    },
                    {
                        date: '28/03/2020 16:15:22',
                        text: 'Ah scusa!',
                        status: 'received'
                    }
                ],
            },
            {
                name: 'Lùìsà',
                avatar: '_4',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        text: 'Lo sai che ha aperto una nuova pizzeria?',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        text: 'Si, ma preferirei andare al cinema',
                        status: 'received'
                    }
                ],
            },
        ],
        activeChatIndex: 0,
        search: '',
        newMsg: ''
    },
    methods: {
        //get date and time
        getNowDateTime: function () {
            return dayjs().format('DD/MM/YYYY HH:mm:ss');
        },

        //get message time in HH:mm format
        getMsgTime: function(message) {
            const msgTime = message.date.split(" ")[1];
            return msgTime.substr(0, 5);
        },

        //get avatar path for specified contact obj
        getContactImg: function(contact) {
            return `img/avatar${contact.avatar}.jpg`;
        },

        //get last message for specified contact obj
        getLastMsg: function(contact) {
            return contact.messages[contact.messages.length - 1];
        },

        //get last message text for specified contact obj
        getLastMsgText: function(contact) {
            return this.getLastMsg(contact).text;
        },

        //get last message date for specified contact obj
        //special checks for 'yesterday' and 'today' days
        getLastMsgDate: function(contact) {
            const todayDateTime = this.getNowDateTime();
            const todayDate = todayDateTime.split(" ")[0];
            const todayDay = todayDateTime.substr(0, 2);          
            const todayMonthYear = todayDateTime.substr(2, 8);         
            const msgDateTime =  this.getLastMsg(contact).date;
            const msgDate = msgDateTime.split(" ")[0];
            const msgDay = msgDateTime.substr(0, 2);
            const msgMonthYear = msgDateTime.substr(2, 8);
            const msgHoursMins = msgDateTime.substr(10, 6);
            let lastMsgTime;

            if (msgDate == todayDate) {
                lastMsgTime = `oggi ${msgHoursMins}`
            } else if (msgMonthYear == todayMonthYear && msgDay == todayDay - 1) {
                lastMsgTime = `ieri ${msgHoursMins}`
            } else {
                lastMsgTime = `${msgDate} ${msgHoursMins}`
            }
            return lastMsgTime;
        },
        
        //gets current active contact
        getActiveContact: function() {
            return this.contacts[this.activeChatIndex];
        },
        
        //gets current active contact avatar path
        getActiveImg: function() {
            return `img/avatar${this.contacts[this.activeChatIndex].avatar}.jpg`;
        },
        
        //set current active contact index
        setActive: function(chatIndex) {
            this.activeChatIndex = chatIndex;
        },

        //sends message in current chat
        sendMsg: function() {
            const msg = {
                date: this.getNowDateTime(),
                text: this.newMsg,
                status: 'sent'
            }
            this.getActiveContact().messages.push(msg);
            this.newMsg = '';

            setTimeout(() => {
                const botMsg = {
                    date: this.getNowDateTime(),
                    text: 'ok',
                    status: 'received'
                }
                this.getActiveContact().messages.push(botMsg); 
            }, 1000);
        },

        //gets first 40 chars of string (with ellipses)
        text40: function(text) {
            let newText = text;
            if (text.length > 35) {
                newText = `${text.substring(0, 40)}...`;
            }
            return newText;
        },

        //normalize string (no accents)
        strNormalize: function (string) {
            return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        },

        // search function for contact names
        //sets visible to false if contact doesn't match search string
        contactsFilter: function() {            
            this.contacts.forEach(contact => {
                const mySearch = this.strNormalize(this.search).toUpperCase();
                const contactName = this.strNormalize(contact.name).toUpperCase();
                if (contactName.startsWith(mySearch)) {
                    contact.visible = true;
                } else {
                    contact.visible = false;
                }
            });
        },

        //scroll to last message
        lastMsgScroll: function() {
            const msgList = document.querySelectorAll('.msg-text');        
            msgList[msgList.length -1].scrollIntoView();
        }
    },
    updated () {
        this.lastMsgScroll();
    }
});