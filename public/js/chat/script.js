
//ENVIAR MENSAGEM
async function enviar() {
  const comment = document.querySelector("#commitTextArea");

  if (comment.value.length > 0) {
    const cookie = getCookie("tokenUser");
    const idUser = getCookie("idUser");
   
    if (!cookie) {
      return alert("Por favor, faça login para, comentar!");
    }
    
    fetch("/services/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + cookie,
      },
      body: JSON.stringify({
        comment: comment.value,
        idUser: idUser,
        idPage: id,
        userName: getCookie('nameUser'),
        date: dateNow()
      }),
    })
    .then((res) => res.json())
    .then((response) => {
      if (response) {
        comment.value = "";
        console.log("Comentário enviado!");
        getComments();
      }
    })
    .catch((erro) => {
      console.log("Erro ao enviar o comentário");
      alert("Não foi possível enviar seu comentário!");
    });
  }
}


//DELETAR MENSAGEM
function deleteMsg(id){
  const resultado = window.confirm("Deseja realmente fazer isso?");

  if (resultado) {
    console.log('deletando: ' + id)
    const cookie = getCookie("tokenUser");
    const userId = getCookie("idUser");
  
    fetch('/services/chat', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + cookie,
      },
      body: JSON.stringify({
        commentId: id,
        userId: userId
      })
    })
    .then(res => res.json())
    .then((response)=>{
      if(response.success){
        getComments()
        console.log('Atualizando....')
      }
    })
    
  } 
}

//PEGAR COMENTARIOS
function getComments() {

  fetch("/services/chat/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((response) => {
 

    if (response.length !== 0 && response.length !== null && response.length !== 'undefined') {
      const idUser = getCookie("idUser");
      document.getElementById("containerComments").innerHTML = "";
      // response.comments.reverse();

      response.forEach((element) => {

        //Comentario do usuario
        if (element.idUser && element.idUser == idUser) {
          document.getElementById("containerComments").innerHTML += `
                  <div class=" bg-green-800 px-4 py-2 gap-4 relative">
                      <div class="flex items-start gap-4 px-4 py-2">

                          <div class="flex-shrink-0">
                              <img 
                              src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" 
                              alt="foto de perfil do usuario"
                              class="w-12 h-12 rounded-full object-cover"
                              >
                          </div>
                          
                          <div class="flex flex-col w-full bg-white p-4 rounded-md shadow-md">
                              <h2 class="text-lg font-semibold mb-2 text-gray-800">${element.userName}</h2>
                              <p class="text-gray-700">
                                  ${element.comment}
                              </p>
                              <p class="text-sm text-gray-500 mt-2">${element.date}</p>
                          </div>
                      </div>
                      <div class=" flex justify-end space-x-4 pt-4">
                          <button class="px-4 py-2 bg-blue-500" onclick="uptadeMsg('${element._id}', '${element.comment}')">Editar</button>
                          <button class="px-4 py-2 bg-red-500" onclick="deleteMsg('${element._id}')">Deletar</button>
                      </div>  

          
                  </div>
                  `;
        }
        //Comentario de outro usuario
        else {
          document.getElementById("containerComments").innerHTML += `
                      <div class="flex items-start bg-gray-800 px-4 py-2 gap-4 relative">
                          <div class="flex-shrink-0">
                              <img 
                                  src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" 
                                  alt="foto de perfil do usuario"
                                  class="w-12 h-12 rounded-full object-cover"
                              >
                          </div>
                      
                          <div class="flex flex-col w-full bg-white p-4 rounded-md shadow-md">
                              <h2 class="text-lg font-semibold mb-2 text-gray-800">${element.userName}</h2>
                              <p class="text-gray-700">
                                  ${element.comment}
                              </p>
                              <p class="text-sm text-gray-500 mt-2">${element.date}</p>
                          </div>
                      </div>
                  `;
        }
      });
      scrolDownChat()
    }else{
      document.getElementById("containerComments").innerHTML = `<h2 class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Seja o primeiro a comentar :)</h2>`
    }
  });
  

}getComments();



// ATUALIZAR MENSAGEM
function uptadeMsg(commentId, comment) {
  const commitTextArea = document.getElementById('commitTextArea');
  commitTextArea.value = comment;


  const btnEnviar = document.getElementById('btnEnviar');
  btnEnviar.setAttribute('onclick', `sendUpdateMsg('${commentId}')`)

  
}

function sendUpdateMsg(commentId) {
  const commitTextArea = document.getElementById('commitTextArea');
  const cookie = getCookie("tokenUser");
  const userId = getCookie("idUser");
  console.log('enviando atualização');



  fetch("/services/chat", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + cookie,
    },
    body: JSON.stringify({
      commentNew: commitTextArea.value,
      userId: userId,
      commentId: commentId,
    })
  })
  .then(res => res.json())
  .then((response) => {
    console.log(response);
    getComments();
  })
  .catch(error => console.error('Erro na requisição:', error));

  // Ao final
  const btnEnviar = document.getElementById('btnEnviar');
  btnEnviar.setAttribute('onclick', 'enviar()')
  commitTextArea.value = ''
}







document.getElementById("commitTextArea").addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    enviar();
  }
});






document.addEventListener("DOMContentLoaded", scrolDownChat);

function scrolDownChat() {
  var container = document.getElementById("containerComments");
  setTimeout(function() {
    container.scrollTop = container.scrollHeight;
  }, 100);
}
