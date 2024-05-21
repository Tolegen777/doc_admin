import moment from 'moment';

export function getDates(page: number) {
    const dates = [];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

    let currentDate = new Date();

    // Вычисляем начальную дату для данной страницы
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + (page - 1) * 30);

    for (let i = 0; i < 30; i++) {
        let date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dayNumber = date.getDate();
        const monthName = months[date.getMonth()];
        const weekdayName = weekdays[date.getDay()];
        const formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const time = hours + ':' + minutes;

        dates.push({day: dayNumber, month: monthName, weekday: weekdayName, date: formattedDate, time: time});
    }
    return dates;
}

export function getDateRange(page: number): string {

    let currentDate = new Date();

    // Вычисляем начальную дату для данной страницы
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + (page - 1) * 30);

    // Вычисляем конечную дату для данной страницы
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 29); // Поскольку каждая страница содержит 30 дней, последняя дата будет через 29 дней

    // Форматируем даты
    const formattedStartDate = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' + ('0' + startDate.getDate()).slice(-2);
    const formattedEndDate = endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' + ('0' + endDate.getDate()).slice(-2);

    return `${formattedStartDate}/${formattedEndDate}/`
}

/**
 * Форматирует дату и время в соответствии с указанными форматами.
 * @param inputDate - Дата в формате "YYYY-MM-DD".
 * @param inputTime - Время в формате "HH:mm:ss".
 * @returns Отформатированная строка, представляющая дату и время.
 * Если дата сегодняшняя, возвращается строка "Сегодня, HH:mm".
 * Иначе возвращается строка в формате "DD.MM.YYYY, HH:mm".
 * В случае недопустимой даты или времени возвращается "Invalid date or time".
 */
export function formatDateTime(inputDate: string, inputTime: string): string {
    const now = moment();
    const dateMoment = moment(inputDate);
    const timeMoment = moment(inputTime, 'HH:mm:ss');

    if (!dateMoment.isValid() || !timeMoment.isValid()) {
        return 'Invalid date or time';
    }

    if (dateMoment.isSame(now, 'day')) {
        return `Сегодня, ${timeMoment.format('HH:mm')}`;
    }

    return `${dateMoment.format('DD.MM.YYYY')}, ${timeMoment.format('HH:mm')}`;
}

