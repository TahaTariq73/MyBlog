$("#post-form").submit(event => {
    event.preventDefault();
    
    const formData = {
        "title" : $("input[name=title]").val(),
        "content" : $("textarea[name=content]").val()
    }
    const method = {
        type : "POST",
        url : "/admin/addpost/",
        data : formData
    }

    $("input[name]").val("");
    $("textarea[name]").val("");

    $.ajax(method).done(data => {
        document.getElementById("table-body").innerHTML += `
            <tr class="border-b">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> ${data.sno} </td>
                <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"> ${data.title} </td>
                <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                <a href="/admin/deletepost/${data.sno}"
                    class="bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded">
                    Delete
                </a>
                </td>
                <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                <a href="#"
                    class="edit-btn ${data.sno} bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded">
                    Edit
                </a>
                </td>
            </tr>
        `
        $(".edit-btn").click(e => {
            edit(e);
        })
    })
})

function edit(e) {
    const method = {
        type : "POST",
        url : `/admin/editpost/${e.target.classList[1]}`,
        data : {}
    }

    $.ajax(method).done(data => {
        $("input[name]").val(data.title);
        $("textarea[name]").val(data.content);
        e.target.parentNode.parentNode.innerHTML = "";
    })
}

$(".edit-btn").click(e => {
    edit(e);
})