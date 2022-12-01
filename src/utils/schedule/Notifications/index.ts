import * as Notifications from 'expo-notifications';

const scheduleNotification = (name: string, message:string, alertTime: Date) => {
    Notifications.scheduleNotificationAsync({
        identifier: name,
        content: {
            title: `${message}`
        },
        trigger: {
            hour: alertTime.getHours(), minute: alertTime.getMinutes(), repeats: true
        }
    })
}

const cancelScheduledNotification = (name: string) => {
    Notifications.cancelScheduledNotificationAsync(name)
}

export { scheduleNotification, cancelScheduledNotification }