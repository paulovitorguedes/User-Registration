class UserController {

    constructor(panelUserCreateEl, panelUserUpdateEl, tableUsersEl) {

        this._formCreateEl = panelUserCreateEl.querySelector("[role='form']");
        this._formUpdateEl = panelUserUpdateEl.querySelector("[role='form']");
        this._tableEl = tableUsersEl;
        this._panelCreate = panelUserCreateEl;
        this._panelUpdate = panelUserUpdateEl;

        this.onPrevewPhoto(this._formCreateEl);
        this.showPanelUserCreate();
        this.onEdit();
        this.onSubmit();

    }


    selectStorageUser() {

    }


    // Apresenta uma imagem do avatar selecionado no form indicado
    onPrevewPhoto(form) {

        let inputFileEl = form.querySelector('[type=file]');

        inputFileEl.addEventListener('change', () => {

            let photoEl = form.getElementsByTagName('img')[0];

            this.getPhoto(inputFileEl).then(
                content => {
                    photoEl.src = content;
                }, error => {
                    console.error(error);
                }
            );
        });

    } // close onPrevewPhoto






    //Adiciona o evento para os btn do painel Editar usuário
    onEdit() {

        //Adiciona o evento para o botão cancelar do painel editar usuário
        let btnCancel = this._formUpdateEl.querySelector("[type='button']");
        btnCancel.addEventListener("click", e => {
            this.showPanelUserCreate();
        });



        //Evento do Btn Submit "Salvar" do painel Editar usuário
        this._formUpdateEl.addEventListener('submit', btn => {

            //Para o evento pré definido do btn 
            btn.preventDefault();

            //desabilita o btn submit para não ocorrer disparos simultaneos
            let btnSubmit = this._formUpdateEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;


            //valuesUser recebe o object User ou o valor "false" no caso de não validação do formulário
            let valueUser = this.getValuesUser(this._formUpdateEl);
            if (!valueUser) {

                btnSubmit.disabled = false;
                return false;
            }

            //Cada tr da tabela possui um btn editar e ao ser clicado será criado um dataset trIndex no elemento form com o indice dessa tr e sendo recuperado nesse momento 
            //a variável tr será o elemento da tr correspondente ao indice indicado 
            let tr = this._tableEl.rows[this._formUpdateEl.dataset.trIndex];

            //altera o dataset user da tr com as novas alterações 
            let imgAvatarEl = this._formUpdateEl.getElementsByTagName('img')[0];
            valueUser.photo = imgAvatarEl.getAttribute('src');
            tr.dataset.user = JSON.stringify(valueUser);
            

            //Altera o innerHTML da tr com as novas informações do objeto valueUser
            tr.innerHTML = `
                <td><img src="${valueUser.photo}" alt="Avatar Image" class="img-circle img-sm"></td>
                <td>${valueUser.name}</td>
                <td>${valueUser.email}</td>
                <td>${valueUser.admin ? "yes" : "no"}</td>
                <td>${Utils.dateFormat(valueUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat btn-del">Excluir</button>
                </td>
            `;

            //Por se tratar de um novo element, será necessário criar um novo evento para os btn Editar e Excluir
            this.addEventTr(tr);

            //contabiliza os usuários cadastrados 
            this.updateCount();

            //retorna o painel Novo Usuário
            this.showPanelUserCreate();

            //reseta o from updade user
            this._formUpdateEl.reset();
            imgAvatarEl.src = 'dist/img/avatar_user.png';
            btnSubmit.disabled = false;

        });
    } //close onEdit






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
            let valueUser = this.getValuesUser(this._formCreateEl);
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
            let inputFileEl = this._formCreateEl.querySelector('[type=file]');
            this.getPhoto(inputFileEl).then(
                content => {
                    valueUser._photo = content;
                    this.addLineUser(valueUser);
                    this.addStorageUser(valueUser);
                }, error => {
                    console.error(error);
                }
            );



            this._formCreateEl.reset();
            this._formCreateEl.getElementsByTagName('img')[0].src = 'dist/img/avatar_user.png';
            btnSubmit.disabled = false;

        });
    } // Close onSubmit





    //Retorna o objeto com os valores do usuário
    getValuesUser(formEl) {
        let isValid = true;
        const user = {}; //JSON USER

        //Utiliza-se o spred criando um Array para funcionalidade do forEach
        [...formEl.elements].forEach(e => {

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







    getPhoto(inputFileEl) {
        //O promise é executado de forma assincrona 
        return new Promise((resolve, reject) => {

            //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
            // Cria um objeto FileReader para ler o arquivo
            let fileReader = new FileReader();

            //Recupera o elemento input type="file" onde name === 'photo'. Atribuindo a variável element
            // let element = [...this._formCreateEl.elements].filter(e => {
            //     if (e.name === 'photo') {
            //         console.log(e);
            //         return e;
            //     }
            // });

            //Função de callBack para quando o PC finalizar a leituta do arquivo
            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e);
            }

            let file = inputFileEl.files[0];
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/avatar_user.png');
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
        //Cria o elemento tr 
        let tr = document.createElement('tr');

        //? Dataset é uma API WEB permite leitura e escrita em elementos HTML, armazemando apenas String
        //? Para cada elemento tr será criado um dataset com uma variável denominada user recebendo uma String Json do OsjectUser
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


        this.addEventTr(tr);

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



    //Adiciona os dados do usuário na Session Storage
    addStorageUser(dataUser) {

        let users = this.isStorageUser();

        users.push(dataUser);
        sessionStorage.setItem('keyUsers', JSON.stringify(users));
        
    }//close addStorageUser



    //Adiciona os eventos dos btn de cada tr da table
    addEventTr(tr) {

        tr.querySelector(".btn-del").addEventListener('click', () => {

                if (confirm('Deseja realmemte excluir este usuário? ')) {
                    tr.remove();
                    this.updateCount();
                }
        });


        //Cria o evento pra o btn editar usuário situado em cada tr com os dados do usuário
        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let objectUserJson = JSON.parse(tr.dataset.user);
            this.showPanelUserUpdate();

            //Adiciona um dataset ao elemento form update com o atributo trIndex contendo o index da tr selecionada ao clicar no btn editar
            this._formUpdateEl.dataset.trIndex = tr.sectionRowIndex; //? sectionRowIndex contabiliza cada linha da tabela iniciando com 0

            //Adiciona o eento ao elemento input=file apresentando a imagem do avatar no form após ser selecionada
            this.onPrevewPhoto(this._formUpdateEl);

            //Preencher o form Update com os dados do usuário selecionado na tabela com o btm editar, ajustando os fields file da foto, radio de gender e checkbox de adm
            for (const key in objectUserJson) {

                let fieldEl = this._formUpdateEl.querySelector("[name=" + key.replace("_", "") + "]");
                if (fieldEl) {
                    switch (fieldEl.type) {
                        case 'file':
                            let photoEl = this._formUpdateEl.getElementsByTagName('img')[0];
                            photoEl.src = objectUserJson[key];
                            break;

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
    } //close addEventTr









    //contabilisa usuários e adm cadastrados 
    updateCount() {

        let numberUser = 0;
        let numberAdmin = 0;

        [...this._tableEl.children].forEach(e => {

            numberUser++;
            if (JSON.parse(e.dataset.user)._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUser;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    } // close updateCount






    //Retorna um Array de User object
    isStorageUser() {

        let users = [];

        if (sessionStorage.getItem('keyUsers')) {
            users = JSON.parse(sessionStorage.getItem('keyUsers'));
        }

        return users;

    } //close isStorageUser





    //Alterna os paineis novo usuário e editar usuário
    showPanelUserCreate() {

        this._panelCreate.style.display = "block";
        this._panelUpdate.style.display = "none";
    }

    showPanelUserUpdate() {

        this._panelCreate.style.display = "none";
        this._panelUpdate.style.display = "block";
    }
}