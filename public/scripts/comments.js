const show_comment_btn = document.getElementById("show-comment-btn");
const commentSection = document.getElementById("comments");
const leaveCommentSection = document.querySelector("#comments-form form");
let isClikShowComment = false;

function prepareCommentList(comments) {
  //it gives an array and returns a list element with comments
  const commentList = document.createElement("ol");
  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
        <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
        </article>
        `;
    commentList.appendChild(commentElement);
  }
  return commentList;
}

async function fetchCommentForPost() {
  // it sends a get request to target url and take a array of json

  const postID = show_comment_btn.dataset.postid;
  try {
    const response = await fetch(`/posts/${postID}/comments`);
    const responseData = await response.json(); // array
    if (!response.ok) {
        alert('Fetching comments failed!')
    }
    if (responseData.length > 0) {
      isClikShowComment = true;
      commentSection.innerHTML = ""; // to remove btn and prevent comment redundancy
      commentSection.appendChild(prepareCommentList(responseData));
    }
    else {
      commentSection.firstElementChild.textContent = 'This content does not hav any comment!';
    }
  }catch(error) {
    alert ('Getting comments failed!');

  }
 
}

async function saveNewComment(event) {
  event.preventDefault();
  const postID = show_comment_btn.dataset.postid;
  const formData = new FormData(leaveCommentSection);

  const comment_title = formData.get("title");
  const comment_body = formData.get("text");
  if (comment_title.trim() === "" || comment_body.trim() === "") {
    alert("Please enter a value!");
    return;
  }
  const comment = {
    title: comment_title,
    text: comment_body,
  };
  commentSection.firstElementChild.textContent = 'If you see comments please click this⬇️';

  leaveCommentSection.reset();
  try {
    const response = await fetch(`/posts/${postID}/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "content-type": "application/json",
        },
      });
      if(!response.ok) {
        alert('Could not send comment.')
        return;
      }
      if (isClikShowComment) {
        fetchCommentForPost();
      }
  }catch (error) {
    alert ('Could not sen request, maybe try again later?');
  }
 
}

show_comment_btn.addEventListener("click", fetchCommentForPost);
leaveCommentSection.addEventListener("submit", saveNewComment);
