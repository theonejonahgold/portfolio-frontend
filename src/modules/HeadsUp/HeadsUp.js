export default class HeadsUp
{

    set type(type)
    {
        this._type = type
    }

    get type()
    {
        return this._type
    }

    set message(msg)
    {
        this._message = msg
    }

    get message()
    {
        return this._message
    }

    constructor(type, msg) {
        this.type = type
        this.message = msg
        this.requestNotificationPermission()
            .then(result => result == 'granted' ? true : false)
            .then(isEnabled => this._notificationsEnabled = isEnabled)
            .catch(() => this._notificationsEnabled = false)
            .finally(() => this._notificationsEnabled ?
                this.sendNotification() :
                this.createPopUp())
    }

    /**
     * 
     * @returns Promise<Notification>
     */
    async requestNotificationPermission()
    {
        return Notification.requestPermission()
    }

    sendNotification()
    {
        switch (this.type) {
            case 'serverMessage': {
                new Notification('Bericht van server', { body: this.message, icon: 'https://via.placeholder.com/800x800' })
                break
            }
            case 'chatMessage': {
                new Notification(this.message.sender, { body: this.message.content })
            }
        }
    }

    createPopUp()
    {
        const notification = document.createElement('div')
        const notificationTextContainer = document.createElement('div')
        const notificationTitle = document.createElement('h1')
        const notificationContent = document.createElement('p')
        const notificationImage = document.createElement('img')

        switch (this.type) {
            case 'serverMessage': {
                notificationTitle.innerHTML = 'Bericht van server'
                notificationContent.innerHTML = this.message
                notificationImage.src = 'https://via.placeholder.com/800x800'
                break
            }
        }
        
        notification.classList.add('pop-up')
        notification.appendChild(notificationImage)
        notification.appendChild(notificationTextContainer)
        notificationTextContainer.appendChild(notificationTitle)
        notificationTextContainer.appendChild(notificationContent)
        document.body.appendChild(notification)
        notification.addEventListener('animationend', () => notification.remove(), false)
    }
}