class UserController {

    constructor(panelUserCreateEl, panelUserUpdateEl, tableUsersEl) {

        this._formCreateEl = panelUserCreateEl.querySelector("[role='form']");
        this._formUpdateEl = panelUserUpdateEl.querySelector("[role='form']");
        this._tableEl = tableUsersEl;
        this._panelCreate = panelUserCreateEl;
        this._panelUpdate = panelUserUpdateEl;

        this.showPanelUserCreate();
        this.onEdit();
        this.onSubmit();

    }


    onEdit() {

        //Adiciona o evento para o botão canci=elar do painel editar usuário
        let btnCancel = this._formUpdateEl.querySelector("[type='button']");
        btnCancel.addEventListener("click", e => {
            this.showPanelUserCreate();
        });
    }

    //Adiciona o evento para o botão submit do painel cadastrar usuário
    onSubmit() {

        //Evento do Btn Submit "Salvar" do painel novo usuário
        this._formCreateEl.addEventListener('submit', btn => {

            //Para o evento pré definido do btn 
            btn.preventDefault();

            //desabilita o btn submit para não ocorrer disparos simultaneos
            let btnSubmit = this._formCreateEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;

            //valuesUser recebe o object User ou o valor "false" no caso de não validação do formulário
            let valueUser = this.getValuesUser();
            if (!valueUser) {

                btnSubmit.disabled = false;
                return false;
            }


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

            this._formCreateEl.reset();
            btnSubmit.disabled = false;

        });
    } // Close onSubmit

    //Retorna o objeto com os valores do usuário
    getValuesUser() {
        let isValid = true;
        const user = {}; //JSON USER

        //Utiliza-se o spred criando um Array para funcionalidade do forEach
        [...this._formCreateEl.elements].forEach(e => {

            if (["name", "email", "password"].indexOf(e.name) > -1 && !e.value) {

                //adiciona a classe .has-error ao elemento PAI
                e.parentElement.classList.add("has-error");
                isValid = false;

            } else if (e.name == "gender") {

                if (e.checked) { user[e.name] = e.value; }

            } else if (e.name == "admin") {

                user[e.name] = e.checked;

            } else {
                user[e.name] = e.value;
            }

        });

        if (isValid) {
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
        } else {
            return false;
        }


    } // Close getValuesUser


    getPhoto() {
        //O promise é executado de forma assincrona 
        return new Promise((resolve, reject) => {

            //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
            let fileReader = new FileReader();

            let element = [...this._formCreateEl.elements].filter(e => {
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
        //     let element = [...this._formCreateEl.elements].filter(e => {
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

        //? Dataset é uma API WEB permite leitura e escrita em elementos HTML, armazemando apenas String
        //? No elemento tr será criado um dataset com uma variável denominada user recebendo uma String Json do OsjectUser
        tr.dataset.user = JSON.stringify(objectUser);

        tr.innerHTML = `
            <td><img src="${objectUser.photo}" alt="Avatar Image" class="img-circle img-sm"></td>
            <td>${objectUser.name}</td>
            <td>${objectUser.email}</td>
            <td>${objectUser.admin ? "yes" : "no"}</td>
            <td>${Utils.dateFormat(objectUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat btn-del">Excluir</button>
            </td>
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let objectUserJson = JSON.parse(tr.dataset.user);
            this.showPanelUserUpdate();

            for (const key in objectUserJson) {
                
                let fieldEl = this._formUpdateEl.querySelector("[name=" + key.replace("_", "") + "]");
               
                if (fieldEl) {
                    switch (fieldEl.type) {
                        case 'file':
                            continue;
                        
                        case 'radio':
                            fieldEl = this._formUpdateEl.querySelector("[name=" + key.replace("_", "") + "][value=" + objectUserJson[key] + "]");
                            fieldEl.checked = true;
                            break;

                        case 'checkbox':
                            fieldEl.checked = objectUserJson[key];
                            break;

                        default:
                            fieldEl.value = objectUserJson[key];
                            break;
                    }
                }

                
            }
        });


        this._tableEl.appendChild(tr);

        this.updateCount();

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


    updateCount() {

        let numberUser = 0;
        let numberAdmin = 0;

        [...this._tableEl.children].forEach(e => {

            numberUser++;
            if (JSON.parse(e.dataset.user)._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUser;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }


    showPanelUserCreate() {

        this._panelCreate.style.display = "block";
        this._panelUpdate.style.display = "none";
    }

    showPanelUserUpdate() {

        this._panelCreate.style.display = "none";
        this._panelUpdate.style.display = "block";
    }
}