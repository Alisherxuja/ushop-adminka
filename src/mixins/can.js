const can = function () {
    let args = Array.prototype.slice.call(arguments, 0);
    let permissions = JSON.parse(localStorage.getItem('permissions')) || [];
    let hasAccess = true;

    permissions.forEach(perm => {
        if (args.indexOf(perm) >= 0) {
            hasAccess = true;
        }
    });
    return hasAccess;
};

export default can;
