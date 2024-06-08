export function mergeAndRemoveDuplicates(array1: number[], array2: number[]): number[] {
    // Объединяем два массива
    const combinedArray = [...array1, ...array2];

    // Используем Set для удаления дублирующихся элементов
    return Array.from(new Set(combinedArray));
}
