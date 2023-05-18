export function stringFirstCapital(text = "") {
    const firstCapital = text.substring(0, 1).toUpperCase();
    const lastText = text.substring(1, text.length);

    return firstCapital + lastText;
}
