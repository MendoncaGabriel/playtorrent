function saveCookie(name, data, expirationDays){
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie = `${name}=${data}; expires=${expirationDate.toUTCString()}; path=/`;
}

