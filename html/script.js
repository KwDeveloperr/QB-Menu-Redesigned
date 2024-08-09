let buttonParams = [];

const openMenu = (data = null) => {
    if (data && data.length > 0) {
        let html = "";
        data.forEach((item, index) => {
            if (!item.hidden) {
                let header = item.header || "Menu";
                let message = item.txt || item.text;
                let isMenuHeader = item.isMenuHeader;
                let isDisabled = item.disabled;
                let icon = item.icon;
                html += getButtonRender(header, message, index, isMenuHeader, isDisabled, icon);
                if (item.params) buttonParams[index] = item.params;
            }
        });

        $("#menu-buttons").html(html);
        $("#menu-container").removeClass("hidden");
        $("#menu-container").fadeIn(500);

        $('.menu-item').click(function () {
            const target = $(this);
            if (!target.hasClass('menu-header') && !target.hasClass('disabled')) {
                target.addClass('button-pressed');
                setTimeout(() => {
                    target.removeClass('button-pressed');
                    postData(target.attr('id'));
                }, 150);
            }
        });
    }
};

const closeMenu = () => {
    $("#menu-container").fadeOut(500, function() {
        $("#menu-buttons").html("");
        $("#menu-container").addClass("hidden");
        buttonParams = [];
    });
};

const getButtonRender = (header, message = null, id, isMenuHeader, isDisabled, icon) => {
    if (isMenuHeader) {
        return `<div class="menu-header">${header}</div>`;
    } else {
        return `
            <div class="menu-item ${isDisabled ? "disabled" : ""}" id="${id}">
                <div class="menu-icon"><i class="${icon}"></i></div>
                <div>
                    <div class="menu-title">${header}</div>
                    ${message ? `<div class="menu-description">${message}</div>` : ""}
                </div>
            </div>
        `;
    }
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode === "Escape") {
        cancelMenu();
    }
};
