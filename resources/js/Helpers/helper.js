export function stringFirstCapital(text = "") {
    const firstCapital = text.substring(0, 1).toUpperCase();
    const lastText = text.substring(1, text.length);

    return firstCapital + lastText;
}

export function rupiah(number = 0) {
    const rupiahNumber = new Intl.NumberFormat("id-ID", {
        style: 'currency',
        currency: 'IDR',
    }).format(number);

    return rupiahNumber;
}
