import moment from 'moment';
import 'moment/locale/ru';
import dayjs from "dayjs";

// Устанавливаем локализацию на русский язык
moment.locale('ru');

export function getDates(page: number) {
    const dates = [];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

    let currentDate = new Date();

    // Вычисляем начальную дату для данной страницы
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + (page - 1) * 40);

    for (let i = 0; i < 40; i++) {
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
    startDate.setDate(startDate.getDate() + (page - 1) * 40);

    // Вычисляем конечную дату для данной страницы
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 39); // Поскольку каждая страница содержит 40 дней, последняя дата будет через 39 дней

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

type Props = {
    inputDate?: string,
    inputTime?: string,
    isoDateTime?: string
}

export function formatDateTime({inputDate, inputTime, isoDateTime}: Props): string {
    const now = moment();
    let dateMoment, timeMoment;

    if (isoDateTime) {
        const isoMoment = moment(isoDateTime);
        if (!isoMoment.isValid()) {
            return 'Invalid ISO date-time';
        }
        dateMoment = isoMoment;
        timeMoment = isoMoment;
    } else {
        dateMoment = moment(inputDate);
        timeMoment = moment(inputTime, 'HH:mm:ss');
    }

    if (!dateMoment.isValid() || !timeMoment.isValid()) {
        return 'Invalid date or time';
    }

    if (dateMoment.isSame(now, 'day')) {
        return `Сегодня, ${timeMoment.format('HH:mm')}`;
    }

    return `${dateMoment.format('DD.MM.YYYY')}, ${timeMoment.format('HH:mm')}`;
}

export function removeSeconds(time?: string): string {
    // Проверка на undefined или пустую строку
    if (!time) {
        return '';
    }

    // Разделяем строку времени на компоненты
    const parts = time.split(':');

    // Проверка, что частей ровно три (HH, MM, SS)
    if (parts.length !== 3) {
        return '';
    }

    const [hours, minutes] = parts;
    // Проверка, что часы и минуты состоят из двух цифр
    if (hours.length !== 2 || minutes.length !== 2) {
        return '';
    }

    // Возвращаем строку в формате "HH:MM"
    return `${hours}:${minutes}`;
}

// 2024-05-24 => Пятница, 24 мая
// export function formatDateToDayMonth(dateStr: string): string {
//     return moment(dateStr).format('dddd, D MMMM');
// }

export function formatDateToDayMonth(dateStr: string): string {
    const date = new Date(dateStr);
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${day} ${month}`;
}

// Принимает дату и возвращает предыдущую дату 2024-06-24 => 2024-06-23.
// Но если предыдущий день суббота или воскресенье тогда вернут 'weekend'
export function getPreviousDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);

    const day = date.getDay();

    if (day === 0 || day === 6) {
        return 'weekend';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
}

export const datePickerFormatter = (
    date: string | number,
    format = 'YYYY-MM-DD'
): dayjs.Dayjs => dayjs(date, format);

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export const formatDateToString = (date: Date | string | number | null, format = 'YYYY-MM-DD') => {
    if (!date) {
        return undefined;
    }

    return moment(date).format(format);
};

// Пример использования
// Output: Date => '2024-07-13'

