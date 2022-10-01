const alertBox = document.getElementById("alert");
const nameRegex = /([a-zA-Z0-9]){2,12}/;
const emailRegex = /([a-zA-Z0-9]){6,18}@([a-zA-Z0-9]){5,8}.com/;

function showAlert(alertType, title, alertContent) {
    alertBox.innerHTML = `
            <div class="alert-${alertType.toLowerCase()}" role="alert">
                <strong class="font-bold"> ${title} </strong>
                <span class="block sm:inline"> ${alertContent} </span>
                <span class="alert-span" onclick="alertBox.innerHTML = ''">
                    <svg class="cross-icon-${alertType.toLowerCase()}" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
    `
}

$("#contact-form").submit(event => {
    event.preventDefault();
    
    const formData = {
        "name" : $("input[name=name]").val(),
        "email" : $("input[name=email]").val(),
        "message" : $("textarea[name=message]").val()
    }
    const method = {
        type : "POST",
        url : "/contact/",
        data : formData
    }

    $("input[name]").val("");
    $("textarea[name]").val("");

    if (nameRegex.test(formData["name"]) && emailRegex.test(formData["email"])) {
        $.ajax(method).done(data => {
            showAlert("SUCCESS", "Success!", `${data.name} your message is send to the admin`);
        })
    }
    else {
        showAlert("DANGER", "Error!", "There is an issue in sending your message.");
    }
})