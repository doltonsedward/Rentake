function notif(title, text, status, ...rest) {
    Swal.fire({
        title: title ?? 'Error!',
        text: text ?? 'Do you want to continue',
        icon: status ?? 'error',
        ...rest
    })
}