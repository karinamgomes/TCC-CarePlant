import * as Notifications from 'expo-notifications';
export const sendNotification = async (name:string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Olá,',
            body: `Está na hora de cuidar da sua ${name}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: {
                // plant
            },
        },
        trigger: {
            seconds: 3,
            repeats: false
        },
    });
}