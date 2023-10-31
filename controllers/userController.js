class UserController {

    constructor(formId, tableId) {
        this._formEl = document.getElementById(formId);
        this._tableEl = document.getElementById(tableId);

        this.onSubmitUser();
    }


    //Criando o evento para o botão submit do formulário de usuários
    onSubmitUser() {
        this._formEl.addEventListener('submit', e => {
            //Para o evento pré definido 
            e.preventDefault();

            //desabilita o btn submit para não ocorrer disparos simultaneos
            let btnSubmit = this._formEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;

            //valuesUser recebe o object User
            let valueUser = this.getValuesUser();

            //ajusta a URL do arquivo, removendo o \\fakepath
            // this.getPhoto(content => {
            //     valueUser._photo = content;
            //     addLineUser(valueUser);
            // });

            //ajusta a URL do arquivo, removendo o \\fakepath
            this.getPhoto().then(
                content => {
                    valueUser._photo = content;
                    this.addLineUser(valueUser);
                }, error => {
                    console.error(error);
                }
            );
            
            this._formEl.reset();
            btnSubmit.disabled = false;

        });
    } // Close onSubmit

    //Retorna o objeto com os valores do usuário
    getValuesUser() {

        const user = {}; //JSON USER

        //Utiliza-se o spred criando um Array para funcionalidade do forEach
        [...this._formEl.elements].forEach(e => {

            if (e.name == "gender") {

                if (e.checked) { user[e.name] = e.value; }

            } else if (e.name == "admin") {

                user[e.name] = e.checked;

            } else {
                user[e.name] = e.value;
            }

        });

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    } // Close getValuesUser


    getPhoto() {
        //O promise é executado de forma assincrona 
        return new Promise((resolve, reject) => {

            //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
            let fileReader = new FileReader();

            let element = [...this._formEl.elements].filter(e => {
                if (e.name === 'photo') {
                    return e;
                }
            });

            //Função de callBack para quando o PC finalizar a leituta do arquivo
            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e);
            }

            let file = element[0].files[0];
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });


        // getPhoto(calback) {
        //     //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
        //     let fileReader = new FileReader();
        //     let element = [...this._formEl.elements].filter(e => {
        //         if (e.name === 'photo') {
        //             return e;
        //         }
        //     })  
        //     //Função de callBack para quando o PC finalizar a leituta do arquivo
        //     fileReader.onload = () => {
        //         calback(fileReader.result);
        //     }
        //     let file = element[0].files[0];
        //     fileReader.readAsDataURL(file);
        // } //Close getPhoto


    } //Close getPhoto






    addLineUser(objectUser) {

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${objectUser.photo}" alt="Avatar Image" class="img-circle img-sm"></td>
            <td>${objectUser.name}</td>
            <td>${objectUser.email}</td>
            <td>${objectUser.admin ? "yes" : "no"}</td>
            <td>${objectUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this._tableEl.appendChild(tr);

        // this._tableEl.innerHTML += `
        // <tr>
        //     <td><img src="${objectUser.photo}" alt="Avatar Image" class="img-circle img-sm"></td>
        //     <td>${objectUser.name}</td>
        //     <td>${objectUser.email}</td>
        //     <td>${objectUser.admin}</td>
        //     <td>${objectUser.birth}</td>
        //     <td>
        //         <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        //         <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        //     </td>
        // </tr>

    }// Close addLineUser
}