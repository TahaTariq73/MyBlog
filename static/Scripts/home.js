const postContainer = document.getElementById("posts-container");
const prevPosts = document.getElementById("prev-posts");
const nextPosts = document.getElementById("next-posts");

function showPosts(posts) {
    postContainer.innerHTML = "";
    posts.forEach((element, index) => {
        postContainer.innerHTML += `
        <a href="/posts/${element.post_id}" class="flex flex-col justify-center py-12 cursor-pointer">
            <h2 class="text-2xl text-indigo-700 title-font mb-2 font-bold"> ${element.post_title} </h2>
            <p class="leading-relaxed"> ${element.post_content.slice(0, 400)} . . . </p>
            <p class="text-indigo-700 inline-flex items-center mt-4"> ${element.post_date} </p>
        </a>
        `.concat(
            (index < (posts.length-1) ? "<hr>" : "")
        )
    })
}

let postsData;
let slicingRange = [0, 3];
fetch("/posts/").then(response => response.json()).then(data => {
    if (data.status == 200) {
        postsData = data;
        showPosts(postsData.posts.slice(slicingRange[0], slicingRange[1]));
    }
})

prevPosts.addEventListener("click", () => {
    if ((slicingRange[1] - 3) > 3 || 
        (slicingRange[1] - 2) > 3 || 
        (slicingRange[1] - 1) > 3) {
        slicingRange[0] -= 3;
        slicingRange[1] -= 3;
        showPosts(postsData.posts.slice(slicingRange[0], slicingRange[1]));
    } 
})
nextPosts.addEventListener("click", () => {
    if ((slicingRange[1] + 3) < (postsData.posts.length+1) || 
        (slicingRange[1] + 2) < (postsData.posts.length+1) || 
        (slicingRange[1] + 1) < (postsData.posts.length+1)) {
        slicingRange[0] += 3;
        slicingRange[1] += 3;
        showPosts(postsData.posts.slice(slicingRange[0], slicingRange[1]));
    } 
})