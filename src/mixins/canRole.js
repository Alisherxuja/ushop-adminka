const canRole = function () {
    let args = Array.prototype.slice.call(arguments, 0);
    let role = localStorage.getItem('role') || '';
    let hasAccess = true;
    if (args[0].indexOf(role) >= 0) {
        hasAccess = true;
    }
    return hasAccess;
};

export default canRole;
