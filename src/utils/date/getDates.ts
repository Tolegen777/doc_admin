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
