export function copyToBoard(text: string) {
    const el = document.createElement('input')
    el.setAttribute('value', text)
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
}
